import { Directive, setUpDirectives } from '@router/directives'
import '@router/directives/index'

(() => {
  const canInitialize = document.documentElement.hasAttribute(Directive.Init)
  if (!canInitialize) {
    return console.warn(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`)
  }

  setUpDirectives([
    Directive.Cloak,
    Directive.Title,
    Directive.Page,
    Directive.Link,
    Directive.LinkActive,
    Directive.Init
  ])
})()
