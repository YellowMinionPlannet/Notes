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
