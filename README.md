# DOM Router (WiP)

Very basic, zero configuration router for single HTML file websites.

## Usage

```html
<!-- Add <script> tag at the end of the <body> ... -->
<body>
    ...
    <script src="path_to_dom-router.js"></script>
</body>

<!-- ... OR in the <head> -->
<head>
    <script defer src="path_to_dom-router.js"></script>
</head>
```

## Directives

Directives are HTML attributes and provide router functionality in simple and
self-descriptive way. Directives start with `data-router` and are _W3C
Validation Service_ friendly.

### `data-router`
Main directive, enables and configures router. Without the directive, router
will not work.

```html
<html lang="en" data-router>
    ...
</html>
```

Router provides two methods to toggle pages visibility:
1. **display** - using CSS `display` property (default)
2. **template** - using HTML `<temlate>` tag

You can set it by yourself using the directive:
```html
<!-- Set "display" mode -->
<html lang="en" data-router="display">
    ...
</html>

<!-- Set "template" mode -->
<html lang="en" data-router="template">
    ...
</html>
```

### `data-router-page`

Marks HTML tag as page. Value of the directive must be a valid path name or
pattern. It will be converted into regular expression and matched with current
url. Result of matching will determine if page can be visible or not. 

There are a few valid path patterns:
* static: `/users`, `/books`, `/books/titles`
* with parameter: `/users/:id`, `/books/:genre/:title`
* with parameter (suffix): `/videos/:id.mov`, `/images/:id.(jpeg|png)`
* with parameter (optional): `/users/:name?`, `/books/:genre?`
* with wildcards: `/users/*`, `/books/:genre/*`

```html
<!-- basic path name -->
<section data-router-page="/page">
    <!-- page content -->
</section>
```

### `data-router-link`

Marks HTML tag as link to a page. It should be an anchor, but can be any other
valid HTML element. Directive **does not** require value for `<a>` tag if 
`href` attribute is present. In any other case, value is required. If link
is an anchor and has both _href_ and _directive value_ - _href_ has higher 
priority.

```html
<!-- on an anchor -->
<a data-router-link href="/page">
    ...
</a>

<!-- on any other element -->
<button data-router-link="/page" type="button">
    ...
</button>
```

### `data-router-title`

Provides a way to change page title. It can be used in two ways:
1. on `<html>` tag - creates title template, `{title}` is the place where page title will be put
2. on element with `data-router-page` directive - creates title for the page

```html
<!-- create template for page title -->
<html lang="en" data-router data-router-title="{title} | Sample website">
    ...
</html>

<!-- create title for page -->
<section data-router-page="/page" data-router-title="Sample page">
    ...    
</section>
```

### `data-router-cloak`

Prevents blinking effect on the very first page load. By default, every page
is visible. The directive can be used to hide them, prepare and show the only
one which matches url.

HTML file:
```html
<!-- mark page to be hidden -->
<section data-router-cloak data-router-page="/page">
    ...
</section>
```

CSS file:
```css
/* hide the pages */
[data-router-cloak] {
    display: none !important;
}
```
