import { setUpDirectives } from '@router/directives.old'
import '@router/directives/index'
import { getElementsWithAnyDirective, hasRootElementDirective } from '@router/dom.old'
import { Directive } from '@router/enums'

const Router = () => {
  const canInitialize = hasRootElementDirective(Directive.Init)
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`)
  }

  const elements = getElementsWithAnyDirective()
  if (elements.length === 0) {
    throw new Error(`Router cannot be initialized. No directive found.`)
  }

  setUpDirectives(elements, [
    Directive.Cloak,
    Directive.Title,
    Directive.TitleDefault,
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
