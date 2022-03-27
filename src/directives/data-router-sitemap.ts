import { isEmptyString } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getRouteToPage } from '@router/directives/data-router-page.model'
import { getElementWithDirective } from '@router/dom'

defineDirective(Directive.Sitemap, {
  factory: (elements) => {
    const sitemap = getElementWithDirective(elements, Directive.Sitemap)
    if (sitemap == null) {
      return // sitemap not needed
    }

    const routeToPage = getRouteToPage(elements)
    if (routeToPage.size === 0) {
      return // no page found
    }

    const list = document.createElement('ol')

    for (const [ route, { directives } ] of routeToPage) {
      if (directives.has(Directive.SitemapIgnore)) {
        continue // page excluded from sitemap
      }

      const title = directives.get(Directive.Title)
      if (isEmptyString(title)) {
        continue // page has no title, so item cannot have a text
      }

      const link = document.createElement('a')
      link.href = route
      link.text = title

      const item = document.createElement('li')
      item.append(link)

      list.append(item)
    }

    sitemap.element.append(list)
  },
  options: {
    removable: false,
  },
})
