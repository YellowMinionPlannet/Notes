# Introduction to Granite UI

Reach out to the Granite Official Documentation for further info.

AEM Dialog development will focuss on the Server-side components within the documentation.

# Dialog Node Structure

cq:dialog .content.xml

## container layout, and items

Container is the component that contains items(other components). It can have 2 types of items:

- items
- datasource

All container inherit from granite:container.

Within the documentation there will be a granite:container listed after the component name, if that particular component inherit from container.

For example, for helloworld component which locates at "/ui.apps/src/main/content/jcr_root/apps/aem-advanced-dialogs/components/content/helloworld/\_cq_dialog", there's a `.content.xml` file for this cq:dialog node.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Properties"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
        <items jcr:primaryType="nt:unstructured">
            <column
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                <items jcr:primaryType="nt:unstructured">
                    <text
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                        fieldLabel="Text"
                        name="./text"/>
                </items>
            </column>
        </items>
    </content>
</jcr:root>
```

1. we can know this \_cq_dialog is a dialog, because the jcr:root tag's sling:resourceType is "cq/gui/components/authoring/dialog"

2. we can identify the column tag is the container by the same logic

3. we can added something else to extend this dialog

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Properties"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
        <items jcr:primaryType="nt:unstructured">
            <column
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                <items jcr:primaryType="nt:unstructured">
                    <text
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                        fieldLabel="Text"
                        name="./text"/>
                    <well jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/well">
                        <items jcr:primaryType="nt:unstructured">
                            <simpletext jcr:primaryType="nt:unstructured"
                                        sling:resourceType="granite/ui/components/coral/foundation/text"
                                        text="I live in a well"/>
                        </items>
                    </well>
                </items>
            </column>
            <columntwo
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                <items jcr:primaryType="nt:unstructured">
                    <button
                        jcr:priamryType="nt:structured"
                        sling:resourceType="granite/ui/components/coral/foundation/button"
                        text="Hello World" />
                </items>
            </columntwo>
        </items>
    </content>
</jcr:root>
```

### Coral UI 2 vs. Coral UI 3

2: sling:resourceType = "granite/ui/components/foundation/container"

3: sling:resourceType = "granite/ui/components/coral/foundation/container"

See documentation lagacy UI section for migrating from 2 to 3.

## Build a Tabbed Dialog (Common Attributes)

Within Granite Documenation, there is a seciton at server-side, called Common Attributes.

Remember to add Granite Namespace to your `.content.xml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Properties"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
        <items jcr:primaryType="nt:unstructured">
            <column
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                <items jcr:primaryType="nt:unstructured">
                    <text
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                        fieldLabel="Text"
                        name="./text"/>
                    <well jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/well"
                        granite:id="myId"
                        granite:class="myClass">
                        <granite:data myattribute="Tyler"></granite:data>
                        <items jcr:primaryType="nt:unstructured">
                            <simpletext jcr:primaryType="nt:unstructured"
                                        sling:resourceType="granite/ui/components/coral/foundation/text"
                                        text="I live in a well"/>
                        </items>
                    </well>
                </items>
            </column>
            <columntwo
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                <items jcr:primaryType="nt:unstructured">
                    <button
                        jcr:priamryType="nt:structured"
                        sling:resourceType="granite/ui/components/coral/foundation/button"
                        text="Hello World" />
                </items>
            </columntwo>
        </items>
    </content>
</jcr:root>
```

## Build a Tabbed Dialog

See "\Training\demos\ui.apps\src\main\content\jcr_root\apps\aem-advanced-dialogs\components\content\dailog-training_cq_dialog\.content.xml" for details.

# Granite UI Form Fields

## Dailog Form Submission

When we interact with components(fields) within form dialog, the field is posted to the AEM and map to the JCR content. The generated content by the form is called resource in AEM's JCR.

To know which resource the form's field is mapped to, we need to inspect the form's action attribute.

When we open the dialog(form), the form will populate the properties of resource mapped to the JCR content which is located by the action attribute.

### How to inspect our form dialog?

1. F12 developer tool, when open the dialog.
2. Inspect the form tag's action attribute.

For example, "action='/content/aem-advanced-dialogs/en/\_jcr_content/root/responsivegrid/dialog_training'"

3. In crxde, it will be locate at "/content/aem-advanced-dialogs/en/jcr:content/root/responsivegrid/dialog_training" since the colon `:` is not available in URL.

4. Try modify form fields with form input component and re-visit this node again.

5. Add textfield, name="./textfield", open the dialog, and we can see new input component on the dialog, we put "Some new text" sumbit form, then back in the CRXDE Lite, we can see under "/content/aem-advanced-dialogs/en/jcr:content/root/responsivegrid/dialog_training" node, there is a property called textfield, the value is "Some new text".

6. Add color field, name="./colors/selectedColor", choose a color and submit, we can see in CRXDE Lite, there is a new node "/content/aem-advanced-dialogs/en/jcr:content/root/responsivegrid/dialog_training/colors", with jcr:primaryType valued nt:unstructured, and selectedColor properties.

7. Add textfield, name="../textfield", back in CRXDE Lite, There is no new node under the current input component node, but at the parent node, there would be a textfield property.

8. Access properties we created within HTL Template

```html
<!-- \Training\demos\ui.apps\src\main\content\jcr_root\apps\aem-advanced-dialogs\components\content\dailog-training\dialog_training.html -->
<div>
  <h2>Dialog Training</h2>
  <p>Text is ${properties.textfield}</p>
  <!-- <p>Text is ${properties.colors.selectedColor}</p> -->
  <!-- This won't work, properties only have direct property field resource. -->
</div>
```

## Advanced Form Components Demo

### Working with Property Types

```html
required="{Boolean}true" step="{Long}10"
```

- Use `@TypeHint` to force stroing the proptery with a given type.
- Use `@DeleteHint` to remove property, eg. when check box is not checked, then the corresponding field is not submitted.

1. Add textfield, name="./requiredField", and added required="{Boolean}true" attribute to the tag. Open dialog, we can see that this component labeled with a \* mark. And you can't submit the form if you leave it blank. Open CRXDE Lite, in the "\Training\demos\ui.apps\src\main\content\jcr_root\apps\aem-advanced-dialogs\components\content\dailog-training\cq:dialog\content\items\tabs\items\tab2\items\required" node, which created when we set required="{Boolean}true", there's a property called required valued true.

2. We cannot change the type of the property once we saved it.

3. We add a number field, name="./numberField", and added min="{Long}10" max="{Long}1000" step="{Long}10" typeHint="Long". We open dialog there would be a number input in the dialog. We submit the dialog. It will create property under "content/aem-advanced-dialogs/en/jcr:content/root/responsivegrid/dialog_training/" named numberField.

> NOTE: not all components support typeHint.

4. We add checkbox, name="./checkbox", where in the document the deleteHint property is true, which means when this checkbox's value is unchecked, the checkbox property, which defined with name, will be deleted. If you still need that checkbox property to exist, you need to put uncheckedValue="not checked" in the checkbox tag. If we use deleteHint="{Boolean}false", we can't delete the checkbox property, and since after we uncheck the checkbox input, we re-open dialog, the checkbox input still remain checked.

## Working with Multifield

1. Add <multiField> tag, with fieldLabel="Fruits", and create child tag <filed> which has name="./fruits", sling:resourceType="granite/.../textfield". If we submit form, we can see fruits as a created property under content/.../dialog_training/, which is a String Array.

2. Within multiField, create child tag with sling:resourceType="granite/.../container" called field. Create items tag within field tag, and within items, create required tag with sling:resourceType="granite/.../textfield", name="./multiText", fieldLabel="Enter text here", create numberField tag with sling:resourceType="granite/.../numberfield", name="./multiNumber". Open dialog, there will be multi container, each container has one textfield input and one numberfield input. Submit the dialog, under "content/.../dialog_training/fruits", there will be two items named item0 and item1, each will have multiText and multiNumber properties.

# Pre-populating Data for Components and Dialogs

`_cq_` of the folder name will be converted to `cq:` in JCR.

Using cq:template is powerful when you need some properties already populated when the component is first initialized. (You need some logic that check some property when the component is rendered to the page which means you drag the component to the page).

## Demo

First we create a component named "prepopulate-me",

```xml
<!-- ui.apps\src\main\content\jcr_root\apps\aem-advanced-dialog\components\contents\prepopulate-me\_cq_dialog\.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Prepopulate Component"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
        <items jcr:primaryType="nt:unstructured">
            <container
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                    <items jcr:primaryType="nt:unstructured">
                            <select jcr:primaryType="nt:unstructured"
                                sling:resourceType="/libs/granite/ui/components/coral/foundation/form/select"
                                name="./position"
                                fieldLabel="Enter Text Here">
                                <items jcr:primaryType="nt:unstructured">
                                    <selectone jcr:primaryType="nt:unstructured"
                                            value="horizontal"
                                            text="Horizontal"/>
                                    <selecttwo jcr:primaryType="nt:unstructured"
                                               value="vertical"
                                               text="Vertical"/>
                                </items>
                            </select>
                    </items>
            </container>
        </items>
    </content>
</jcr:root>

```

```xml
<!-- ui.apps\src\main\content\jcr_root\apps\aem-advanced-dialog\components\contents\prepopulate-me\.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Tabbed Dialog"
    componentGroup="aem-advanced-dialogs"/>
```

```html
<!-- ui.apps\src\main\content\jcr_root\apps\aem-advanced-dialog\components\contents\prepopulate-me\prepopulate-me.html -->
<style>
  .style-me ul li {
    position: absolute;
  }

  .style-me.horizontal ul li {
    position: relative;
    display: inline-block;
    padding: 0px 20px;
    border-right: 1px solid #bebebe;
  }

  .style-me.horizontal ul {
    float: none;
    text-align: center;
    list-style: none;
    position: relative;
  }

  .style-me.horizontal p {
    max-width: 360px;
    margin: 0 auto;
  }

  .style-me.vertical ul {
    float: left;
    position: relative;
    width: 100px;
    padding: 0;
  }

  .style-me.vertical p {
    float: left;
    width: 300px;
    padding: 20px;
  }

  .style-me.vertical ul li {
    position: relative;
    border-bottom: 1px solid #e9e9e9;
    padding: 5px;
  }
  .style-me.vertical ul {
  }

  li.no-border {
    border: none !important;
  }
</style>

<div class="style-me ${properties.position}">
  <ul>
    <li>Java</li>
    <li>C++</li>
    <li>JavaScript</li>
    <li>HTML</li>
    <li class="no-border">CSS</li>
  </ul>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
</div>
```

So before we do anything, the rendering script has a logic that check the properties.position, which is property can be selected within the dialog. But it will not have value before we open dialog and set it. Here comes cq:template.

1. Create a \_cq_template folder and create .content.xml file.
2.

```xml
<!-- ui.apps\src\main\content\jcr_root\apps\aem-advanced-dialog\components\contents\prepopulate-me\_cq_template\.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    position="vertical">
    <tyler jcr:primaryType="nt:unstructured"
        name="Tyler"/>
</jcr:root>
```

Then we can see :

1. vertical is prepopulate to position property when we create prepopulate-me component.
2. There is a extra tyler node under the newly created prepopulate-me component and with name property valued Tyler.

# Dialog Input Validation and Custom JavaScript

## Adding Javascript via cq.authoring.dialog

Using cq.authoring.dialog will be adding javascript to all the dialog in AEM, including those predefined dialog in AEM.

## Demo

Create a folder in /ui.apps/src/main/content/jcr_root/apps/aem-advanced-dialogs/clientlibs/ named cq-authoring-dialog-clientlib. It has properties jcr:primaryType valued cq:ClientLibraryFolder, allowProxy="{Boolean}true", categories="[cq.authoring.dialog]".

```xml
<!-- /ui.apps/src/main/content/jcr_root/apps/aem-advanced-dialogs/clientlibs/cq-authoring-dialog-clientlib/.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[cq.authoring.dialog]"
    />
```

```txt
<!-- /ui.apps/src/main/content/jcr_root/apps/aem-advanced-dialogs/clientlibs/cq-authoring-dialog-clientlib/js.txt -->
#base=js
js.js
```

```js
// /ui.apps/src/main/content/jcr_root/apps/aem-advanced-dialogs/clientlibs/cq-authoring-dialog-clientlib/js/js.js
console.log("I was added through the cq.authoring.dialog global clientlibrary");

$(document).on("foundation-contentloaded", function (e) {
  var container = e.target;

  console.log(
    "foundation-contentloaded was fired from the global cq.authoring.dialog method."
  );
  console.log(container);
});
```

## By IncludeClientlibs u can add js to specific dialog

1. Create folder named include-clientlibs-clientlib,
2. the difference is the .content.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[pluralsight.includeme]"
    />
```

3. /ui.apps/src/main/content/jcr_root/apps/aem-advanced-dialogs/components/content/prepopulate-me/\_cq_dialog/.content.xml

```xml
<!-- /ui.apps/src/main/content/jcr_root/apps/aem-advanced-dialogs/components/content/prepopulate-me/\_cq_dialog/.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Prepopulate Component"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
        <items jcr:primaryType="nt:unstructured">
            <include-me jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/includeclientlibs"
                js="pluralsight.includeme"/>
                <!-- here is the including logic of js only, we can use css="pluralsight.includeme" or categories="pluralsight.includeme" to include css only or include js and css-->
            <container
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                    <items jcr:primaryType="nt:unstructured">
                            <select jcr:primaryType="nt:unstructured"
                                sling:resourceType="/libs/granite/ui/components/coral/foundation/form/select"
                                name="./position"
                                fieldLabel="Enter Text Here">
                                <items jcr:primaryType="nt:unstructured">
                                    <selectone jcr:primaryType="nt:unstructured"
                                            value="horizontal"
                                            text="Horizontal"/>
                                    <selecttwo jcr:primaryType="nt:unstructured"
                                               value="vertical"
                                               text="Vertical"/>
                                </items>
                            </select>
                    </items>
            </container>
        </items>
    </content>
</jcr:root>
```

## To add customized js to validate inputs

Create a node in .../app/aem-advanced-dialog/components/content/input-validation,
create a \_cq_dialog node under it,

```xml
<!-- .../app/aem-advanced-dialog/components/content/input-validation/_cq_dialog/.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Input Validation"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
        <items jcr:primaryType="nt:unstructured">
            <container
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container">
                    <items jcr:primaryType="nt:unstructured">
                        <textfield jcr:primaryType="nt:unstructured"
                            sling:resourceType="/libs/granite/ui/components/coral/foundation/form/textfield"
                            name="./input"
                            fieldLabel="Enter Text Here">
                            <granite:data must-contain="pluralsight"/>
                            <!-- data-must-contain attribute value -->
                        </textfield>
                    </items>
            </container>
        </items>
    </content>
</jcr:root>

```

```xml
<!-- .../app/aem-advanced-dialog/components/content/input-validation/valid-js/.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[cq.authoring.dialog]"
    />

```

```js
$(window)
  .adaptTo("foundation-registry")
  .register("foundation.validation.validator", {
    selector: "[data-must-contain]",
    validate: function (el) {
      var mustContain = el.getAttribute("data-must-contain");

      console.log("validating text contains pluralsight");
      console.log("input must contain " + mustContain);

      var input = el.value;

      if (input.indexOf(mustContain) === -1) {
        return (
          "The field must contain " +
          mustContain +
          ". It current value is " +
          el.value +
          "."
        );
      }
    },
  });
```

# Toggleable Dialog Form Fields
