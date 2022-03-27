import { defineDirective, Directive } from '@router/directives'

defineDirective(Directive.PageFallback, {
  factory: null,
  options: {
    removable: true,
  },
})
