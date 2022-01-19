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

Directives are HTML attributes and provide router functionality in simple and self-descriptive way. Directives start
with `data-router` and are _W3C Validation Service_ friendly.

### `data-router`

Main directive, enables and configures router. Without the directive, router will not work.

```html

<html lang="en" data-router>
  ...
</html>
```

Router provides two methods to toggle pages visibility:

1. **display** - using CSS `display` property (default)
2. **template** - using HTML `<template>` tag

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

Marks HTML tag as page. Value of the directive must be a valid path name or pattern. It will be converted into regular
expression and matched with current url. Result of matching will determine if page can be visible or not.

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

### `data-router-page-fallback`

Marks page to be a fallback when no page is matching URL.

```html
<!-- path name and fallback -->
<section data-router-page="/404" data-router-page-fallback>
  <!-- page content -->
</section>
```

### `data-router-link`

Marks HTML tag as link to a page. It should be an anchor, but can be any other valid HTML element. Directive **does
not** require value for `<a>` tag if
`href` attribute is present. In any other case, value is required. If link is an anchor and has both _href_ and _
directive value_ - _href_ has higher priority.

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

### `data-router-link-active`

Adds additional class to a link when current page matches it. Directive value is a class name, which will be added to a
link. If directive exists on an element but value is empty - default 'active' class will be used.

The directive works only with `data-router-link`. Otherwise, it is ignored.

```html
<!-- default 'active' class will be used -->
<a data-router-link href="/path" data-router-link-active>
  ...
</a>

<!-- 'my-special-class' will be used as class name -->
<a data-router-link href="/path" data-router-link-active="my-special-class">
  ...
</a>
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

### `data-router-sitemap`

Marks HTML tag as sitemap placeholder. Sitemap is generated automatically and consists of `<ol>` and `<li>` tags.

Element (page) will be included in sitemap if:
  - has `data-router-page` directive
  - has `data-router-title` directive

```html
<section data-router-page="/sitemap">
  <div data-router-sitemap>
    <!-- sitemap will be generated here -->
  </div>
</section>
```

Directive will not be removed, so sitemap can be styled easily with CSS:

```css
[data-router-sitemap] ol {
  /* list styles goes here */
}

[data-router-sitemap] ol li {
  /* list item styles goes here */
}
```

### `data-router-sitemap-ignore`

Marks page to be excluded from sitemap.

```html
<section data-router-page="/page" data-router-sitemap-ignore>
  <!-- page content -->
</section>
```

### `data-router-cloak`

Prevents blinking effect on the very first page load. By default, every page is visible. The directive can be used to
hide them, prepare and show the only one which matches url.

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
