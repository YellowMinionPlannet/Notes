# Basic Authoring Skills

## Elements of AEM Page Creation

- Page is the basic unit of creating websites in AEM
- Page can be created by a Template
- Within a page you can use components to fill out the page, to check all the components, go to main page of Author Instance, Tool => General => Components.

## Key Fields for Page Creation

1. Title, required, displayed to the author, and will be displayed at the top of the Content Frame when editing.
2. Name, optional, will be used to create URL
3. Template
   - Editable template: Created and configured by template author
   - Static template: Created and configured by developers

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

## Working with Page Properties

These are properties in page properties in edit mode need to be noted:

- Navigation Root Node: this page will create a root url, so that children page will follow this root url
- On/Off Time: when this page is going to be published
- Vanity URL: to make url shorter
- Allowed Templates: add allowed templates for pages created beneath this page
- Closed User Group: user access control, determine if user need to provide credentials to access
- Permissions: define author's permission to this page
