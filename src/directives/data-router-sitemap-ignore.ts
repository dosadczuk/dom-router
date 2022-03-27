import { defineDirective, Directive } from '@router/directives'

defineDirective(Directive.SitemapIgnore, {
  factory: null,
  options: {
    removable: true,
  },
})
