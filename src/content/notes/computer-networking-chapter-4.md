---
title: "Computer Networking — Chapter 4: IP, Routing and IPv4 Subnetting"
description: "Find the subnet mask, network, broadcast, first and last usable addresses, and host capacity; learn IPv4, IPv6, routers and routing algorithms."
subject: Computer Networking
date: "2026-10-10"
draft: false
tags: ["computer-networking", "network-layer", "ipv4", "cidr", "subnetting", "broadcast", "routing", "osi"]
---

An **IP network** contains interfaces addressed so that routers can forward packets to the correct destination. In this chapter, learn IP forwarding first; then solve subnet problems systematically.

**Source:** Kurose and Ross, *Computer Networking: A Top-Down Approach*, sixth edition, Chapter 4, printed pp. 305–432 (PDF pp. 332–459), with the OSI comparison from §1.5.1. **The step-by-step host, first/last, and broadcast worksheet is additional worked teaching material** based on the book's IPv4 addressing and CIDR concepts; it is not an official answer key or a claim that the textbook presents all steps in this exact format.

## Learning objectives

After reading, you should be able to distinguish forwarding from routing, identify IPv4 network/host bits, convert CIDR prefixes to subnet masks, calculate subnet network/broadcast/first/last/usable host counts, explain DHCP and NAT at a high level, and recognize LS, DV, RIP, OSPF, and BGP.

**Prerequisites:** [Chapter 1 — Layers and Packets](/notes/computer-networking-chapter-1/) and basic binary arithmetic.

## 4.1 Introduction

The **network layer** transfers datagrams from a source host to a destination host across multiple links and routers. It provides a service to the transport layer, but an IP datagram is not itself a TCP or UDP connection.

### 4.1.1 Forwarding and routing

**Forwarding:** At one router, choose an outgoing interface for an arriving packet using the **forwarding table**. **Routing:** Determine paths through a network and help build the forwarding tables. Forwarding is local; routing is network-wide.

```text
Host A → Router R1 → Router R2 → Router R3 → Host B
             ↑           ↑           ↑
        forwarding at each router

Routing algorithms/protocols help determine these next hops.
```

**Why this matters:** Each router only needs a suitable **next hop**; it does not insert an application-visible explanation of the complete route into the IP payload.

### 4.1.2 Network service models

Different network architectures can offer different service models, such as best-effort delivery or stronger guarantees. The Internet's ordinary IP service is **best effort**: it does **not** promise delivery, order, minimum bandwidth, or bounded delay. TCP can add reliable delivery at the transport layer but does not change IP into a guaranteed service.

## 4.2 Virtual-Circuit and Datagram Networks

### 4.2.1 Virtual-circuit networks

A **virtual circuit (VC)** establishes network-layer connection state and can use a short identifier for packet forwarding along an established path. Routers/switches involved may hold per-connection forwarding state.

### 4.2.2 Datagram networks

A **datagram network** forwards each packet using its destination address and forwarding information. Traditional IP is a **datagram service**, so packets may take different paths or arrive out of order.

### 4.2.3 Origins of VC and datagram networks

These designs embody a difference about where to place network state: **connection setup and maintained state in the network**, or **independent forwarding of addressed datagrams**. Both have appeared in networking history.

## 4.3 What's Inside a Router?

A router typically has **input ports**, a **switching fabric**, **output ports**, and a **routing processor/control plane**.

### 4.3.1 Input processing

Receive a link-layer frame, extract/check the relevant packet information, and choose an output port using the forwarding table. IP routers use **longest-prefix matching**: among matching routes, prefer the route with the most specific prefix.

**Example:** Given `10.0.0.0/8` and `10.2.0.0/16`, destination `10.2.3.4` matches both but uses `/16`.

### 4.3.2 Switching

The switching fabric transfers packets between input and output ports. The textbook discusses memory-based, bus-based, and interconnection-network designs.

### 4.3.3 Output processing

An output port queues and schedules datagrams before transmission, then frames them for the outgoing link.

### 4.3.4 Where does queueing occur?

Input and output queues can appear if the router's internal switching or outgoing line capacity cannot serve all arriving packets instantly. Finite queues can cause **packet drops**, connecting this chapter to Chapter 1's delay model.

### 4.3.5 The routing control plane

The routing processor runs mechanisms that build routes and maintain router control information. A route **calculation** is conceptually separate from forwarding **individual packets**.

## 4.4 The Internet Protocol (IP): Forwarding and Addressing

### 4.4.1 IPv4 datagram format

The IPv4 header includes version, header length, total length, identification/fragmentation fields, **TTL**, protocol, header checksum, source address, and destination address. An IPv4 address is 32 bits (four octets).

**TTL (Time To Live)** decreases as routers forward a packet; if it reaches zero, the packet is discarded. This limits loops. The **Protocol** field identifies the next payload protocol, for example TCP or UDP.

**Note:** An IPv4 datagram is not an Ethernet frame. The Ethernet header may change at every hop; the IP destination typically remains the same unless translation/tunneling changes the packet.

### 4.4.2 IPv4 addressing — from bits to subnets

An **IPv4 address** has **32 bits**, written as four decimal octets such as `192.168.10.37`. A **CIDR prefix** `/p` says that the first $p$ bits identify the network prefix. The remaining $32-p$ bits can distinguish addresses within that block.

**Subnet mask**: 32 bits with $p$ leading ones followed by zeros. An address and its mask identify a network by **bitwise AND**.

$$\mathrm{NetworkAddress}=\mathrm{IPv4Address}\;\mathrm{AND}\;\mathrm{SubnetMask}.$$

#### CIDR quick-reference table

| Prefix | Mask | Total addresses | Conventional usable hosts |
| --- | --- | ---: | ---: |
| `/24` | `255.255.255.0` | 256 | 254 |
| `/25` | `255.255.255.128` | 128 | 126 |
| `/26` | `255.255.255.192` | 64 | 62 |
| `/27` | `255.255.255.224` | 32 | 30 |
| `/28` | `255.255.255.240` | 16 | 14 |
| `/29` | `255.255.255.248` | 8 | 6 |
| `/30` | `255.255.255.252` | 4 | 2 |

For ordinary IPv4 LAN subnets with $0\le p\le30$:

$$\text{Host bits}=32-p$$
$$\text{Total addresses}=2^{32-p}$$
$$\text{Conventional usable host addresses}=2^{32-p}-2.$$

The subtraction excludes the **network address** (all host bits zero) and **directed broadcast address** (all host bits one). **Important exceptions:** `/31` is used for certain point-to-point links (RFC 3021), and `/32` identifies a single address; do **not** blindly apply the minus-two formula to them.

#### How to calculate the network, broadcast, first and last host

Given **IP + prefix**, follow these five steps:

1. Find the subnet mask from `/p`.
2. Find the **network address**: IP **AND** mask (all host bits zero).
3. Find the **broadcast address**: same network prefix, all host bits one.
4. For a conventional multi-access subnet, **first usable = network + 1**, **last usable = broadcast − 1**.
5. **Host capacity = total addresses − 2**, if the ordinary `/0`–`/30` host model applies and there are no special address reservations in the scenario.

**Worked example A: `192.168.10.37/26`**

- `/26` has **26 network bits** and **6 host bits**.
- Mask is `255.255.255.192` (`192 = 11000000` in binary).
- Each block in the final octet contains $2^6=64$ addresses: `0–63`, `64–127`, `128–191`, `192–255`.
- `37` belongs to **0–63**.

| Requested value | Answer |
| --- | --- |
| Network | **192.168.10.0** |
| Subnet mask | **255.255.255.192** |
| First usable | **192.168.10.1** |
| Last usable | **192.168.10.62** |
| Broadcast | **192.168.10.63** |
| Total addresses | **64** |
| Usable host addresses | **62** |

**Binary reason:** Last octet `37 = 00100101`; mask last octet `192 = 11000000`. Their bitwise AND is `00000000` (network .0). Setting all six host bits to one gives `00111111` (broadcast .63).

**Worked example B: `172.16.5.130/27`**

- Mask `255.255.255.224`.
- There are $32-27=5$ host bits, giving a block size of **32**.
- Relevant final-octet block: `128–159`.
- Network **172.16.5.128**; broadcast **172.16.5.159**.
- First usable **172.16.5.129**; last usable **172.16.5.158**; conventional host capacity **30**.

**Worked example C: `10.8.37.200/20` (prefix boundary is not in the last octet)**

`/20` mask: `255.255.240.0`. The third-octet block size is `256−240=16`. Third octet `37` is in `32–47`.

- Network **10.8.32.0**.
- Broadcast **10.8.47.255**.
- First usable **10.8.32.1**.
- Last usable **10.8.47.254**.
- Host bits $12$; total $4096$; conventional usable hosts **4094**.

**Why this example matters:** The network can change in the **third octet**; do not assume all prefix calculations affect only the fourth.

#### Subnetting a larger network into smaller networks

Suppose `192.168.50.0/24` must be divided into **four equal subnets**.

1. Four subnets require **two additional network bits** because $2^2=4$.
2. New prefix is `/24 + 2 = /26`.
3. The four networks start every 64 addresses:

| Subnet | Network | Broadcast | Usable range | Host capacity |
| --- | --- | --- | --- | ---: |
| 1 | 192.168.50.0/26 | .63 | .1–.62 | 62 |
| 2 | 192.168.50.64/26 | .127 | .65–.126 | 62 |
| 3 | 192.168.50.128/26 | .191 | .129–.190 | 62 |
| 4 | 192.168.50.192/26 | .255 | .193–.254 | 62 |

In this table, shortened `.63` means `192.168.50.63`; likewise for the other abbreviated last octets.

#### Choosing a subnet size for a host requirement

**Example:** You need at least **50 usable hosts per ordinary LAN subnet**. Find the smallest host-bit count $h$ such that $2^h-2\ge50$:

- $h=5$: $32-2=30$ (too small).
- $h=6$: $64-2=62$ (enough).
- Prefix is $32-6=\mathbf{/26}$.

**Remember:** More host bits → larger subnet → **shorter** prefix. More network bits → smaller subnet → **longer** prefix.

#### Private addresses, DHCP, and NAT

- **Private IPv4 ranges:** `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918). They are not publicly routed on the Internet as globally unique destination space.
- **DHCP:** Automatically configures addresses and other host settings, such as gateway and DNS resolver. A common learning sequence is **Discover → Offer → Request → Acknowledge** (DORA).
- **NAT:** A home router can translate private IP addresses (and often ports) to allow many hosts to share a public IPv4 address. NAT **does not replace** routing, and it is not equivalent to a firewall.

### 4.4.3 Internet Control Message Protocol (ICMP)

**ICMP** reports certain network conditions and errors and supports tools such as **ping** and **traceroute**. Examples include **Echo Request/Reply** and **Time Exceeded**. ICMP is not TCP or UDP application data; tools may use ICMP messages or other probes depending on the implementation.

### 4.4.4 IPv6

**IPv6** uses 128-bit addresses and a redesigned fixed base header. It addresses IPv4 address-space limitations and changes details of header processing and fragmentation. IPv6 does not have IPv4-style broadcast; multicast and other mechanisms fill related needs.

### 4.4.5 A brief foray into IP security

**IPsec** adds network-layer security mechanisms such as authentication/integrity and optional encryption, depending on protocol and configuration. IPsec is a set of mechanisms; merely using an IP address does not secure traffic.

## 4.5 Routing Algorithms

A routing algorithm chooses paths using information about network topology and/or neighboring routers. Routes can be selected by **cost**, which may represent hop count or other configured metrics.

### 4.5.1 Link-state (LS) routing algorithm

In **link-state** routing, routers distribute information about their directly attached links so each can build a network topology view. **Dijkstra's algorithm** finds least-cost paths from a source given nonnegative link costs.

**Worked example:** A→B cost 2, B→C cost 3, direct A→C cost 10. A→B→C cost 5 is shorter than the direct route of 10.

### 4.5.2 Distance-vector (DV) routing algorithm

In **distance-vector** routing, routers exchange distance estimates with neighbors. Updates follow a Bellman–Ford style principle:

$$D_x(y)=\min_{v\in N(x)}\left\{c(x,v)+D_v(y)\right\}.$$

Here $D_x(y)$ is node $x$'s estimated minimum cost to destination $y$, $N(x)$ is the set of $x$'s neighbors, and $c(x,v)$ is the link cost. DV can encounter slow convergence and count-to-infinity issues after failures.

### 4.5.3 Hierarchical routing

The Internet groups routing administration into **autonomous systems (ASes)**. Within one AS, routers can use an interior gateway protocol. Between ASes, routing includes administrative and policy decisions, not only shortest-distance cost.

## 4.6 Routing in the Internet

### 4.6.1 Intra-AS routing: RIP

**RIP (Routing Information Protocol)** is a distance-vector-style interior routing protocol. It uses hop count as a metric, with a limited maximum reachable path length. Its simplicity is useful for learning but it is not suitable for every modern network size or requirement.

### 4.6.2 Intra-AS routing: OSPF

**OSPF (Open Shortest Path First)** is a link-state interior gateway protocol. Routers share link-state information and calculate shortest paths within an AS. OSPF supports areas to organize large deployments.

### 4.6.3 Inter-AS routing: BGP

**BGP (Border Gateway Protocol)** exchanges inter-AS reachability and path-related information. Policies influence which routes are advertised or chosen; the globally selected route is not simply the path with the fewest hops between routers.

| Protocol | Scope | Basic approach |
| --- | --- | --- |
| RIP | Within an AS | Distance vector, hop count |
| OSPF | Within an AS | Link state, shortest paths |
| BGP | Between ASes (and internally for BGP route distribution) | Path-vector-style reachability and policy |

## 4.7 Broadcast and Multicast Routing

### 4.7.1 Broadcast routing algorithms

**Broadcast routing** distributes packets to **all intended nodes** in a network scope. The textbook discusses mechanisms such as uncontrolled flooding, controlled flooding, and spanning-tree techniques. This is **not identical** to calculating an IPv4 subnet's **directed broadcast address**; the two share the word "broadcast" but refer to different problems.

### 4.7.2 Multicast

**Multicast** delivers data to interested receivers in a **group** rather than every possible destination. Efficient distribution can use tree structures. IPv4 multicast addressing differs from ordinary unicast subnets and their directed broadcast addresses.

## 4.8 Summary

IP gives **best-effort host-to-host datagram delivery**. Routers forward packets using addresses and forwarding tables; routing protocols help build those tables. CIDR determines which IPv4 bits name the network and which remain available for hosts. Remember to distinguish the **network address**, **broadcast address**, and **usable host range**.

## Quick revision: OSI seven layers

This review comes from **Chapter 1, §1.5.1**, not Chapter 4 of the source textbook.

```text
7  Application    HTTP, DNS, SMTP, FTP
6  Presentation   Representation / encoding
5  Session        Dialogue / session functions
4  Transport      TCP, UDP
3  Network        IP, routing
2  Data Link      Ethernet / Wi-Fi framing
1  Physical       Bits / radio / fiber / copper signals
```

**Mnemonic:** "All People Seem To Need Data Processing" from layers 7 to 1 (an optional memory aid). The textbook primarily follows the five-layer Internet stack.

## Common mistakes

1. **Subtracting 2 for `/31` and `/32`:** They are special cases.
2. **Mistaking broadcast for last host:** Broadcast is **not** the conventional last usable address.
3. **Assuming `/26` means 26 host bits:** It means **26 prefix/network bits**.
4. **Mask arithmetic:** `255.255.255.192` is `/26`, not `/24`.
5. **Ignoring an earlier-octet boundary:** `/20` subnets change in the third octet.
6. **Forwarding vs routing:** Per-packet next-hop choice vs path computation.
7. **IP vs TCP:** IP is best-effort; TCP adds transport reliability.
8. **Broadcast address vs broadcast routing:** A subnet address calculation vs a distribution algorithm.

## Practice and review — original exercises

Work through each item before revealing the answer. This Markdown-only page deliberately uses native browser disclosure controls; it does not store scores or automatically accept text input.

**4.1** What is the role of the network layer?

<details><summary>Check answer 4.1</summary><p>Host-to-host IP datagram forwarding across potentially many links and routers.</p></details>

**4.2** What is the difference between routing and forwarding?

<details><summary>Check answer 4.2</summary><p>Routing calculates/learns paths; forwarding chooses a local outgoing interface for a packet.</p></details>

**4.3** Which route wins for `10.10.3.4`: `10.0.0.0/8` or `10.10.0.0/16`?

<details><summary>Check answer 4.3</summary><p>`10.10.0.0/16` because it is the longest matching prefix.</p></details>

**4.4** How many bits are in IPv4 and IPv6 addresses?

<details><summary>Check answer 4.4</summary><p>IPv4: 32 bits. IPv6: 128 bits.</p></details>

**4.5** Find the mask for `/26`.

<details><summary>Check answer 4.5</summary><p>255.255.255.192.</p></details>

**4.6** Calculate network, broadcast, first host, last host, and conventional capacity for `192.168.1.77/26`.

<details><summary>Check answer 4.6</summary><p>Network 192.168.1.64; broadcast 192.168.1.127; first 192.168.1.65; last 192.168.1.126; 62 usable hosts.</p></details>

**4.7** Calculate those same five values for `192.168.1.201/27`.

<details><summary>Check answer 4.7</summary><p>Network 192.168.1.192; broadcast 192.168.1.223; first 192.168.1.193; last 192.168.1.222; 30 usable hosts.</p></details>

**4.8** Find the usable host count for an ordinary `/28` LAN.

<details><summary>Check answer 4.8</summary><p>2^(32−28) − 2 = 16 − 2 = 14.</p></details>

**4.9** What is the smallest ordinary IPv4 subnet for at least 25 usable hosts?

<details><summary>Check answer 4.9</summary><p>/27 provides 32 addresses and 30 conventional usable host addresses. /28 has only 14.</p></details>

**4.10** Divide `192.168.20.0/24` into eight equal subnets. What prefix is needed?

<details><summary>Check answer 4.10</summary><p>Three extra prefix bits, because 2^3 = 8. New prefix /27; block size 32 addresses.</p></details>

**4.11** What is the network address of `10.8.37.200/20`?

<details><summary>Check answer 4.11</summary><p>10.8.32.0. The third octet uses blocks of 16: 32–47 contains 37.</p></details>

**4.12** What is the broadcast address of `10.8.37.200/20`?

<details><summary>Check answer 4.12</summary><p>10.8.47.255.</p></details>

**4.13** Is `172.31.5.10` within the private IPv4 `172.16.0.0/12` range?

<details><summary>Check answer 4.13</summary><p>Yes. 172.16.0.0 through 172.31.255.255 belong to that private block.</p></details>

**4.14** Expand DHCP's four common discovery messages (DORA).

<details><summary>Check answer 4.14</summary><p>Discover, Offer, Request, Acknowledge.</p></details>

**4.15** Which tool usually tests echo reachability using ICMP: ping or FTP?

<details><summary>Check answer 4.15</summary><p>Ping; FTP transfers files.</p></details>

**4.16** Given A→B cost 3, B→C cost 2, and direct A→C cost 9, which path is cheaper?

<details><summary>Check answer 4.16</summary><p>A→B→C, total cost 5, versus 9 direct.</p></details>

**4.17** Which algorithm family corresponds to Dijkstra: link-state or distance-vector?

<details><summary>Check answer 4.17</summary><p>Link-state.</p></details>

**4.18** Which Internet routing protocol primarily exchanges inter-AS reachability and policy information?

<details><summary>Check answer 4.18</summary><p>BGP.</p></details>

**4.19** Does IPv6 use IPv4-style broadcast addresses?

<details><summary>Check answer 4.19</summary><p>No. IPv6 uses mechanisms such as multicast instead of IPv4-style broadcast.</p></details>

**4.20** List OSI layers 7 through 1.

<details><summary>Check answer 4.20</summary><p>Application, Presentation, Session, Transport, Network, Data Link, Physical.</p></details>

**4.21** For a conventional `/30` subnet, how many total addresses and usable host addresses are there?

<details><summary>Check answer 4.21</summary><p>4 total, 2 conventionally usable.</p></details>

**4.22** Is `192.168.1.63` the last usable host of `192.168.1.0/26`?

<details><summary>Check answer 4.22</summary><p>No. It is the broadcast address. Last usable host is 192.168.1.62.</p></details>

**4.23** Why does an IPv4 router decrement TTL?

<details><summary>Check answer 4.23</summary><p>To prevent packets from circulating indefinitely in routing loops.</p></details>

**4.24** What does the prefix `/24` indicate in `192.168.5.9/24`?

<details><summary>Check answer 4.24</summary><p>The first 24 bits are the network prefix; 8 bits remain as the host portion.</p></details>

## Related chapters

[Chapter 1 — Network Fundamentals and OSI](/notes/computer-networking-chapter-1/) · [Chapter 2 — Application Layer](/notes/computer-networking-chapter-2/) · [Chapter 3 — Transport Layer](/notes/computer-networking-chapter-3/) · [Study roadmap](/notes/computer-networking-chapters-1-4/)
