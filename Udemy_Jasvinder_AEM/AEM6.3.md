# Section 2: AEM - An Overview

## Installation and Setup

The default install can be changed simply by renaming the jar file.
For example:

cq-author-p4502.jar (will result a author instance at port 4502)

cq-publish-p4503.jar

- Two types of server:
  1. Author: create/edit your content, and whatever you are doing is not visible on the website, what you activate/deactivate will reflect to the Publish server. If you delete content, the content will remove from both Author and Publish
  2. Publish: whatever you are doing is visible to the website

## AEM Consoles

- Admin Console: http://localhost:4502/siteadmin
- CRX Console: http://localhost:4502/crx/explorer/index.jsp
- OSGI Management Console: http://localhost:4502/system/console
- CRXDE Lite Console: http://localhost:4502/crx/de
- Package Manager Console: http://localhost:4502/crx/packmgr/index.jsp

# Section 3: Architecture and Concepts

## Basic Concepts and Terminologies

### Replication

- Content goes from Author to Publish is called Replication.
- Reverse Replication: Contents goes from Publish to Author. For example, user generate comments, blogs etc. and the generated will be pushed to Author
- Replication Agent: When we activate contents from Author, contents will be pushed to Replication Queue(which is on Author). The Publish has listeners that regularly checks Replication Queue and pick up and replicate when it finds updates.

### URL to Content and Scripts

For example, we have url like: ../content/corporate/jobs/developer.html

And in the repository, there must be ../content/corporate/jobs/developer.html file. And there will be some jcr content, properties like Sling:resourceType property, which will direct you to the right scripts, for example, `sling:resourceType = hr/jobs`, then you can find /apps/hr/jobs/jobs.esp for scripts that render the content.

## Understanding the AEM Architecture

| AEM Technology Stack                             |
| ------------------------------------------------ |
| AEM                                              |
| Apache Sling                                     |
| Java Content Repository (CRX, Apache Jackrabbit) |
| OSGi (Apache Felix)                              |

### JCR (Java Content Repository)

- JackRabbit framework used to build JCR
- XPATH is used to retrieving information from XML which is used to store JCR information.
- Two storage implementations available: TAR and MongoDB
  - TAR is default, MongoDB is for high performance and clustered applications

### OSGi

- OSGi application is a collection of bundles that interact using service interfaces.
- OSGi bundles can contain compiled Java code, scripts, content that is to be loaded in the repository, and configuration or additional files

## Dispatcher

- Dispatcher is AEM's caching and/or load balancing tool.
- Installed and configured in webserver
- Protects your AEM server from attack
- Provides Security as which URLs are accessible or filtered
- Provides load balancing like which requests to be forwarded to the application server or Publisher
- Provide Caching of web pages produced by Publisher instance to improve performance

# Section 4: Authoring

# Section 5: Templates and Components

## Folder Structure

- /apps - store all custom templates/components. You can inherit from foudation components which is from libs. Always copy from libs and then modify code in apps folder, never modify anything in libs.

- /libs - foundation components
- /contents - contents for your website
- /conf - all configurations for your site
- /etc - all resources related to utilities and tools
- /home - all information related to users and groups
- /var - files that change and updated by the system
- /tmp - servers as temporary working area

## Core vs Foundation Components

### Basics

AEM components built using Sling, Web Application Framework
AEM components are located under:
HTL: /libs/wcm/foundation/components
JSP: /libs/foundation/components

### Dialogs and Design Dialogs

- Dialogs are interfaces for authors to configure and provide input to that component
- cq:dialog for Touch-enabled UI and dialog for Classic UI
- Design Dialogs used for design detail configurations for authors

### Component Hierarchy and Inheritance

1. Resource Type Hierarchy
   - used sling:resourceSuperType property
2. Container Hierarchy
   - children config settings can be defined on the parent component and propagate to the child component
3. Include Hierarchy
   - This is imposed at runtime by the sequence of includes.

### Core components vs Foundation components

|                           | WCM Components |                                                                           |
| ------------------------- | -------------- | ------------------------------------------------------------------------- |
| **Core Components**       |                | **Foundation Components**                                                 |
| /apps/core/wcm/components |                | <p> /libs/foundation/components</p><p>/libs/wcm/foundation/components</p> |

### ProxyComponents

- Core component are not intended to be used directly, you need to use a proxy component to inherit from core component.

# Section 6: Dialog and cqDialog

- EXTJS Framework - Dialog
- CORAL UI Framework - cqDialog
