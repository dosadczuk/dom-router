import { defineDirective, Directive } from '@router/directives'

defineDirective(Directive.Cloak, {
  factory: null,
  options: {
    removable: true,
  },
})
