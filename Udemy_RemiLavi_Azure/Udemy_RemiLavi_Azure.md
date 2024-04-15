# Concept of Cloud Compute:
![Cloud_Compute](./Cloud_Compute.png)

* 4 types of Compute Services:
    - Virtual Machines
    - App Services
    - AKS
    - Azure Functions

# Virtual Machines
It's a (not real) server which runs on top of real (physical)server.

We use this in IaaS.

![VM_Architecture](VMArchitecture.png)

The physical layer is completely managed by Azure, we can do nothing about it.

We can do things in Virtual layer.

- Steps for Creating VM in Azure：
    - Select the location
    - Select the image (OS + Pre-Installed of the software)
    - Select the size
    - CHECK THE PRICE FOR YOUR PLAN/SUBSCRIPTION.


- To Check the price, use pricing calculator in Azure

- Concept of VNet and Subnet is in future course.

- When creating VM choose RDP as port,  remote desktop port.

## The Real Cost of VM
1. VM
2. Disk
3. IP
4. Storage Account

## Reduce the cost of VM
There are some tech to do this:
1. Auto shutdown
    - Option for VM when creating
2. Reserved Instances
    - Means you reserve a machine in future, the fee is charged even if you don't use it. Fee could be charged monthly, but you need to pay upfront.
3. Spot instances
    - Machines run on unused capacity, but will be shut down anytime when azure requires.
    - you can choose to stop your machine, or completely deleted when Azure requires a recycle.
4. Disk optimization
    - Most of time, Azure choose Premium SSD for the disk of VM.

## Availability of a VM

- Microsoft have SLA(service level agreement) with guarantees for availability of VM.

