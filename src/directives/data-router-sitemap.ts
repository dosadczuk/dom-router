import { isEmptyString } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getElementsWithDirective, getElementWithDirective } from '@router/dom'

defineDirective(Directive.Sitemap, {
  factory: (elements) => {
    const elementWithSitemap = getElementWithDirective(elements, Directive.Sitemap)
    if (elementWithSitemap == null) {
      return // sitemap not needed
    }

    const elementsWithPage = getElementsWithDirective(elements, Directive.Page)
    if (elementsWithPage.length === 0) {
      return // no pages
    }

    const list = document.createElement('ol')

    for (const { directives } of elementsWithPage) {
      if (directives.has(Directive.SitemapIgnore)) {
        continue // excluded from sitemap
      }

      const route = directives.get(Directive.Page)
      const title = directives.get(Directive.Title)

      if (isEmptyString(route) || isEmptyString(title)) {
        continue // no way to determine link and text
      }

      const link = document.createElement('a')
      link.href = route
      link.text = title

      const item = document.createElement('li')
      item.append(link)

      list.append(item)
    }

    elementWithSitemap.element.append(list)
  },
  options: {
    removable: false,
  },
})
