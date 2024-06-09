# about Box Model
## `box-sizing` property
it has two values:
- `content-box`
- `border-box`

## `height` property
- If we have `box-sizing: content-box`, which is default, we have height of content "real" height. That is the height of content only(without paddings and borders).
- If we have `box-sizing: border-box`, we have height of box-model excluding margin. That is content "real" height + paddings + borders.

# about differnt `height` properties
## Layout Viewport vs. Visual Viewport
- Layout Viewport: the browser's area that draws the web page.
- Visual Viewport: the visible part of browser's layout viewport.
eg. using mobile device, we can pinch to zoom in and zoom out. When we zomm in or zoom out, the layout viewport does not change, but the visual viewport changes accordingly.

## `height` properties
- `innerHeight`, which is a property of `window` object. It is the "layout viewport" of the browser. So if scroll bar is available, the scroll bar is included.

- `outerHeight`, which is a property of `window` object. It is the "layout viewport" plus the sidebar, menus, window chrome, and window resizing borders/handles.

- `scrollY`, which is a property of `window` object. It is the distance from the beginning of the web page, no matter it's out of current viewport or inside, to the top of the visible viewport. So we don't scroll, `scrollY` is 0.

- `scrollHeight`, which is a property of `element` obejct. It is the visible and unvisible total height of a element. `documentElement.scrollHeight` is usually larger than the `window.innerHeight` because you can scroll down. This value includes content "real" height and paddings. But it excludes borders, margins and scrollbars. It also includes pseudo-elements size.

- `clientHeight`, which is a property of `element` object. It is the content "real" height and the paddings. It excludes scroll bars.