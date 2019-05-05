# Responsive Full Page Scroll

This library provides a full page slideshow that can be activated and deactivated using a media query.

## Basic Usage

### 1) Add some Markup

There has to be one wrapper element and some child elements which are the slides. In the default configuration, the slides are `section` elements: 

```html
<div id="wrap">
    <section>one</section>
    <section>two</section>
    <section>three</section>
</div>
```

### 2) Add some CSS

The library adds `overflow` styles to youb body element and `transition` and `transform` to yout wrapper element. You need to take care of the rest yourself, e.g.:

```css
body {
    margin: 0;
}
#wrap {
    position: relative;
    overflow: hidden;
}
section {
    box-sizing: border-box;
    position: relative;
    height: 100vh;
    overflow: hidden;
    font-size: 10vmin;
    padding: 1em;
}
```

### 3) Initialize the script

Add `scroll.js` or `scroll.min.js` and call the constructor of `FullPageScroll` with an `HTMLElement` object or the ID of your wrapper element: 

```javascript
document.addEventListener("DOMContentLoaded", function() {
    var fps = new FullPageScroll('wrap');
});
```

For working examples, have a look at the **examples** folder.

## Adding a media query

In order to activate the functionality of the library only when certain conditions are met, just add a media query to the options object:

```javascript
document.addEventListener("DOMContentLoaded", function() {
    var fps = new FullPageScroll('wrap', {
			mediaQuery: 'screen and (min-width: 800px)',
    });
});
```

In this example, the script is only active, when the used device has a minimal width of 800px. It is automatically activated and deactivated when you resize the window (see `examples/example.html`).

## Options

The following parameters can be used in the options object:

### `transitionTime`

Time in miliseconds. Used for the transition from one slide to the next.

Default value: `1000` (1 second)

### `goToTopOnLast`

Boolean. Whether to scroll back up when scrolling down on the last slide.

Default value: `true`

### `mediaQuery`

Media query string. See ("Adding a media query")

Default value: `"screen"`

### `slideSelector`

Selector used for selecting the slide elements:

Default value: `"section"`

## Events

You can add event listeners to the `FullPageScroll` object:

```javascript
fps.onslide = function(e) {
    console.log("Slide "+(e.target.currentSlide+1)+" of "+e.target.slides.length);
}
```

You can also use `addEventListener` or `removeEventListener`:

```javascript
fps.addEventListener('slide', function(e) {
    console.log("Slide "+(e.target.currentSlide+1)+" of "+e.target.slides.length);
});
```

### `slide`

The `slide` event is fired when the user scrolls or swipes and a new slide is shown.

### `activate` / `deactivate`

The `activate` and `deactivate` events are useful in conjunction with the defined media query.


