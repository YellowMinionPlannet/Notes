# 17 Scripting Forms
## FORM BASICS
Form is represented as `HTMLFormElement` in JS, it is inherited from `HTMLElement`, therefore, it has the same common properties as its ancestor.

`HTMLFormElement` has following special properties:
- acceptCharset, character set that the server can process, equivalent to HTML accept-charset attribute.
- action, URL to send request to 
- elements, A HTMLCollection of all controls in the form
- enctype, encoding type of the request, equivalent to the HTML enctype attribute
- length, number of controls in the form
- method, type of HTTP request to send
- name, name of the form
- reset(), reset all form fields to their  default values
- submit(), submits the form
- target, the name of the window to use for sending the request, and receiving the response equivalent to HTML target attribute.

All forms on the page can be retrieved by `document.forms`, a collection of forms.
```js
let firstForm = document.forms[0];

let myForm = document.forms["form2"];//where form2 is the value of name property within the form
```

### Submitting Forms
Form will be submited by clicking submit button or image button:
```html
<!-- generic submit button -->
<input type="submit" value="Submit Form">

<!-- custom submit button -->
<button type="submit">Submit Form</button>

<!-- image button -->
<input type="image" src="graphic.gif">
```
If a form has one of these three types of button, and being focused, you can press Enter to submit it.

`submit` event will be fired right before the request sent to the server.

`submit()`, method on a HTMLFormElement, could cause form being submitted, and if this is the way of submiting, `submit` event will not trigger.

You can use `event.preventDefault()` to prevent submitting within `submit` event.

### Resetting Forms
Form can be reset by reset button:
```html
<!-- generic reset button -->
<input type="reset" value="Reset Form">

<!-- custom reset button -->
<button type="reset">Reset Form</button>
```
Pressing the reset button cause form being reset, `reset` event fires before this.

Form can also be reset by `reset()` method, both way will trigger `reset` event.

### Form Fields
`form.elements` is the collection of form elements, which includes `<input>`, `<textarea>`, `<button>`, `<select>`, and `<fieldset>`. The collection is an ordered list and each element could be referenced by their index and name. The order of that list consistent with appearance order on the markup.
```js
let form = doucment.getElementById("form1"):

let field1 = form.elements[0];

let field2 = form.elements["textbox1"];

let fieldcounts = form.elements.length;
```
```html
<form method="post" id="myForm">
  <ul>
    <li><input type="radio" name="color" value="red">Red</li>
    <li><input type="radio" name="color" value="green">Green</li>
    <li><input type="radio" name="color" value="blue">Blue</li>
  </ul>
</form>
<script>
  let form = document.getElementById("myForm");

  let colorFields = document.elements["color"]
  console.log(colorFields.length);//3

  let firstColorField = colorField[0];
  let firstFormField = form.elements[0];
  console.log(firstColorField === firstFormField);//true
</script>
```

### Common Form-Field Properties
Following properties are commmon except for `<fieldset>`:
- disabled, 
- form, reference to the form the field belongs to
- name, 
- readOnly
- tabIndex
- type
- value

```js
let form = document.getElementById("myForm");
let field = form.elements[0];

field.value = "changed value";
field.focus();
field.disabled = true;

field.type = "checkbox"; // Possible to do this, but NOT recommanded
```

The most usecase of these is the `disabled` property. We can use this to prevent duplicate submit request when user try to process payment.
```js
let form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
  let target = event.target;

  let btn = target.elements["submit-btn"];

  btn.disabled = true;
});
```
Table of `type` property value
|description|HTML markup|value of type|
|-|-|-|
|Single-select list|`<select></select>`|select-one|
|Multi-select list|`<select multiple></select>`|select-multiple|
|Custom button|`<button></button>`|submit|
|Custom nonsubmit button|`<button type="button"></button>`|button|
|Custom reset button|`<button type="reset"></button>`|reset|
|Custom submit button|`<button type="submit"></button>`|submit|

### Common Form-Field Methods
- `focus()`, use to activate field element, or we can use `autofocus` attribute.
```js
//sample of using autofocus and focus to make first element focused automatically
window.addEventListener("load", (event) =>{
  let element = document.form[0].elements[0];

  if(element.autofocus !== true){
    element.focus();
  }
});

```

> Be default, only form element can be focused by calling `focus()`, but if you set `tabIndex = -1` and any type element could be focused by this way.

- `blur()`

### Common Form-Field Events
- blur, fires when field lost focus
- change, fiires when field lost focus and the value is updated for `<input>`, and `<textarea>`. Also fires when selected option is changed for `<select>` elements
- focus, fires when gets focus

## SCRIPTING TEXT BOXES
There are two types of element that can be used as text input UI:
1. `<input type="text">` for single line
2. `<textarea>` for multiple lines

`<input>` has following attributes:
- size, specify how wide hte text box in terms of visible characters
- value, initial value
- maxlength, specifies the maximum number of characters allowed

`<textarea>` has following attributes:
- row, height of the text box in number of characters
- cols, width in number of characters
> be noted that initial value of `<textarea>` must be enclosed within the textarea open and closing tags.
> be noted, DOM methods such as `setAttribute()` to set the value attribute on element is NOT recommanded, instead just use value property.

### Text Selection
Both text input elements supports `select()` method, which will trigger focus event and select all the text.

Following snippet select all the text when element get focused.
```js
textbox.addEventListener("focus", (event) => {
  event.target.select();
});
```

#### The `selct` Event
This event fires when element calls `select()` method

#### Retrieve Selected Text
Using properties of `selectionstart` and `selectionend`

```js
function getSelectedText(textbox){
  return textbox.value.substring(textbox.selectionstart, textbox.selectionend);
}
```

### Partial Text Selection
using `setSelectionRange()` method with 0 based indexes
```js
textbox.value = "Hello world!";

textbox.setSelectionRange(0, textbox.value.length); //Hello World!

textbox.setSelectionRange(0, 3); //Hel

textbox.setSelectionRange(4, 7); //o w
```
> be noted, you need to set focus to the text box either before or after a call to `setSelectionRange` to see the selected effect.
> autocomplete is implemented by this 

### Input Filtering
#### Blocking Characters
Use `keypress` event with regex to prevent nonnumeric character inputs:
```js
textbox.addEventListener("keypress", (event) => {
  if(!/\d/.text(String.fromCharCode(event.charCode)) && event.charCode > 9){
    event.preventDefault();
  }
  // charCode > 9 must not be numeric characters
});
```

#### Dealing with the Clipboard
HTML 5 has following clipboard events:
- beforecopy, fires before the copy operation 
- copy, fires when copy operation takes place
- beforecut, 
- cut
- beforepaste,
- past

`beforecopy`, `beforecut`, and `beforepaste` only fires when context menu for text box is displayed.

Other events fires whenever it's operated through context menu or keyboard shortcut.

Use `clipboardData` Object within clipboard events to access data.

There are 3 methods wrapped within this object:
1. `getData()`, accept one argument, eg. "text/plain", to specify data type.
2. `setData()`, accept two arguments, `event.clipboardData.setData("text/plain", "foo")`
3. `clearData()`

### HTML5 Constraint Validation API
Event JS is not available, form's field elements still can provide validations if you put the right code to the markup.

eg. attribute of `required`, which is available for `<input>` `<textarea>` and `<select>`

#### Alternate Input Types
> TODO

## SCRIPTING SELECT BOXES