# Getting Started
## Create a new project
dev.azure.com is the home page of Azure DevOps

## User types, Security and Azure Directory
### MSA account vs. Azure Active Directory account
MSA account is the account normal person created with @hotmail.com @live.com @outlook.com
MSA acccont is managed by the user himself/herself

Azure Active Directory account is created with Enterprise 
the account is managed by the Enterprise

How you can tell you are MSA or AAD?
Go to *Organization settings* and Azure Active Directory, if it shows *connect* then you are MSA account.

## Account types, Features and Billing
There are
* Basic
* Stakeholders
* VS Subscriber

Stakeholders are free(unlimited) to attach to your project, they have read-only authority.
Basic are the code contributers, first 5 users are free to create. after that $6/month for each user.
VS Subscriber does not count in Basic accounts and have Basic authority, plus, QA Test feature.

## Permission Overview

* Project collection administrator
***Set two people in this level***
this is organization level of permission
all operations on all projects

* Project level group
    * Project administrator
    * Contributors
    * Readers
* Team level group
    same as project contributor

Don't do Team level a lot.

# Managing Your Source Code with Git & Azure DevOps Repos
## Git and Azure DevOps
More info course on Git
DevOps Skills for Developers with Visual Studio and TFS2017 on Pluralsight *by Benjamin Day*

# Building and Deploying with Azure DevOps Classic Pipelines
For more detail into Builds and Releases
DevOps Skills for Developers with Visual Studio and TFS 2017 *by Benjamin Day*
