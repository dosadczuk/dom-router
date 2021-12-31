# DOM Router (WiP)

Very basic, zero configuration router for single HTML file applications.

To start using router, just put `script` tag in the HTML file:

```html
<!-- in the body -->
<body>
    ...
    <script src="path_to_dom-router_file.js"></script>    
</body>

<!-- OR in the head with `defer` attribute -->
<head>
    ...
    <script defer src="path_to_dom-router_file.js"></script>
    ...
</head>
```

## Directives

### `data-router`

To initialize router, add `data-router` attribute to `html` tag:

```html
<html lang="en" data-router>
    ...
</html>
```

### `data-router-page`

To create a page, add `data-router-page` attribute to an element:

```html
<section data-router-page="/page-1">
    ...
</section>
```

### `data-router-link`

To navigate to a page, add `data-router-link` attribute to an element:

```html
<!-- using anchor -->
<a data-router-link href="/page-1">
    ...
</a>

<!-- using any other tag, e.g. button -->
<button data-router-link="/page-1">
    ...
</button>
```

On `<a>` element, there is no need to set value for `data-router-link` attribute. It can (or even should) 
be provided using `href` attribute. If both `href` and `data-router-link` values are provided,
`href` has higher priority.

### `data-router-title`

To set a different `<title>` value, add `data-router-title` attribute to an element with `data-router-page`
directive.

```html
<section data-router-page="/page-1" data-router-title="Sample title to page 1">
    ...
</section>
```

To use title template, add `data-router-title` attribute to `<html>` element:
```html
<html lang="en" data-router data-router-title="{title} | DOM Router">
    ...
</html>
```

It is needed to use `{title}` to mark where to put a page title.

### `data-router-cloak`

To avoid blinking effect at the very first page load, add `data-router-cloak` attribute
to every single element with `data-router-page` directive.

```html
<section data-router-cloak data-router-page="/page-1">
    ...
</section>
```

And some CSS to hide every single page before init:
```css
[data-router-cloak] {
    display: none !important;
}
```
