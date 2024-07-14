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