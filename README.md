# DOM Router

Very basic, zero configuration router for single HTML file websites.

## Usage

```html
<!-- Add <script> tag at the end of the <body> ... -->
<body>
  <script src="path_to_dom-router.js"></script>
</body>

<!-- ... OR in the <head> -->
<head>
  <script src="path_to_dom-router.js" defer></script>
</head>
```

## Directives

Directives are HTML attributes and provide functionality in simple and self-descriptive way. Directives start
with `data-router` and are _W3C Validation Service_ friendly.

### data-router

Main directive, enables and configures router. Without the directive, router will not work.

```html
<!-- activate router -->
<html data-router></html>
```

Router provides two methods to toggle pages visibility:

1. _display_ - uses CSS `display` property, toggles between `none` and `revert` value (default),
2. _template_ - uses HTML `<template>` tag to hide elements.

```html
<!-- set "display" mode -->
<html data-router="display"></html>

<!-- set "template" mode -->
<html data-router="template"></html>
```

### data-router-page

Marks HTML tag as a page. Value of the directive must be a valid pathname or pattern, which will be converted to regular
expression. Algorithm is trying to find a page with pattern matching current URL, result will determine if page can be
visible or not.

```html
<!-- page definition -->
<section data-router-page="/sample-route">
  <!-- page content -->
</section>
```

There are a few valid patterns, e.g.:

* static: `/users`, `/books`, `/books/titles`
* with parameter: `/users/:id`, `/books/:genre/:title`
* with parameter (suffix): `/videos/:id.mov`, `/images/:id.(jpeg|png)`
* with parameter (optional): `/users/:name?`, `/books/:genre?`
* with wildcards: `/users/*`, `/books/:genre/*`

### data-router-page-fallback

Marks a page as `404 Not Found`. When no page is matching current URL, page with this directive will be shown instead.
Website can have only one fallback page. If there are many of them, the first one will be chosen.

```html
<!-- fallback page definition -->
<section data-router-page="/404" data-router-page-fallback>
  <!-- page content -->
</section>
```

### data-router-link

Marks HTML tag as a link to a page. It should be an anchor, but any tag can be used.

Directive value is not required for an anchor, value of `href` will be used instead.

```html
<!-- link to page using anchor tag -->
<a data-router-link href="/sample-route"></a>
```

For any other tag, directive value is required, otherwise tag will not be a valid link.

```html
<!-- link to page using any other tag -->
<button data-router-link="/sample-route"></button>
```

### data-router-link-active

Adds a class to a link, if current URL matches it. Directive value is a class name which will be used. If not provided,
default `active` will be used instead.

The directive works only with `data-router-link`.

```html
<!-- 'active' class name will be used -->
<a data-router-link href="/sample-route" data-router-link-active></a>

<!-- 'special-class-name' class name will be used -->
<a data-router-link href="/sample-route" data-router-link-active="special-class-name"></a>
```

### data-router-title

Provides a way to set different document title for every page. It can be used in two ways:

1. as a page title, it works only with `data-router-page` directive,

```html
<!-- set page title -->
<section data-router-page="/sample-route" data-router-title="Sample page title">
  <!-- page content -->
</section>
```

2. as a title template, it works only on `<html>` tag and `{{title}}` can be used to mark a place where page title will
   be put.

```html
<!-- set template title -->
<html data-router data-router-title="{{title}} | Sample website""></html>
```

### data-router-title-default

Provides a way to set default document title. If page has no title - value of this directive will be used instead. The
directive can only be used on `<html>` tag.

```html
<!-- set default title -->
<html data-router data-router-title-default="Default page title"></html>
```

### data-router-sitemap

Marks a tag as sitemap placeholder. Sitemap is generated automatically, based of registered pages, and consist of `ul`
and `li` tags.

Element (page) will be included in sitemap only if:

* has `data-router-page` directive,
* has `data-router-title` directive

```html
<!-- create page with sitemap -->
<section data-router-page="/sitemap">
  <div data-router-sitemap>
    <!-- sitemap will be generated here -->
  </div>
</section>
```

Directive will not be removed, so it can be styled easily with CSS:

```css
[data-router-sitemap] ol {
    /* list styles goes here */
}

[data-router-sitemap] ol li {
    /* list item styles goes here */
}
```

### data-router-sitemap-ignore

Marks a page to be excluded from sitemap. It works only with `data-router-page` directive.

```html
<!-- exclude page from sitemap -->
<section data-router-page="/sample-route" data-router-sitemap-ignore>
  <!-- page content -->
</section>
```

### data-router-cloak

Prevents from pages blinking effect on the very first website load. By default, every page is visible and will hide if
current URL is not matching page's pattern. The directive can be used to hide every single page and show only the
matching one.

HTML file:

```html
<!-- hide page by default -->
<section data-router-cloak data-router-page="/sample-route">
  <!-- page content -->
</section>
```

CSS file:

```css
[data-router-cloak] {
    display: none !important;
}
```

## Events

Router emits the events, so client can subscribe to state changes.

### router:before-mount

Event is emitted just before router initialization. It does not contain any payload.

```typescript
document.addEventListener('router:before-mount', (event: CustomEvent) => {
  // do something  
})
```

### router:mounted

Event is emitted just after router initialization. It does not contain any payload.

```typescript
document.addEventListener('router:mounted', (event: CustomEvent) => {
  // do something
})
```

### router:before-page-update

Event is emitted before URL change. It does not contain any payload.

```typescript
document.addEventListener('router:before-page-update', (event: CustomEvent) => {
  // do something  
})
```

### router:page-updated

Event is emitted after URL change. It contains current route (`string`) as payload.

```typescript
document.addEventListener('router:page-updated', (event: CustomEvent) => {
  const { detail: route } = event

  // do something with route  
})
```

### router:before-view-update

Event is emitted before view change. It does not contain any payload.

```typescript
document.addEventListener('router:before-view-update', (event: CustomEvent) => {
  // do something
})
```

### router:view-updated

Event is emitted after view change. It contains current route (`string`) and element (`HTMLElement`) as payload.

```typescript
document.addEventListener('router:view-updated', (event: CustomEvent) => {
  const { detail: { route, element } } = event

  // do something with route and element
})
```
