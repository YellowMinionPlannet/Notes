# Physical
## Keyboard Testing with Tab
Focusable Elements by tab key
* Links
* Buttons
* Form elements
    * Text input
    * Text area
    * Select
    * Checkboxes
    * Radio Buttons

*Keyboard focus should always skip disabled Elements.*

## Testing with keyboards - focus indication
1. WCAG 2.4.1 bypass block, when you use tab key you need to skip the header/logo link/navigation links which are repetitive content that appears on every page.
2. WCAG 2.4.7 focus being visible, barely see actively focused elements is not acceptable.
3. WCAG 1.4.3 color contrast, when using actively focused elements the change of color should be in contrast ratio 3:1 for background and foreground color.
4. WCAG 1.4.1 use of color, Actively focused elements must include 2 properties changed(1 for color and one for other property), only color changed is not enough.
5. WCAG 2.4.7 focus visible, use console in web browser developer mode, and type `document.activeElement` to show which element is currently on focus. If you could not find any of them during the keyboard naviagation.
6. Developer also needs to keep focus indication in the same format.
7. Focus order should conform with the order of visual content.
8. No keyboard trap
9. Pointer cancellation

## Testing with keyboards - form elements
1. We need to skip disabled inputs, like disabled check boxes.
2. Radio buttons:
    * none of selected, you can tab into each of them
    * selection of radio buttons must be made by space key
    * once selection is made to one of them, arrow key performs the change of selection. and if you press tab key, focus should move out of the radio button group and focus on the next focusable element.
    * If shift + tab, focus should move from the next focusable element to the radio group again, and focus on the selected element. and shift + tab again, it should move to the previous focusable element and move out of the radio button group.
3. Select:
    * Use tab key to focus on select
    * When it is focused, use arrow keys to move among selectable items, but not to changed selected item by arrow key.
    * Enter key perform the selection on item and close the dropdown menu.
    * When it is focused, used space key to open the dropdown menu, but can't use space key to select items


## Widget Navigation
* Tab moves focus into group
    * first/last focusable or current selection
* Arrow keys to navigate in the group

## space vs. enter key
* space key activate form elements
* but enter key activate links

# Vision-related
Color blindness, macular degeneration, cataracts, glaucoma etc.
## Test of Zoom
1. zoom to 400%, the site needs to be able to zoom
2. Content needs to be accessible 
3. Image needs to be responsible
4. User do not need to horizontally scroll
5. Content should be stacked in one column layout
6. When the menu shows, it should not be blocked or hidden partially

## Test of Text
WCAG 1.4.4 Resize Text, 
1. able to resize the text to 200%
2. Probably ignored by now

## Text Spacing
1. Line height 1.5 times font size
2. Spacing after paragraphs 2 times the font size
3. Letter spacing is .12 times the font size
4. Word spacing is .16 times the font size

## Using color effectively
1. WCAG 1.4.1 
2. Chrome F12, More tools => render => Emulate vision deficiencies 
3. So different color blindness people can't differentiate if you use only color to show context of difference. For example, in form, red is for error, green is for pass.

## Contrast
WCAG 1.4.3 and 1.4.11
* 1.4.3 applies to text or image of text
* 1.4.11 non-text content
### 1.4.3
1. Contrast of text has to be 4.5:1
2. Firefox built-in tools to check, F12, color property on element will show the contrast ratio

### 1.4.11
1. Contrast of non-text has to be 3:1
2. Chrome color picker for color property in F12

## Content on Hover or Focus
1. tooltip must be able to show when focus and dimiss when blur, able to show when hover and dismiss when hover-off, to pass 2.1.1 for keyboard
2. Tooltip must be able to dismiss by ESC key for 1.4.13
3. Tooltip must be able to allow to copy the content for 1.4.13
4. 