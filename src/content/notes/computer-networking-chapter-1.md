---
title: "Computer Networking — Chapter 1: Networks and the Internet"
description: "Home networks, packet routes, four kinds of delay, throughput, protocols, Internet layers and the seven-layer OSI model, explained with worked calculations."
subject: Computer Networking
date: "2026-10-10"
draft: false
tags: ["computer-networking", "internet", "home-network", "delay", "network-layers", "osi"]
---

A packet travels through **hosts, links, switches, and routers**. This chapter explains those parts before introducing performance and network layers.

**Source:** James F. Kurose and Keith W. Ross, *Computer Networking: A Top-Down Approach*, sixth edition, Chapter 1, printed pp. 1–82 (PDF pp. 28–109). The diagrams, calculations, and review questions here are original learning aids, not reproductions of the textbook's illustrations or problem set. Modern examples are explicitly identified.

## Learning objectives

After this chapter, you should be able to describe a home LAN, trace a packet between nodes, distinguish forwarding from routing, calculate basic network delays, explain protocols and encapsulation, and compare the five Internet layers with the seven OSI layers.

**Prerequisites:** Basic units (bits, bytes, seconds), simple division, and a general idea of what a website is.

## 1.1 What Is the Internet?

### 1.1.1 A nuts-and-bolts description

**Definition:** The Internet is a **network of networks** connecting end systems (hosts). A laptop, phone, or server is a host. A **communication link** carries data between devices. A **packet switch** takes a packet from an incoming link and sends it over an outgoing link. The main kinds are **routers** and **link-layer switches**.

**Why it matters:** Applications do not transmit complete documents through a single magic connection. Information is divided into **packets** that traverse a series of links and packet switches.

**Example:** A browser sends an HTTP request from a laptop to a distant web server. The packets travel through a home access network, an Internet service provider (ISP), and other routers before reaching the server. The server sends response packets back. The forward and return paths need not be identical.

**Result:** A **route/path** is the sequence of links and switches visited by a packet. **Bandwidth / link rate** is typically measured in bits per second (bit/s), not bytes per second (B/s).

### 1.1.2 A services description

The Internet provides communication services to distributed applications such as the Web, email, and messaging. An application can send and receive data through a **socket**, which is the interface between application software and the transport-layer service. Different services offer different choices about reliability, delay, and bandwidth.

### 1.1.3 What is a protocol?

A **protocol** specifies **message format, message order, and the actions taken when messages are sent or received**. Example: an HTTP client sends a request, and an HTTP server returns a response. A protocol is more than a list of port numbers.

## 1.2 The Network Edge

### 1.2.1 Access networks: a home LAN

A **local area network (LAN)** connects devices across a limited location such as a home, lab, or office. An **access network** connects an end system to its first router toward the Internet.

```text
Laptop ── Wi-Fi ──┐
Phone  ── Wi-Fi ──┤
Desktop ─ Ethernet┤
                 [Home router / Wi-Fi AP]
                           │
                       [Modem/ONT]
                           │
                    [Access ISP] ── Internet ── [Web server]
```

**Read the diagram:** The wireless access point connects Wi-Fi devices to the home LAN. A home router forwards between the LAN and the ISP. In many homes, the router, Wi-Fi access point, and Ethernet switch share one physical box; a separate modem or optical network terminal (ONT) connects to the access medium.

**Same LAN:** A PC sends a frame to another PC using link-layer addressing, possibly through a switch or access point. **Different network:** A host normally sends traffic to its default gateway (router), which forwards it toward another IP network. The distinction depends on IP configuration and topology, not simply physical distance.

**Access technologies:** DSL over telephone wiring; cable Internet over shared cable infrastructure; fiber-to-the-home (FTTH); enterprise Ethernet; wireless LAN (Wi-Fi); cellular access. Download and upload capacities may be different. Sharing the access medium can affect throughput.

### 1.2.2 Physical media

A **bit** is carried as an electrical, optical, or radio signal. **Guided media** include twisted-pair copper, coaxial cable, and optical fiber. **Unguided media** include terrestrial radio and satellite links.

- **Twisted pair:** common Ethernet cabling; relatively inexpensive.
- **Coaxial cable:** used in cable access networks.
- **Fiber:** light signals, high capacity, low attenuation over long distances.
- **Radio:** supports mobility but can experience interference, fading, and shared-medium contention.

Link rate and signal propagation speed are **different quantities**. Faster data rate does not make a signal travel infinitely fast.

## 1.3 The Network Core

### 1.3.1 Packet switching

A **packet switch** forwards packets individually. In **store-and-forward** switching, a router normally receives a complete packet before transmitting it on the next link. Packets can wait in an **output queue** if the next link is busy.

**Worked example — one packet, two links.** A packet is `L = 12,000 bits` and both links have `R = 1,000,000 bit/s` capacity. Ignoring propagation, processing, and queueing:

$$d_{\mathrm{trans}}=\frac{L}{R}=\frac{12{,}000}{1{,}000{,}000}=0.012\ \mathrm{s}=12\ \mathrm{ms}.$$

Two store-and-forward transmissions take **24 ms**, even if both links have identical rates. For **P** packets over **N** equal-rate links with ideal pipelining and no other delays, total time is approximately $(N+P-1)L/R$; this is additional worked guidance.

**Statistical multiplexing:** Many users share link capacity without fixed reservations. It uses capacity efficiently but introduces variable queues and potential losses when traffic is heavy.

### 1.3.2 Circuit switching

**Circuit switching** reserves resources for a connection before data transfer. Time-division multiplexing (TDM) and frequency-division multiplexing (FDM) are two ways to divide capacity. Compare:

| Packet switching | Circuit switching |
| --- | --- |
| Shares capacity dynamically | Reserves resources for a circuit |
| Bursty traffic is efficient | Predictable reserved capacity |
| Queueing and loss possible | Setup and unused reservation overhead |

**Example:** On a 1 Mb/s link divided into four equal circuits, each circuit receives 250 kb/s of reserved capacity. This is not the same as four packet users each always receiving exactly 250 kb/s.

### 1.3.3 A network of networks

A home ISP connects to other provider networks and exchange points so a packet can cross multiple administrative networks. The textbook discusses access ISPs, transit relationships, peering, and content-provider networks. No single organization operates every Internet link.

## 1.4 Delay, Loss, and Throughput in Packet-Switched Networks

### 1.4.1 Overview of the four delays

For one node, **nodal delay** contains four components:

$$d_{\mathrm{nodal}}=d_{\mathrm{proc}}+d_{\mathrm{queue}}+d_{\mathrm{trans}}+d_{\mathrm{prop}}.$$

| Delay | What happens? | How to estimate |
| --- | --- | --- |
| Processing | Examine header, check errors, choose output | Depends on equipment |
| Queueing | Wait behind other packets | Depends on traffic and queue |
| Transmission | Push all packet bits onto the link | $L/R$ |
| Propagation | Signal travels along the physical link | $d/s$ |

Here $L$ is **packet length in bits**, $R$ **link bit rate (bit/s)**, $d$ **link distance (m)**, and $s$ **propagation speed (m/s)**.

**Worked example — distinguish the two formulas.** A 1,500-byte packet travels over a 100 Mb/s link 200 km long. Assume signal speed $2\times10^8$ m/s.

$$L=1{,}500\times8=12{,}000\ \mathrm{bits}$$
$$d_{\mathrm{trans}}=12{,}000/100{,}000{,}000=0.00012\ \mathrm{s}=0.12\ \mathrm{ms}$$
$$d_{\mathrm{prop}}=200{,}000/(2\times10^8)=0.001\ \mathrm{s}=1\ \mathrm{ms}.$$

**Result:** Propagation (1 ms) exceeds transmission (0.12 ms) in this example. Increasing $R$ reduces transmission delay but does **not** reduce $d/s$.

### 1.4.2 Queueing delay and packet loss

Let $a$ be the **average packet arrival rate in packets/s**. The quantity $La/R$ is **traffic intensity**.

- If $La/R$ is far below 1, a queue is often short.
- As it approaches 1, delay can rise sharply, depending on the arrival pattern.
- If sustained arrival work exceeds service capacity, an unbounded queue cannot be stable; a finite buffer eventually drops packets.

**Packet loss** happens when a packet cannot fit in a finite queue. Loss is **not** another term for propagation delay. A lost packet may be retransmitted by higher-layer mechanisms.

### 1.4.3 End-to-end delay and hop-by-hop travel

A **hop** is one transfer between adjacent network nodes. For a fixed path, add the relevant processing, queueing, transmission, and propagation delays at **every hop**.

$$d_{\mathrm{end\text{-}to\text{-}end}}=\sum_{i=1}^{N}(d_{\mathrm{proc},i}+d_{\mathrm{queue},i}+d_{\mathrm{trans},i}+d_{\mathrm{prop},i}).$$

**Three-hop example:** Each of three links takes 2 ms to transmit and 1 ms to propagate; assume no other delays. Total $3(2+1)=9$ ms for the packet under store-and-forward assumptions. A **traceroute** can help reveal the routers along a path; it does not directly measure every internal component of delay.

### 1.4.4 Throughput

**Throughput** is the rate at which useful data is successfully delivered. The end-to-end rate is often limited by the **bottleneck** link.

**Worked example:** Access link 20 Mb/s, ISP link 100 Mb/s, server link 50 Mb/s. Ignoring other traffic and overhead, throughput cannot exceed **20 Mb/s**. Downloading a 100 MB file at an ideal 20 Mb/s takes $100\times8/20=40$ seconds (decimal MB).

**Remember:** *Latency* answers "how long until?"; *throughput* answers "how much per second?".

## 1.5 Protocol Layers and Their Service Models

### 1.5.1 Layered architecture and OSI

**Why layers?** Each layer solves a different communication problem and uses services from the layer below. The **Internet protocol stack** in this textbook has **five layers**:

| From top to bottom | Main job | Examples |
| --- | --- | --- |
| 5. Application | Application communication | HTTP, FTP, SMTP, DNS |
| 4. Transport | Process-to-process delivery | TCP, UDP |
| 3. Network | Host-to-host datagram forwarding | IP, routing |
| 2. Link | Transfer on one local link | Ethernet, Wi-Fi |
| 1. Physical | Signals/bits over a medium | Copper, fiber, radio |

The **OSI reference model** has seven layers:

| OSI layer | Role | Relation to five-layer Internet model |
| --- | --- | --- |
| 7 Application | Network services to application software | Application |
| 6 Presentation | Representation, encoding, transformation | Usually application functionality |
| 5 Session | Session management, dialog coordination | Usually application functionality |
| 4 Transport | End-to-end transport | Transport |
| 3 Network | Routing and logical addressing | Network |
| 2 Data Link | Link framing and delivery | Link |
| 1 Physical | Raw signals | Physical |

**Do not confuse the models:** The textbook uses the Internet five-layer model for most explanations and presents OSI as a comparative reference. A protocol need not map cleanly to exactly one conceptual function of the OSI model.

### 1.5.2 Encapsulation and decapsulation

The sender adds control information as data moves **down** the protocol stack; the receiver removes it on the way **up**.

```text
Sender                                    Receiver
Application: [message]                    [message]
Transport:   [TCP header | message]        segment
Network:     [IP header | TCP segment]     datagram
Link:        [link header | IP datagram | trailer]   frame
Physical:    bits/signals ───────────────> bits/signals
```

**Result:** An application message can be carried in a transport **segment**, an IP **datagram**, and a link-layer **frame**. Routers process IP and link layers as they forward; they do not normally interpret the application payload.

## 1.6 Networks Under Attack

The textbook introduces malware, attacks on end systems, packet sniffing, source-address spoofing, and denial-of-service attacks. These illustrate why networks need authentication, confidentiality, integrity, and operational defenses.

- **Packet sniffing:** observing traffic that crosses a link.
- **Spoofing:** forging an address or identity used by a protocol.
- **Denial of service:** exhausting a resource so legitimate users cannot access it.

**Learning note:** A packet header exposing an IP address is not itself proof of the human sender's identity.

## 1.7 History of Computer Networking and the Internet

### 1.7.1 The development of packet switching, 1961–1972

Foundational research established that traffic can be split into packets and shared over a network. Early ARPANET research explored practical packet switching.

### 1.7.2 Proprietary networks and internetworking, 1972–1980

Multiple network types motivated protocols that allow different networks to communicate.

### 1.7.3 A proliferation of networks, 1980–1990

TCP/IP adoption, local area networks, and academic networks helped expand interconnected networking.

### 1.7.4 The Internet explosion, the 1990s

The Web and the growth of Internet service providers made networked services widely accessible.

### 1.7.5 The new millennium

Broadband, wireless access, content-delivery infrastructure, and mobile devices reshaped use of the Internet. These labels follow the historical framing of the **2012 sixth edition**, not a complete history through 2026.

## 1.8 Summary

A network connects hosts through links and forwarding devices. Packet switching shares capacity; circuit switching reserves resources. Each packet experiences processing, queueing, transmission, and propagation delay. Layers divide responsibilities; encapsulation carries the same application data down the stack.

## Common mistakes

1. **Bandwidth vs. propagation speed:** Higher bit/s does not change the speed of light in fiber.
2. **Bytes vs. bits:** Multiply bytes by 8 before calculating $L/R$.
3. **Switch vs. router:** A switch typically forwards within a LAN; a router forwards between IP networks.
4. **Five vs. seven layers:** The Internet stack and OSI are related but not identical.
5. **A hop vs. an entire route:** A route often contains many hops.

## Practice and review — original exercises

Try each answer before opening its explanation. In Markdown-only mode, these disclosures **reveal worked answers**; they do not automatically mark or count correct responses.

**1.1** Which two forwarding devices are especially important in the Internet core and in LANs?

<details><summary>Check answer 1.1</summary><p>Routers and link-layer switches. Routers mainly move IP datagrams across networks; switches mainly connect devices on local links.</p></details>

**1.2** In a home network, does traffic to a server on another IP network usually go to the default gateway?

<details><summary>Check answer 1.2</summary><p>Yes. A host usually uses the default gateway for destinations not covered by its local routes.</p></details>

**1.3** Convert a 1,200-byte packet into bits.

<details><summary>Check answer 1.3</summary><p>1,200 × 8 = 9,600 bits.</p></details>

**1.4** A 9,600-bit packet crosses a 2 Mb/s link. Find transmission delay.

<details><summary>Check answer 1.4</summary><p>9,600 / 2,000,000 = 0.0048 seconds = 4.8 ms. Use bits/s, not bytes/s.</p></details>

**1.5** A signal crosses 400 km at $2\times10^8$ m/s. Find propagation delay.

<details><summary>Check answer 1.5</summary><p>400,000 / 200,000,000 = 0.002 seconds = 2 ms.</p></details>

**1.6** List the four nodal delay components.

<details><summary>Check answer 1.6</summary><p>Processing, queueing, transmission, propagation.</p></details>

**1.7** How many link transmissions are needed for one packet crossing four store-and-forward links?

<details><summary>Check answer 1.7</summary><p>Four. Ignore the other delays only if the question explicitly says to do so.</p></details>

**1.8** A path has 30 Mb/s, 8 Mb/s and 20 Mb/s links. What is the ideal bottleneck throughput?

<details><summary>Check answer 1.8</summary><p>8 Mb/s, the smallest link rate, assuming no competing flows or other constraints.</p></details>

**1.9** What does `La/R = 1.2` suggest for a sustained packet arrival stream?

<details><summary>Check answer 1.9</summary><p>The offered traffic exceeds service capacity; queues can grow and finite buffers can lose packets.</p></details>

**1.10** Which Internet layer provides host-to-host IP forwarding?

<details><summary>Check answer 1.10</summary><p>The network layer.</p></details>

**1.11** Which OSI layers are absent as separate layers in the textbook's five-layer Internet model?

<details><summary>Check answer 1.11</summary><p>Session and presentation. Their functionality is usually handled at other layers, often within applications.</p></details>

**1.12** Put these in sender order: network, physical, application, link, transport.

<details><summary>Check answer 1.12</summary><p>Application → Transport → Network → Link → Physical.</p></details>

**1.13** A packet passes three identical links; each transmission takes 2 ms and propagation 1 ms. There is no queueing or processing. Compute end-to-end time.

<details><summary>Check answer 1.13</summary><p>3 × (2 + 1) = 9 ms for a single store-and-forward packet.</p></details>

**1.14** Explain why a network protocol is more than a port number.

<details><summary>Check answer 1.14</summary><p>A protocol also specifies messages, message syntax, sequence and what peers do when events occur.</p></details>

**1.15** Describe the path of a Web request from a phone on Wi-Fi to a remote server.

<details><summary>Check answer 1.15</summary><p>Phone → Wi-Fi access point/home router → access ISP → intermediate networks/routers → server. Actual paths vary. DNS and transport connection setup may happen before the HTTP request.</p></details>

## Related chapters

[Chapter 2 — Application Layer](/notes/computer-networking-chapter-2/) · [Chapter 3 — Transport Layer](/notes/computer-networking-chapter-3/) · [Chapter 4 — Network Layer and Subnetting](/notes/computer-networking-chapter-4/) · [Chapters 1–4 study roadmap](/notes/computer-networking-chapters-1-4/)
