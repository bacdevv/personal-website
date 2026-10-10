---
title: "Computer Networking — Chapter 3: The Transport Layer"
description: "Learn process delivery, ports, UDP, reliable transfer, TCP handshakes, acknowledgments, flow control, and congestion control with simple examples."
subject: Computer Networking
date: "2026-10-10"
draft: false
tags: ["computer-networking", "transport-layer", "udp", "tcp", "reliability", "congestion-control"]
---

The **transport layer** connects **processes**, not just machines. It makes applications possible by delivering data to the right socket and, when TCP is chosen, providing a reliable, ordered byte stream.

**Source:** Kurose and Ross, *Computer Networking: A Top-Down Approach*, sixth edition, Chapter 3, printed pp. 185–304 (PDF pp. 212–331). Examples and review questions are original instructional material. TCP algorithms described here reflect the conceptual treatment in this edition, not every modern TCP implementation.

## Learning objectives

After studying, distinguish UDP from TCP; describe port-based multiplexing; explain checksums, acknowledgments, sequence numbers, retransmission, TCP handshake/teardown, flow control, and congestion control; and calculate simple RTT and window examples.

**Prerequisites:** [Chapter 1 — Protocol Layers](/notes/computer-networking-chapter-1/) and [Chapter 2 — Application Layer](/notes/computer-networking-chapter-2/).

## 3.1 Introduction and Transport-Layer Services

### 3.1.1 Relationship between transport and network layers

The **network layer** offers host-to-host delivery of IP datagrams. The **transport layer** provides logical communication between application **processes** running on hosts.

```text
Computer A                                Computer B
Browser process                           Web server process
      ↓                                          ↑
Transport: TCP/UDP  ──────────────────>   Transport: TCP/UDP
      ↓                                          ↑
Network: IP        ─── routers/links ───>  Network: IP
```

**Why it matters:** An IP address gets a datagram toward a host. The receiving transport protocol uses port information to deliver the payload to the right application socket.

### 3.1.2 Transport layer in the Internet

The textbook focuses on two transport protocols, **TCP** and **UDP**.

| Property | UDP | TCP |
| --- | --- | --- |
| Connection setup | No | Yes |
| Application view | Datagram messages | Ordered byte stream |
| Reliability built in | No | Yes, subject to connection failure |
| Delivery order | Not guaranteed | Ordered bytes |
| Flow control | No | Yes |
| Congestion control | No built-in TCP-style mechanism | Yes |
| Header length | 8 bytes | At least 20 bytes |
| Typical use in book | DNS, streaming examples | Web, FTP, SMTP |

**Important:** TCP reliability means it retransmits lost data and detects corruption. It **does not** mean a broken network can never interrupt a connection. UDP is not "always faster"; it simply has different mechanisms and overheads.

## 3.2 Multiplexing and Demultiplexing

**Multiplexing:** A sender accepts data from multiple sockets and adds transport headers so the data can share network delivery. **Demultiplexing:** A receiver uses header fields to decide which socket receives data.

A **port number** is a 16-bit value: `0` through `65535`. Many server applications listen on familiar ports (e.g., HTTP `80`, HTTPS `443`, SMTP `25`, DNS `53`). A server port is not necessarily the source port a browser uses; client source ports are often chosen temporarily.

**UDP socket demultiplexing** generally uses destination IP and destination port. **TCP connections** are identified using a four-tuple: `(source IP, source port, destination IP, destination port)`. Two clients can connect to the same server port without their TCP streams being confused.

**Example:** Client A at `192.0.2.10:51000` and Client B at `192.0.2.11:52000` both connect to server `203.0.113.8:443`. Each connection has a different four-tuple.

## 3.3 Connectionless Transport: UDP

UDP offers a simple **message-oriented datagram service**. A sending process gives UDP a message and destination socket address; UDP adds an 8-byte header. The underlying IP layer tries to deliver the datagram, but UDP itself neither guarantees arrival nor reorders lost/out-of-order messages.

**Why applications choose UDP:** A small header, no connection establishment, application control over sending behavior, and the ability to implement application-specific recovery. DNS is a classic example. Real-time applications may prefer timely data over waiting for every old packet.

### 3.3.1 UDP segment structure

```text
 0                 15 16                31
+--------------------+--------------------+
|    Source port     | Destination port   |
+--------------------+--------------------+
|       Length       |     Checksum       |
+--------------------+--------------------+
|            Application data             |
+-----------------------------------------+
```

The **Length** field covers UDP header + payload. The minimum UDP length is **8 bytes**. If a UDP payload has **52 bytes**, UDP length is **60 bytes**, before the IP header and link-layer framing.

### 3.3.2 UDP checksum

The **UDP checksum** helps detect errors by combining the UDP data, header, and a pseudo-header derived from IP information. A checksum failure indicates a corrupted datagram that should not be delivered as valid data. Checksums are for **error detection**, not correction or retransmission.

**Simplified 16-bit one's-complement practice:** Add 16-bit words with end-around carry, then invert all bits. Actual UDP checksum calculation includes a pseudo-header and proper treatment of odd byte counts. A checksum of zero has protocol-specific encoding considerations; avoid treating it as a universal sign of correctness.

## 3.4 Principles of Reliable Data Transfer

A **reliable data-transfer protocol** tries to deliver data correctly and in order despite errors or loss. Key ideas are **checksums**, **ACK/NAK feedback**, **sequence numbers**, **timers**, and **retransmissions**.

### 3.4.1 Building a reliable data transfer protocol

The textbook develops a sequence of conceptual **rdt** protocols:

- **rdt1.0:** ideal channel without bit errors or packet loss.
- **rdt2.x:** corrupted data or feedback requires checksums and ACK/NAK logic; sequence numbers help detect duplicates.
- **rdt3.0:** timers and retransmissions deal with packet loss. A late packet can create a duplicate, so sequence numbers still matter.

**Stop-and-wait:** Send one packet; then wait for acknowledgment before sending the next. It is simple, but wastes bandwidth on long-delay links.

**Worked example:** Sending a 1,000-byte packet on a 1 Mb/s link takes $8{,}000/1{,}000{,}000=8$ ms. With a 100 ms RTT and negligible ACK transmission time, stop-and-wait utilization is approximately $8/(100+8)=7.4\%$ (ignoring other effects). The sender is mostly waiting.

### 3.4.2 Pipelined reliable data transfer

**Pipelining** allows multiple unacknowledged packets in flight. A **window** restricts how many can be outstanding. It helps keep a link busy while feedback travels back.

For sender window $W$, packet transmission time $L/R$, and approximate RTT, an idealized utilization bound is

$$U\approx\min\left(1,\frac{W(L/R)}{RTT+L/R}\right).$$

This is a simplified learning model, not a throughput guarantee in congested networks.

### 3.4.3 Go-Back-N (GBN)

With **GBN**, the sender can transmit up to $N$ outstanding packets. The receiver normally accepts the next expected packet in order and uses **cumulative ACKs**. If a packet is lost and the sender times out, it retransmits that packet **and subsequent unacknowledged packets**.

```text
Sender:   [0] [1] [2 lost] [3] [4]
Receiver:  0   1            (3 and 4 not delivered in order)
Timeout:             retransmit 2, 3, 4
```

**Why it matters:** GBN is easier to manage at the receiver but can resend data that already crossed the link.

### 3.4.4 Selective Repeat (SR)

With **Selective Repeat**, the receiver can buffer correctly received out-of-order packets, and the sender retransmits **only missing/unacknowledged packets**. The sender and receiver need more careful window and sequence-number management.

**Example:** If packet 2 is lost but 3 and 4 arrive, SR can retain 3 and 4; after retransmitted 2 arrives, data 2, 3, and 4 can be delivered in order. A sequence-number space must be large enough relative to the window to avoid ambiguity.

## 3.5 Connection-Oriented Transport: TCP

### 3.5.1 The TCP connection

TCP is **connection-oriented**, **full-duplex**, and **point-to-point**. Each endpoint maintains state for the connection. TCP takes application bytes and packages them into **segments**; it does **not** preserve application message boundaries. TCP can send bytes in both directions simultaneously.

### 3.5.2 TCP segment structure

A TCP header includes source/destination ports, **sequence number**, **acknowledgment number**, header length, control flags (including SYN, ACK, FIN, RST), receive window, checksum, and optional information.

**Sequence number:** identifies the first byte in a segment's data (in general). **Acknowledgment number:** normally identifies the **next byte expected**. A segment carrying 500 data bytes beginning with sequence number 1000 will usually cause a cumulative ACK of **1500** if all preceding bytes were already received.

### 3.5.3 Round-trip time estimation and timeout

TCP samples **RTT**, estimates its average and variation, then selects a retransmission timeout (RTO). The textbook presents the conceptual formulas:

$$EstimatedRTT=(1-\alpha)EstimatedRTT+\alpha SampleRTT,\qquad \alpha=0.125.$$

$$DevRTT=(1-\beta)DevRTT+\beta\lvert SampleRTT-EstimatedRTT\rvert,\qquad \beta=0.25.$$

$$TimeoutInterval=EstimatedRTT+4\times DevRTT.$$

**Worked example:** Previous EstimatedRTT 100 ms, new SampleRTT 140 ms: new estimate $0.875(100)+0.125(140)=105$ ms. A timeout should not be chosen merely equal to the latest sample.

### 3.5.4 Reliable data transfer

TCP uses **sequence numbers**, **checksums**, **cumulative acknowledgments**, and **retransmission** to provide ordered, reliable byte delivery. Loss recovery may be triggered by a timer or by repeated acknowledgment information. It is important to distinguish **receiving a segment** from **delivering its bytes in order** to the application.

**Example:** Segments carry bytes 0–499 and 500–999. If both arrive, the receiver can acknowledge the next expected byte 1000. If the second is missing, the cumulative acknowledgment cannot pass the gap.

### 3.5.5 Flow control

**Flow control** protects the **receiver** from being overwhelmed. The receiver advertises available receive-buffer space (`rwnd`). The sender should not have more unacknowledged bytes outstanding than the allowable receive window, with details depending on TCP state.

**Analogy:** A fast delivery truck must slow down when the warehouse has little free storage.

### 3.5.6 TCP connection management

The conceptual **three-way handshake** establishes synchronized TCP connection state:

```text
Client                                Server
SYN ------------------------------------>
     <----------------------------- SYN + ACK
ACK ------------------------------------>
             connection established
```

A typical graceful shutdown exchanges **FIN** and **ACK** information, possibly separately in each direction. A reset (**RST**) is different from a normal orderly close.

**Remember:** The handshake is for **TCP transport**, not for DNS or the whole Internet. A user's HTTPS request can involve other security setup beyond the TCP handshake.

## 3.6 Principles of Congestion Control

### 3.6.1 Causes and costs of congestion

**Congestion** occurs when too many senders compete for limited network resources. Queues grow, delay increases, buffers drop packets, and retransmissions may further waste capacity. More injected traffic does not guarantee more useful delivered throughput.

### 3.6.2 Approaches to congestion control

**End-to-end control** infers congestion from losses, delays, or acknowledgment signals. **Network-assisted control** provides explicit feedback from network devices. These are design categories, not synonyms for flow control.

### 3.6.3 Network-assisted example: ATM ABR

The sixth edition uses **ATM Available Bit Rate (ABR)** as an example of explicit congestion feedback. Network devices can mark special resource-management information to tell a sender how quickly it may transmit. This illustrates the **idea** of explicit guidance; ATM is not presented here as today's default Internet transport.

## 3.7 TCP Congestion Control

TCP adjusts its sending behavior based on congestion signals. The textbook explains a **congestion window** (`cwnd`) and a slow-start threshold (`ssthresh`). A sender's effective allowed amount of outstanding data is constrained by both receiver flow control and congestion control.

- **Slow start:** Increase `cwnd` rapidly (approximately doubling each RTT under ideal ACK behavior) from a small starting point.
- **Congestion avoidance:** Increase more cautiously, often summarized as additive increase.
- **Loss indication:** Reduce the sending window; older textbook descriptions include timeout and duplicate-ACK paths.
- **AIMD:** *Additive Increase, Multiplicative Decrease* supports adaptation to shared capacity.

**Worked concept:** If `cwnd` is 4 MSS and receiver window is 10 MSS, the congestion window is the tighter limit. If `cwnd` becomes 12 MSS while receiver window remains 10 MSS, receiver flow control becomes the tighter limit.

### 3.7.1 Fairness

When multiple long-lived TCP flows share a bottleneck, congestion control aims for a reasonable division of capacity. Two TCP flows sharing an otherwise idle 10 Mb/s bottleneck might each approach roughly 5 Mb/s under simplified fair-sharing assumptions, but actual throughput depends on RTT, algorithms, losses, competing flows, and other factors.

## 3.8 Summary

**UDP** gives low-mechanism datagram transfer. **TCP** adds connection state, reliable ordered byte delivery, flow control, and congestion control. Both provide port-based communication between application processes; IP delivers their packets between hosts.

## Common mistakes

1. **TCP is not a message protocol:** `recv()` can return fewer or more bytes than a particular application message size.
2. **UDP is not an automatic guarantee of low latency:** Congestion and application design still matter.
3. **ACK number vs. packet count:** TCP acknowledges **byte positions**, not packet IDs.
4. **Flow vs. congestion control:** Receiver capacity vs. network capacity.
5. **Checksum vs. correction:** A checksum can detect corruption but cannot by itself repair lost data.
6. **Three-way handshake vs. HTTP request:** They belong to different layers.

## Practice and review — original exercises

Open the answer only after writing your own response. Markdown disclosures do not track scores.

**3.1** Which layer delivers data between processes on different hosts?

<details><summary>Check answer 3.1</summary><p>Transport layer.</p></details>

**3.2** Does UDP guarantee delivery order?

<details><summary>Check answer 3.2</summary><p>No. UDP provides no built-in ordering or reliable delivery guarantee.</p></details>

**3.3** How many bytes are in a UDP header?

<details><summary>Check answer 3.3</summary><p>8 bytes.</p></details>

**3.4** A UDP payload is 100 bytes. What UDP Length field value is required (without IP headers)?

<details><summary>Check answer 3.4</summary><p>108 bytes: 100 payload + 8 UDP header.</p></details>

**3.5** Name the four TCP connection identifiers.

<details><summary>Check answer 3.5</summary><p>Source IP, source port, destination IP, destination port.</p></details>

**3.6** What problem does a checksum try to detect?

<details><summary>Check answer 3.6</summary><p>Corruption of bits in transmitted data and relevant headers.</p></details>

**3.7** What additional mechanism is needed when the data channel may lose packets?

<details><summary>Check answer 3.7</summary><p>Timers/retransmissions, with sequence numbers and acknowledgments to manage duplicates and delivery.</p></details>

**3.8** Why is stop-and-wait inefficient when RTT is large?

<details><summary>Check answer 3.8</summary><p>Only one packet is in flight, so the sender spends much of the time waiting for ACKs.</p></details>

**3.9** Packet 2 is lost while 3 and 4 arrive. Which recovery protocol can keep 3 and 4 buffered?

<details><summary>Check answer 3.9</summary><p>Selective Repeat. Go-Back-N normally discards out-of-order data and retransmits a sequence of unacknowledged packets.</p></details>

**3.10** A TCP segment starts at byte sequence 3000 and contains 200 data bytes. If all previous bytes arrived, what is the next cumulative ACK?

<details><summary>Check answer 3.10</summary><p>3200.</p></details>

**3.11** Put the TCP handshake messages in order.

<details><summary>Check answer 3.11</summary><p>SYN → SYN+ACK → ACK.</p></details>

**3.12** Is a TCP RST the same as graceful FIN close?

<details><summary>Check answer 3.12</summary><p>No. RST resets a connection; FIN requests orderly shutdown of one direction.</p></details>

**3.13** Calculate EstimatedRTT if the old estimate is 80 ms, SampleRTT is 120 ms, and $\alpha=0.125$.

<details><summary>Check answer 3.13</summary><p>0.875 × 80 + 0.125 × 120 = 85 ms.</p></details>

**3.14** Which protects the receiver: `rwnd` or `cwnd`?

<details><summary>Check answer 3.14</summary><p>rwnd. cwnd reflects congestion control for the network.</p></details>

**3.15** If `rwnd` is 8 MSS and `cwnd` is 5 MSS, what is the limiting amount of in-flight data in the simplified model?

<details><summary>Check answer 3.15</summary><p>5 MSS. The smaller window constrains the sender.</p></details>

**3.16** Explain slow start in one sentence.

<details><summary>Check answer 3.16</summary><p>TCP grows the congestion window quickly at first (roughly exponentially by RTT in ideal conditions) until a threshold or congestion signal changes its behavior.</p></details>

**3.17** What is the difference between flow control and congestion control?

<details><summary>Check answer 3.17</summary><p>Flow control avoids overrunning the receiver's buffer. Congestion control avoids overloading the network.</p></details>

**3.18** Can a TCP connection fail even though TCP provides reliable transfer?

<details><summary>Check answer 3.18</summary><p>Yes. TCP provides reliable ordered byte transfer while the connection remains viable; permanent loss of connectivity can still cause a failure.</p></details>

## Related chapters

[Chapter 1 — Network Fundamentals](/notes/computer-networking-chapter-1/) · [Chapter 2 — Application Layer](/notes/computer-networking-chapter-2/) · [Chapter 4 — IP and Subnetting](/notes/computer-networking-chapter-4/) · [Study roadmap](/notes/computer-networking-chapters-1-4/)
