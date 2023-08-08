# Introducing Touch UI

## Touch UI Overview

- Optimized for mobile and desktop, mouse/ touch interactive, responsive.
- AEM supports mobile(Tablet) and desktop operation to edit and publish websites.

### Interacting with Touch UI

| Mobile         | Desktop      |
| -------------- | ------------ |
| Tap            | Click        |
| Touch and Hold | Double Click |
| Swipe          | Hover        |

## Upper Header Bar

![upper_header](./UpperHeader.png?raw=true)

### Project Navigation

Goes to Projects, Sites, Assets etc.

Or goes to tools, like Workflow, Operations etc.

### Solutions

Marketing Cloud Solutions, Analytics, or other features.

### Parent Hiearchy

When browse within sites console, use this to navigate to different Hiearchy levels

### View switcher

Column View, Card View, List View etc.

### Action Bar

When select items in Sites console, by clicking the check icons in Card View, There will be a action bar at the position upper of Parent Hiearchy. Action bar only appear in Card View.

### Create button

Depends on which console you at.

### Left Rail

Depends on which console you at. In Sites console, Timline, References, Filter

## Project console

Create project/folder

## Sites console

- Create/view/manage website, Edit, publish.

Create button feature depends on the hiearchy or content you select.

## Assets console

- Import manage digital resource

## Mobile console

- Manage mobile applications

## Forms console

- Manage forms and assets,

## Screens console

- Manage screen sizes, maybe the adaptive mode of layouting?

## Page Toolbar and Content Frame

In Sites Console, when editing page by clicking edit button at action bar, there are two main element, Page Toolbar and Content Frame.

### Page Toolbar

You can select Edit/Scaffolding(create form, template)/Developer(Test)/Design(Define components available)/Targeting(How to use analytics and recommandations)/LiveCopyStatus mode, and Preview mode(mock website as it is published)/Anotate(show comments and reviews)

#### Side Panel button

Select assets/ components

#### Page information

Properties, Workflow, Publish page

### Content Frame

Container Holders, which allow adding components. Or you can use side panel buttons directly.

#### Component tool bar

Hover on component, it will appear.

# Basic Authoring Skills

## Elements of AEM Page Creation

- Page is the basic unit of creating websites in AEM
- Page can be created by a Template, Template defines default components
- Within a page you can use components to fill out the page, to check all the components, go to main page of Author Instance, Tool => General => Components console.

## Key Fields for Page Creation

1. Title, required, displayed to the author, and will be displayed at the top of the Content Frame when editing.
2. Name, optional, will be used to create URL, you need to fill this to control url created or will be created by title.
3. Template
   - Editable template: Created and configured by template author
   - Static template: Created and configured by developers

## Creating Pages

1. Sites Console
2. Create page
3. Select template
4. Fill out the key fields
5. Create

## Editing Pages

## Understanding Responsive Pages

There are two types of Layouts:

1. Adaptive: the server's response will change to a defined screen size, the server is doing the detection through media queries, and url will be different for different devices.
2. Responsive: client detection and layout will be adjust due to the screen size, same url

There are two ways to make content responsive:

1. Traditional

   - Implemented by designers and developers.
   - Designer mocks different breakpoints, developers implement breakpoints and create specific template, author use template and fill in the content.

2. Layouting
   - Layout Container Component
   - Layouting Mode: configure responsive mode
   - Emulator: simulate layout on different devices
   - Author use this layout container and develop the page

## Authoring Responsive pages

1. Edit mode
2. Select Layouting mode
3. Choose breakpoints, make sure the component is within the layout container so that we can drag the size of container.

## Working with Page Properties

1. Sites console
2. Card View
3. Select page
4. Action bar => View properties

These are properties in page properties in edit mode need to be noted:

- Navigation Root Node: this page will create a root url, so that children page will follow this root url, and current page is not necessary to have content.
- On/Off Time: when this page is going to be published
- Vanity URL: to make url shorter
- Allowed Templates: add allowed templates for pages created beneath this page
- Closed User Group: user access control, determine if user need to provide credentials to access
- Permissions: define author's permission to this page

## Managing Digital Assets

1. Assets console
2. Create new folder
3. Create Files

# Site Management and Publishing

## Organizing Site Structure

1. Sites Console
2. Drag to reordering pages
3. Move also can change name

## Versioning Pages

1. Sites Console
2. Select page
3. Left Rail
4. Timeline
5. Save a version
6. Edit page again
7. Refresh
8. Goes to timeline again
9. Save a version
10. select previous version and revert to this version.

## Workflows

1. Sites console
2. Select page
3. Edit mode
4. Page Information
5. Start workflow
6. pick a workflow

# Creating and Managing Templates

## Template Types

| Editable                                                 | Static                                       |
| -------------------------------------------------------- | -------------------------------------------- |
| created and maintained by authors                        | Defined and maintained by developers         |
| Define structure content and design                      | Same structure as the page                   |
| Maintain a connection between the template and the pages | No connection with page once page is created |

## Modes of the Template Editor

- Structure: building structure, lock / unlock component, if locked content cannot be edited by site author

- Initial Content: define initial content

- Layouting: to adjust layout corresponding differnt devices

## Content Policies

Define which components are allowed for the container. This is within the template editor. Design mode can also choose allowed components but it's triggered from page editor.

## Using template editor

- Left rail can open left panel and can have component and assets preloaded.

- To make component unlocked, click the component and click unlock on the tool bar.

- To define content policy, click policy on tool bar.

- To create a new policy,

  1.  click the Add button when you at policy dialog.
  2.  create
  3.  click the component again
  4.  click brush on the tool bar
  5.  manage allowed components in the dialog

- To enable the template, in the template console, use card view, select the draft template and click enable.

## Editing the template

If you try to edit the enabled editable template, the change will be effective to any page that is related to that template.

## Adding Initial Content

## Layout Mode

# Advanced Authoring Skills

## Design Mode

Allow page author to choose allowed components within container, and the change of policy will affect all pages that reference that template.

## Content Fragments

it's like content template, if you update the content fragment, all page reference this will be updated too.

Content fragment contains contents and versions of contents which called variations. You can choose different variation when you editing page.

## Workflows

## Launches

Site console, card view, left top create launch.

After launch created, select the referenced site, and click left rail, references, lauches. Go to page. So that you can edit the page, then select the page again, lauches, promote launch.

## Projects

## Taxonomy
