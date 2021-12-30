import { Directive, runDirective } from '@router/directives'
import '@router/directives/index'

(() => {
  const canInitialize = document.documentElement.hasAttribute(Directive.Init)
  if (!canInitialize) {
    return console.warn(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`)
  }

  runDirective(Directive.Cloak)
  runDirective(Directive.Title)
  runDirective(Directive.Page)
  runDirective(Directive.Link)

  // Init at the end
  runDirective(Directive.Init)
})()
