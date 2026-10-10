---
title: "Computer Networking — Chapters 1–4 Study Roadmap"
description: "A connected learning path for network fundamentals, HTTP/FTP/mail/DNS, TCP/UDP, IPv4 subnet calculations and the OSI reference model."
subject: Computer Networking
date: "2026-10-10"
draft: false
tags: ["computer-networking", "roadmap", "osi", "tcp-ip", "subnetting"]
---

This roadmap connects Chapters 1–4 of *Computer Networking: A Top-Down Approach* (Kurose & Ross, sixth edition). The four linked Notes follow the book's chapter/section order. The review problems and worked subnet examples are **new teaching material** unless explicitly identified otherwise.

## Learning objectives

By the end of all four chapters you will be able to follow a packet from one host to another, calculate basic delays, explain network layers, identify common application protocols, compare TCP and UDP, and calculate the network, broadcast, host range, and capacity for an IPv4 subnet.

**Prerequisites:** Basic arithmetic, binary-place values, and some experience using a Web browser.

## Chapter 1 — Computer Networks and the Internet

[Read Chapter 1](/notes/computer-networking-chapter-1/)

Learn **home LANs**, hosts, access links, routers, packet and circuit switching, packet paths, **processing/queueing/transmission/propagation** delays, throughput, **the Internet five-layer stack**, the **OSI seven-layer reference model**, encapsulation, security, and networking history.

**Checkpoint:** Can you explain why $L/R$ is transmission delay but $d/s$ is propagation delay?

## Chapter 2 — Application Layer

[Read Chapter 2](/notes/computer-networking-chapter-2/)

Learn client–server and P2P software, application processes, sockets, **HTTP**, **FTP**, **SMTP**, **POP3/IMAP**, **DNS**, and how a browser reaches a server.

**Checkpoint:** Why is DNS needed before a browser can usually connect to a server named by a hostname?

## Chapter 3 — Transport Layer

[Read Chapter 3](/notes/computer-networking-chapter-3/)

Learn port numbers, **UDP** datagrams, TCP connections and byte streams, checksums, **ACKs**, reliable data transfer, **Go-Back-N**, **Selective Repeat**, RTT, three-way handshakes, flow control, and congestion control.

**Checkpoint:** Can you tell `rwnd` (receiver flow control) apart from `cwnd` (network congestion control)?

## Chapter 4 — Network Layer and Subnetting

[Read Chapter 4](/notes/computer-networking-chapter-4/)

Learn IP best-effort forwarding, IPv4 addressing and CIDR, **network/broadcast/first/last usable IP**, host counts, DHCP, NAT, IPv6, ICMP, Dijkstra, distance-vector routing, RIP, OSPF, and BGP.

**Checkpoint:** For `192.168.10.37/26`, can you derive `192.168.10.0` (network), `.63` (broadcast), `.1–.62` (usable range), and 62 usable addresses?

## How the four layers work together: open a webpage

```text
1. Application: browser obtains a hostname from a URL.
2. Application: DNS returns an IP address (if not already cached).
3. Transport: a TCP connection is established for an HTTP/1.1 example.
4. Application: HTTP request is sent over that connection.
5. Transport: TCP segments carry request bytes reliably and in order.
6. Network: IP routers forward datagrams across different networks.
7. Link/Physical: each local link carries frames as bits/signals.
8. At the server, upper layers process the request and send a response.
```

**Important:** These steps are a simplified walkthrough of the textbook's HTTP-over-TCP model. DNS may already be cached, security handshakes may be required, and newer HTTP versions can use different transport behavior. The example is intended to explain the layers, not to prescribe one universal packet sequence.

## Worked cross-chapter example

A client is `192.168.5.10/24`; its default gateway is `192.168.5.1`. The remote server is `203.0.113.9`.

1. The network containing the client is `192.168.5.0/24`; broadcast is `192.168.5.255`.
2. `203.0.113.9` does **not** belong to the client's subnet, so the client sends traffic toward the default gateway.
3. The application supplies a request; TCP (for this example) creates transport segments; IP adds addresses; the link layer sends frames to the next hop.
4. Each router forwards the datagram toward the server. At each outgoing link, transmission and propagation delays are incurred; queueing may occur.
5. The server processes the request and sends response data back using the corresponding protocols.

**Reason:** This combines **Chapter 4** (IP/network membership), **Chapter 3** (TCP), **Chapter 2** (application messages), and **Chapter 1** (links, routes, delay and encapsulation).

## Common mistakes across all four chapters

- The **OSI reference model** has seven layers; the book's Internet stack has five.
- **HTTP** is an application protocol; **TCP** is a transport protocol; **IP** is a network-layer protocol.
- **DNS** answers naming questions, not the HTTP content request itself.
- **A subnet broadcast address is not a usable host address** in a conventional IPv4 LAN.
- **Link rate** and **end-to-end throughput** are not automatically equal.

## Review questions

**Question A:** Name the Internet five layers in sender-to-network order.

<details><summary>Reveal model answer A</summary><p>Application → Transport → Network → Link → Physical.</p></details>

**Question B:** Which protocols do you associate with name lookup, Web request, email sending, and reliable bytes?

<details><summary>Reveal model answer B</summary><p>DNS; HTTP; SMTP; TCP.</p></details>

**Question C:** A 1,000-byte packet is transmitted at 4 Mb/s. Calculate transmission delay.

<details><summary>Reveal model answer C</summary><p>1,000 × 8 / 4,000,000 = 0.002 seconds = 2 ms.</p></details>

**Question D:** How many conventional usable IPv4 hosts fit in `/27`?

<details><summary>Reveal model answer D</summary><p>2^(32−27) − 2 = 30.</p></details>

## Related chapters

[Chapter 1](/notes/computer-networking-chapter-1/) · [Chapter 2](/notes/computer-networking-chapter-2/) · [Chapter 3](/notes/computer-networking-chapter-3/) · [Chapter 4](/notes/computer-networking-chapter-4/)
