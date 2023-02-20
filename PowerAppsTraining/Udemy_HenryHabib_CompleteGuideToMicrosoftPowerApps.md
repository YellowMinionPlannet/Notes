# Section 4: Beginner: Canvas Apps

## Introduction to galleries

In canvas apps, when you connect with data and generate apps automatically, Tree View on the left will give you three screens:

1. Browse Screen: Gallery element is in here, which is a list view of your data. It also allow user to refresh, sort and add data.
2. Detail Screen: Display element is in here, which is a detail view of your row. It allow user to click on delete and edit.
3. Edit Screen: Edit element is in here, which is a form of your row. It allow user to save edited data to the corresponding row.

## Forms and data cards

- When you open Detail screen, there will be list of data cards. Each data card represents a column of a row of data, where key is the actual column name and value is the value.

- Detail form has a property called _fields_. You can click on Edit Fields to manage columns in detail form.

- For each field, you can change the control type to View phone, View text etc.

- For each card's label, you can change the text by using DataCardKey's Text property. Or go to the parent's Display Name property and update it.

- If data card is locked, go to advanced and unlock the data card.

## Property assignment

- Use `Text(ThisItem.DateJoined, "mm/dd/yyyy")` to change the format of Parent Default property to format the text's format.

- Use variables to update detail form title's text to `Concat(FirstName_DataCard1.Default, " ", LastName_DataCard1.Default`.

## Edit forms, updates, textboxes

- Use Edit fields to move inputs into customized order.

- Update property of each datacard will define which value would be updated to the datasource.

- We can unlock datacard and also delete them with ... button on the left.

- We can unlock datacard and go to advanced and change display mode property in to View.

## Triggers

- Just like classes have properties and methods, elements in Power Apps have Properties and Triggers.
- Triggers are element's properties with name started with "On".

## Introduction to functions and formulas

> See official documentation Formula Reference for Power Apps.

## Introduction to navigation

When you add icon, make sure you select gallery element, so that the icon will be replicated in each element.

## Error checking

At the right top corner of the screen there's a diagnostic icon, you can use that to do error checking.

# Section 5: Intermediate: Canvas Apps

## Contexual variables/Global variables/Collections

Contexual variables is variable to the current screen, global variables can be shared among screens. Collections is close to the datasource, user can modify its items instead of set it as a whole.

## Creating the New Form screen

NewForm Function will make specific form a new form.

`NewForm(Form2); Navigate(EditScreen)`

EditForm Function will make specific form a edit form.
`EditForm(Form2); Nagigate(EditScreen)`

# Section 6: Expert: Canvas Apps

## Cascading dropdown 1

Change dropdown "Item" property to the table, and you can use formulas to customize the values. For example,
`SortByColumn(Distinct(Table1, Location), "Result")` will sort the result of Table1's distinct location.

## Delete Button

`Remove(Table1, Gallery.Selected)`
