import { setUpDirectives } from '@router/directives'
import '@router/directives/index'
import { getHTMLElementsWithAnyDirective } from '@router/dom'
import { Directive } from '@router/enums'

const Router = () => {
  const canInitialize = document.documentElement.hasAttribute(Directive.Init)
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`)
  }

  const elements = getHTMLElementsWithAnyDirective()
  if (elements.length === 0) {
    throw new Error(`Router cannot be initialized. No directive found.`)
  }

  setUpDirectives(elements, [
    Directive.Cloak,
    Directive.Title,
    Directive.Page,
    Directive.PageFallback,
    Directive.Sitemap,
    Directive.SitemapIgnore,
    Directive.Link,
    Directive.LinkActive,
    Directive.Init,
  ])
}

Router()
