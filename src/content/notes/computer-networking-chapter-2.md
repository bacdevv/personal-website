---
title: "Computer Networking — Chapter 2: The Application Layer"
description: "A practical guide to client–server networking, HTTP, FTP, email protocols, DNS, peer-to-peer applications and TCP/UDP sockets."
subject: Computer Networking
date: "2026-10-10"
draft: false
tags: ["computer-networking", "application-layer", "http", "ftp", "smtp", "dns", "sockets"]
---

The **application layer** provides the protocols that applications use to exchange information. First learn how processes communicate; then study the Web, file transfer, mail, and name resolution.

**Source:** Kurose and Ross, *Computer Networking: A Top-Down Approach*, sixth edition, Chapter 2, printed pp. 83–184 (PDF pp. 110–211). Worked examples and review exercises are newly written study aids. Examples referring to newer protocol versions are marked as extra context.

## Learning objectives

By the end, explain the roles of HTTP, FTP, SMTP, POP3, IMAP, and DNS; distinguish client–server from peer-to-peer systems; follow a Web request step by step; identify common ports; and recognize the socket interface for UDP and TCP.

**Prerequisites:** [Chapter 1 — Networks and the Internet](/notes/computer-networking-chapter-1/), especially hosts, packets, layering, and delay.

## 2.1 Principles of Network Applications

### 2.1.1 Network application architectures

A **client** initiates a request; a **server** is reachable and provides a service. In a **client–server architecture**, servers commonly have stable hostnames or addresses and clients request resources. In **peer-to-peer (P2P)** architecture, participating hosts may act as both clients and servers and exchange resources directly.

**Example:** Your browser asks a server for a webpage. In file-sharing systems, one peer may download one piece of a file while uploading another piece to someone else.

### 2.1.2 Processes communicating

An **application process** is a program running on a host. Processes on different hosts communicate by sending messages through **sockets**. An Internet service typically identifies a destination using an **IP address** and a **port**. The IP address helps reach the host; the port directs data to the correct receiving process.

```text
Browser process ── socket ── Internet transport service ── socket ── Web server process
```

A **socket** is not a physical cable. It is a programming interface to network services.

### 2.1.3 Transport services available to applications

Applications may require **reliable delivery**, a particular **throughput**, bounded **timing**, or **security**. For instance, a file should arrive correctly; interactive audio is sensitive to delay and jitter. No single transport protocol is optimal for every requirement.

### 2.1.4 Transport services provided by the Internet

**TCP** supplies a connection-oriented reliable byte stream with flow and congestion control. **UDP** supplies best-effort datagram delivery, without built-in reliability, ordering, or congestion control. The textbook's transport comparison is about the service model in the sixth edition; **encryption is not automatic merely because TCP is used**.

### 2.1.5 Application-layer protocols

An **application protocol** defines message types, their fields, request/response behavior, and rules about who sends what and when. **HTTP**, **FTP**, **SMTP**, and **DNS** each solve a different application-level problem.

### 2.1.6 Network applications covered in this book

The chapter examines the Web, file transfer, email, DNS, P2P distribution, and socket programming. These provide examples of the client–server and P2P designs described above.

## 2.2 The Web and HTTP

### 2.2.1 Overview of HTTP

**HTTP (Hypertext Transfer Protocol)** transfers Web resources between a client and a server. A **URL** identifies a resource. A browser (HTTP client) sends a **request**, and the server returns a **response**. HTTP is described as **stateless** because its basic protocol does not require the server to retain a separate record of each client's previous HTTP requests.

```text
Browser                            Web server
   |  GET /index.html HTTP/1.1       |
   |  Host: example.com              |
   | ------------------------------> |
   |  HTTP/1.1 200 OK                |
   |  Content-Type: text/html        |
   | <------------------------------ |
   |     HTML body                   |
```

**Result:** HTTP carries application messages; IP addresses and routers belong to lower-layer delivery. The textbook primarily discusses HTTP/1.1 over TCP.

### 2.2.2 Non-persistent and persistent connections

A **non-persistent HTTP** interaction opens a separate TCP connection for each requested object. A **persistent connection** can reuse a TCP connection for multiple objects, reducing connection setup overhead. The distinction matters because a Web page commonly needs HTML plus images, scripts, and stylesheets.

**RTT (round-trip time)** is the time for a small signal to travel to the peer and back. Under the textbook's simplified, non-persistent HTTP model, the time for one object is approximately **2 RTT + object transmission time** (one RTT for TCP handshake, one for the request and initial response), ignoring other costs.

**Worked example:** If RTT is 40 ms and an object takes 10 ms to transmit, simplified non-persistent retrieval is $2(40)+10=90$ ms. Real networks may include DNS lookup, TLS setup, queueing, and additional connections.

### 2.2.3 HTTP message format

**Request messages** include a request line, headers, a blank line, and sometimes a body. **Response messages** include a status line, headers, a blank line, and sometimes a body.

```http
GET /notes HTTP/1.1
Host: example.com
Accept: text/html
```

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 13

Hello, world!
```

**Common methods:** `GET` retrieves a representation; `HEAD` requests metadata without the response body; `POST` submits data; `PUT` stores/replaces a representation in applicable APIs; `DELETE` requests removal. **Selected status codes:** `200` success; `301` redirect; `304` cached representation unchanged; `400` invalid request; `404` resource not found; `500` server error.

**Notice:** A `404` is an HTTP response from a server, not proof that DNS failed. **Additional modern context:** HTTP/2 and HTTP/3 exist; the sixth edition's detailed timing model centers on earlier HTTP behavior.

### 2.2.4 User-server interaction: cookies

A **cookie** is small client-side state sent in HTTP headers that can help associate multiple requests. A server may respond with `Set-Cookie`; the browser can send the cookie on later matching requests. Cookies support sessions and preferences, although they may also raise privacy concerns. **Stateless HTTP** and **stateful user sessions** are not contradictions: state can be implemented above the basic protocol.

### 2.2.5 Web caching

A **Web cache/proxy** stores copies of resources so later requests may be served closer to the user. Caching can reduce latency and upstream traffic. It also introduces questions about **freshness** and invalidation.

**Example:** Several computers request the same classroom image. A shared cache may avoid downloading an unchanged image repeatedly from the origin server.

### 2.2.6 The conditional GET

A conditional request asks whether a stored representation is still current. With an `If-Modified-Since` condition, the origin can return **304 Not Modified** instead of transferring the whole unchanged resource. This is a **validation** mechanism, not the same as blindly serving all cached content forever.

## 2.3 File Transfer: FTP

**FTP (File Transfer Protocol)** supports authenticated file exchange with a remote host. Classical FTP uses **two TCP connections**: a **control connection** (typically server port **21**) to send commands and replies, and a separate **data connection** for file or directory content.

```text
FTP client                 FTP server
    | ---- control TCP ---> | :21
    | <--- replies -------- |
    | ==== data TCP ======> | transfer files/listings
```

The control connection is usually maintained for the session, whereas data connections are opened as needed. FTP is **stateful**: the server tracks the user's login and session directory.

### 2.3.1 FTP commands and replies

Common FTP command names include `USER`, `PASS`, `LIST`, `RETR` (retrieve), `STOR` (store), and `QUIT`. The server responds with numerical reply codes and explanations.

**Compare FTP and HTTP:** FTP uses separate control and data channels. HTTP embeds request control information in HTTP messages and normally transports a resource on the selected HTTP connection.

**Security note (additional guidance):** Classical FTP can expose credentials and content unless protected. Modern deployments may prefer SFTP (a distinct SSH-based protocol) or FTPS (FTP secured with TLS); neither is the same protocol as ordinary FTP.

## 2.4 Electronic Mail in the Internet

An email system includes **user agents**, **mail servers**, and protocols for **sending** and **accessing** messages.

```text
Alice's mail app
      │ submits message
      ▼
Alice's mail server ── SMTP ──> Bob's mail server
                                         │
                                         ▼
                                Bob's mail app (IMAP / POP3)
```

### 2.4.1 SMTP

**SMTP (Simple Mail Transfer Protocol)** transfers mail to and between mail servers, using TCP. The textbook discusses server-to-server use with port **25**. A typical SMTP dialogue includes greeting (`HELO`/`EHLO`), sender (`MAIL FROM`), recipient (`RCPT TO`), message data (`DATA`), and completion (`QUIT`). **Additional modern context:** Client submission commonly uses port **587** with authentication and TLS where supported.

### 2.4.2 Comparison with HTTP

Both SMTP and HTTP transfer data between computers but serve different application workflows. The textbook compares them as **push-oriented SMTP** (sending mail onward) and **pull-oriented HTTP** (a client requests a Web resource). SMTP has email-specific commands and store-and-forward mail transfer; HTTP uses request/response resource access.

### 2.4.3 Mail message format

An email message has headers such as `From:`, `To:`, and `Subject:` followed by a blank line and the body. MIME supports attachments and multiple content types. **Message headers** are not identical to the SMTP envelope (`MAIL FROM`, `RCPT TO`).

### 2.4.4 Mail access protocols

| Protocol | Main purpose | Typical textbook port |
| --- | --- | --- |
| SMTP | Transfer outgoing messages between mail servers | TCP 25 |
| POP3 | Retrieve mail, historically often to a local client | TCP 110 |
| IMAP | Access, organize, synchronize mailbox state on a server | TCP 143 |
| HTTP | Browser-based webmail user interface | HTTP service |

**Additional modern context:** Encrypted POP3S uses TCP 995 and IMAPS uses TCP 993. Email services may provide additional web interfaces and APIs.

## 2.5 DNS — The Internet's Directory Service

### 2.5.1 Services provided by DNS

**DNS (Domain Name System)** translates a hostname such as `www.example.com` into data such as an IP address. It can also provide canonical-name aliases, mail-server records, and other DNS records. Humans remember hostnames; network delivery uses IP addresses.

**Important:** DNS is a **distributed database** and an **application-layer protocol**, not just one central server.

### 2.5.2 Overview of how DNS works

```text
User enters www.example.com
       ↓
Browser/OS checks available cached answer
       ↓ (cache miss)
Local DNS resolver
       ↓
Root → TLD (.com) → authoritative DNS server
       ↓
Resolver returns resource record (e.g., A / AAAA)
       ↓
Browser connects to the selected IP address
```

**Definition:** A **recursive resolver** finds the answer for its client; authoritative servers maintain records for domains. Root servers direct resolution toward relevant top-level domains (TLDs). Resolvers **cache** data according to its time to live (TTL).

**Protocol behavior in the sixth edition:** DNS queries commonly use **UDP port 53**; DNS can also use **TCP port 53**. Do not memorize "DNS always uses UDP". For a Web page, DNS resolution may occur before HTTP and therefore add latency.

### 2.5.3 DNS records and messages

| Record | Meaning | Example idea |
| --- | --- | --- |
| `A` | IPv4 address for a name | host → IPv4 |
| `AAAA` | IPv6 address for a name | host → IPv6 |
| `NS` | Authoritative name server | domain → name server |
| `CNAME` | Alias to canonical name | alias → canonical name |
| `MX` | Mail exchanger | domain → mail server |

A DNS message contains a header and sections including questions and resource records. The header can indicate queries/replies and whether an answer is authoritative. The `TTL` controls how long a record may be cached, not the physical duration of an Internet packet's path.

**Worked journey:** Enter `www.example.com` → obtain an address through DNS (or cache) → open an appropriate transport connection → issue an HTTP request → receive the response. DNS answers **where**; HTTP asks **for what**.

## 2.6 Peer-to-Peer Applications

### 2.6.1 P2P file distribution

A P2P system can distribute file chunks among peers, reducing dependence on one uploading server. As more peers join, aggregate upload capacity may increase. A peer can be a downloader **and** an uploader. The textbook compares client–server and P2P distribution times using server upload, peer upload, and download capacities.

For a file of $F$ bits, $N$ recipients, server upload rate $u_s$, and minimum download rate $d_{\min}$:

$$D_{\mathrm{CS}}\ge\max\left\{\frac{NF}{u_s},\frac{F}{d_{\min}}\right\}.$$

In a P2P distribution, an additional aggregate-capacity lower bound includes all peers' upload rates $u_i$:

$$D_{\mathrm{P2P}}\ge\max\left\{\frac{F}{u_s},\frac{F}{d_{\min}},\frac{NF}{u_s+\sum_i u_i}\right\}.$$

These are **ideal lower bounds**, not guarantees for a real swarm.

### 2.6.2 Distributed hash tables (DHTs)

A **DHT** is a decentralized way to map a key to a location or value across participating peers. A hash function maps identifiers into a shared numeric space. Nodes maintain routing information that helps locate responsible peers. DHTs address the question: **Which peer should I contact to find this key?**

## 2.7 Socket Programming: Creating Network Applications

**Why sockets matter:** HTTP and DNS are specific applications of a general mechanism: one process sends data to another. Sockets expose TCP or UDP communication to programs. These examples are **original instructional code**.

### 2.7.1 Socket programming with UDP

UDP has no connection establishment. Sender and receiver work with **individual datagrams**.

```python
# UDP server: run first
from socket import socket, AF_INET, SOCK_DGRAM
server = socket(AF_INET, SOCK_DGRAM)
server.bind(("127.0.0.1", 12000))
data, addr = server.recvfrom(2048)
server.sendto(data.upper(), addr)
server.close()
```

```python
# UDP client: run separately
from socket import socket, AF_INET, SOCK_DGRAM
client = socket(AF_INET, SOCK_DGRAM)
client.sendto(b"hello", ("127.0.0.1", 12000))
reply, _ = client.recvfrom(2048)
print(reply.decode())  # HELLO
client.close()
```

### 2.7.2 Socket programming with TCP

TCP establishes a connection and presents a **byte stream** rather than message-delimited datagrams.

```python
# TCP server
from socket import socket, AF_INET, SOCK_STREAM
server = socket(AF_INET, SOCK_STREAM)
server.bind(("127.0.0.1", 12001))
server.listen(1)
connection, address = server.accept()
data = connection.recv(2048)
connection.sendall(data.upper())
connection.close()
server.close()
```

```python
# TCP client
from socket import socket, AF_INET, SOCK_STREAM
client = socket(AF_INET, SOCK_STREAM)
client.connect(("127.0.0.1", 12001))
client.sendall(b"hello")
print(client.recv(2048).decode())  # HELLO
client.close()
```

**Programming caveat:** A production TCP application must implement **framing** (how to know where a complete message ends), timeouts, robust error handling, and potentially multiple reads; one `recv()` call is **not guaranteed** to return a whole arbitrary-length application message.

## 2.8 Summary

Applications select transport services and exchange protocol messages through sockets. HTTP retrieves Web resources; FTP manages file transfers; SMTP sends mail; POP3 and IMAP provide mail access; DNS resolves names; P2P systems distribute work among peers.

## Common mistakes

1. **DNS vs HTTP:** DNS resolves names; HTTP requests resources.
2. **SMTP vs IMAP/POP3:** SMTP sends/transfers mail; the others let clients access a mailbox.
3. **FTP vs SFTP:** These are different protocols.
4. **TCP vs application:** TCP delivers a byte stream; HTTP defines what the bytes mean.
5. **A port vs an IP address:** The port selects a service/process; the address identifies an interface/host location.
6. **Stateless HTTP vs cookies:** Cookies can support higher-level session state.

## Practice and review — original exercises

Open the answer only after choosing or calculating your own result. These Markdown disclosures do not auto-grade.

**2.1** Match each job to a protocol: Web retrieval, domain lookup, server-to-server email, classical file transfer.

<details><summary>Check answer 2.1</summary><p>HTTP; DNS; SMTP; FTP, respectively.</p></details>

**2.2** Is the browser a client or server when requesting a page?

<details><summary>Check answer 2.2</summary><p>Client. It initiates the HTTP request.</p></details>

**2.3** What do the IP address and TCP/UDP port each identify?

<details><summary>Check answer 2.3</summary><p>The address identifies a network interface/endpoint for routing; a port helps deliver data to the intended transport endpoint/application process.</p></details>

**2.4** What does `HTTP/1.1 404 Not Found` tell you?

<details><summary>Check answer 2.4</summary><p>The HTTP server could not find the requested resource. DNS resolution and network delivery worked far enough to obtain an HTTP response.</p></details>

**2.5** Given RTT = 50 ms and object transmission = 4 ms, estimate one-object non-persistent HTTP time under the book's simple model.

<details><summary>Check answer 2.5</summary><p>2 × 50 + 4 = 104 ms. Additional setup/queuing can increase real time.</p></details>

**2.6** Why might persistent HTTP be faster for many small objects?

<details><summary>Check answer 2.6</summary><p>It reuses an existing TCP connection and avoids some repeated connection setup.</p></details>

**2.7** Name FTP's separate channel purposes.

<details><summary>Check answer 2.7</summary><p>Control: commands and replies. Data: file content or directory listings.</p></details>

**2.8** Which protocol sends email from one mail server to another?

<details><summary>Check answer 2.8</summary><p>SMTP.</p></details>

**2.9** Which is usually more suitable for synchronized folders on multiple email devices, POP3 or IMAP?

<details><summary>Check answer 2.9</summary><p>IMAP, because it works with server-hosted mailboxes and their state.</p></details>

**2.10** Which DNS record type maps a hostname to an IPv4 address?

<details><summary>Check answer 2.10</summary><p>A record. AAAA maps to IPv6.</p></details>

**2.11** What DNS record identifies mail-handling servers for a domain?

<details><summary>Check answer 2.11</summary><p>MX.</p></details>

**2.12** What does TTL control in a DNS response?

<details><summary>Check answer 2.12</summary><p>How long the DNS record may be cached, not the time for a packet to cross the Internet.</p></details>

**2.13** Does DNS use only UDP in all circumstances?

<details><summary>Check answer 2.13</summary><p>No. UDP is common, but DNS also uses TCP.</p></details>

**2.14** How can P2P distribution benefit from new peers?

<details><summary>Check answer 2.14</summary><p>New peers may also upload chunks, increasing aggregate available upload capacity.</p></details>

**2.15** A TCP `recv(100)` returns 45 bytes. Is that necessarily an error?

<details><summary>Check answer 2.15</summary><p>No. TCP is a byte stream. Applications must handle partial reads and establish their own message boundaries.</p></details>

**2.16** Order these steps: HTTP GET; DNS lookup if needed; connect to server; display content.

<details><summary>Check answer 2.16</summary><p>DNS lookup (if needed) → connect to the server → send HTTP GET → receive and display content.</p></details>

## Related chapters

[Chapter 1 — Networks and the Internet](/notes/computer-networking-chapter-1/) · [Chapter 3 — Transport Layer](/notes/computer-networking-chapter-3/) · [Chapter 4 — IP and Subnetting](/notes/computer-networking-chapter-4/) · [Study roadmap](/notes/computer-networking-chapters-1-4/)
