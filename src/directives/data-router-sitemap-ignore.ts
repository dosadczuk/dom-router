import { defineDirective, Directive } from '@router/directives'

defineDirective(Directive.SitemapIgnore, {
  options: { removable: true },
})
