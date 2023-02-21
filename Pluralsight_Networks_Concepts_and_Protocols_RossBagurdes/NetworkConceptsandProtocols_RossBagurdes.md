# 3 Dissecting Communication

## Local and Global Addressing

When we have conversation with the other party, the conversation can be processed due to following categories of components.

Instructor used Homer's example, which is Homer can talk to Marge locally and remotely.

| Category       | Description                                                                                                                                                                                                                                                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Media          | In order to have data spread out, we need air/wire, those are the media for conversations                                                                                                                                                                                                                                                                                                 |
| Local address  | In Homer's example, this could be the name of Homer and name of Marge, when the conversation starts, two names will tell everyone in local environment, this conversation is between Homer and Marge                                                                                                                                                                                      |
| Global address | In Homer's example, this could be Marge's phone number. When Homer talks to Marge remotely, he needs to know Marge's phone number to start a conversation                                                                                                                                                                                                                                 |
| Cues           | In order to pass the real content of conversation, which is the data, Homer and Marge needs to say **hello** at first to make sure, the phone conversation is started, and say **goodbye** to each other, so that they know the conversation is ended. Hellos and goodbyes including other words to check the status between these two people are defined as the cues to the conversation |
| Data           | the real content of conversation, data                                                                                                                                                                                                                                                                                                                                                    |

## Protocols and Communications Models

### Protocol

A set of rules has to be followed when move information between 2 people or devices.

### Communication Model

Method of organizing information transfer into components.

# 4 Network Communication Models

## Categorizing Data Transmissions

Now we are going to map the Homer example into network.
|Category|Description|
|-|-|
|Media|Wires/Radios/Glass fibers|
|Local address| Ethernet, send the message(cues/data + global address) with local address, keep moving from client to router to another router to another router... every move will keep updating the local address with current passed device|
|Global address| Internet Protocal (IP), SYN with client IP and website server IP, SYN-ACK with both IP, ACK with both IP|
|Cues| TCP. Before we retrieve website data, we need to establish a session with the server, client needs to send a SYN to server, server needs to send a SYN - ACK back to client, client then send a ACK to server to say I'm about to send data. This is called three way handshake.|
|Data|Websites/Email|

## The OSI Model

| Layer       | Description           |
| ----------- | --------------------- |
| Physical    | Wires/Radio/Glass     |
| Data Link   | Ethernet              |
| Network     | Internet Protocol(IP) |
| Transport   | TCP                   |
| Application | Website/Email         |

## TCP/IP Model

| TCP/IP Layer      | OSI Layer    | Description           |
| ----------------- | ------------ | --------------------- |
| Network Interface | Physical     | Wires/Radio/Glass     |
| Network           | Data Link    | Ethernet              |
| Internet          | Network      | Internet Protocol(IP) |
| Transport         | Transport    | TCP                   |
| Application       | Session      | - ssl                 |
| Application       | Presentation | - IBM etc.            |
| Application       | Application  | Website/Email         |

# 5 Encapsulation

## Examining the OSI Model

## How Encapsulation Works

![TransportLayer](./TransportLayer.png)
![NetworkLayer](./NetworkLayer.png)
![DataLinkLayer](./DataLinkLayer.png)
Physical Layer: 010101001010101101010101010

# 6 Data Networks and Addressing

## Addresing the Network

Local Address(MAC Address)
000C:29FC:70A5
First 24 bits are for Manufacturer ID
Second 24 bits are for Serial Number

MAC Address are printed into the Network Interface Card(网卡).
NIC is responsible for Physical Layer -> Data Link Layer transfer.

## How Local Communication Works

Frames are only allowed in local networks. Router(Gateway, Default Gateway) separates networks into inside and outside. Frames in inside will never go out to the outside.

## How Global Addressing Works

So in order to visit pluralsight.com(outside) from your home(inside), the packet is first send within inside frames to the router, then, the router pull out the packet and put it into a outside frame and send to the internet.

![GolobalAddressing](./GlobalAddressing.png)

## IP Networks

So since router has different IP addresses (inside vs. outside), it's a layer-3 devices.

### The Subnet Mask

192.168.104.1
255.255.255.0

203.000.113.8
255.255.255.0

That makes 192.168.104, 203.000.113 be the **network** portion, and 1 and 8 be the **host** portion of the IP address.

When send message to different network IP address, the device won't even send it directly. We need router in the middle to send message between two different network IP address.

## Demo: Examining the IP Address of a Workstation

`certmgr.msc`

# Cisco Certification Resources

- Todd Lammele for Cisco study guide
- Wendel Odom for Cisco study guide
- Cisco Network Academy
- GNS3 / VIRL
- Packet Tracer

# Introduction to IP Addressing

## What is an IP Address

![IPAddress](./IPAddress.png)
Network Portion identifies a group of device, and host portion is the individual device identifier.

1. Classful Addressing (1995 and prior)
2. Classless Addressing (1995 to present)

## Classless Addressing

Subnet Mask determine which part of IP Address is network prefix and which is host portion.
Network prefix portion is the 1s part and host is the 0s part.
For example,

- 203.0.113.10 with 255.255.255.0, will give us last 8 bits for host and 24 bits at beginning for network prefix.
- 10.0.0.10 with 255.255.240.0, will give us last 12 bits for host and 20 bits at beginning for network prefix.

## Classful Addressing

![ClassfulAddressing](./ClassfulAddress.png)
ClassA : beginning 8 bits are network prefix
ClassB : beginning 16 bits are network prefix
ClassC : beginning 24 bits are network prefix
ClassD : 32 bits are all network prefix, used for multicasting

## Address Types

Network Address

- Identifier for a group of devices
- Network prefix

Broadcast Address

- Identifier for all devices on a network

Host Address

- Identifier for unique device on a network

### Network Address Example

203.0.113.0 with 255.255.255.0, then it is a network address, because all the host portion is 0s.

### Broadcast Address Example

203.0.113.255 with 255.255.255.0, then it is a broadcast address, because all the host portion is 1s.

> Never assign these two types of address to any device.

## Private and Public Addresses

Only allowed to be used within an organization.
![Private IP Address Range](./PrivateIPRange.png)
127.0.0.1 is loopback address for local.

Except private IP Address and loopback gives us the public IP Address.

# Introduction to Subnetting

Simple way to write IP Address and Subnet Mask with Classless Inter-Domain Routing Notation(CIDR notation).

203.0.113.10/24 means 203.0.113.10 with 255.255.255.0

# Introduction to IPv6

Bit

- 1 or 0

Nibble - 4 bits

- 1010
- Hex - 0xA

Byte - 8 bits

- 11001001
- Hex - 0xC9

Hextet - 16 bits

- 10101010 01000110
- Hex - 0xAA46

## IPv4 Addresses vs. IPv6 Addresses

IPv6 Address Size is 128 bits long

2001:0DB8:0002:008D:0000:0000:00A5:52F5

## The Structure of an IPv6 Addresses

64 bits at beginning is for network prefix.

64 bits at the end is for host portion.

## IPv6 Address Types

Unicast Address

- Global Unicast Address
- Link Local Address
  - FE80::/10

Loopback Address

- ::1/128
