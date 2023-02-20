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

# Encapsulation

##
