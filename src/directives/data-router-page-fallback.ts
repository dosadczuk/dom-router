import { defineDirective, Directive } from '@router/directives'

defineDirective(Directive.PageFallback, {
  options: { removable: true },
})
