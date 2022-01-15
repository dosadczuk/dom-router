import { setUpDirectives } from '@router/directives'
import '@router/directives/index'
import { Directive } from '@router/enums'

const Router = () => {
  const canInitialize = document.documentElement.hasAttribute(Directive.Init)
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`)
  }

  setUpDirectives([
    Directive.Cloak,
    Directive.Title,
    Directive.Page,
    Directive.Link,
    Directive.LinkActive,
    Directive.Init,
  ])
}

Router()
