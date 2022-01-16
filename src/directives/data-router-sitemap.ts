import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { getFirstHTMLElementsWithDirective, getHTMLElementsWithDirective } from '@router/dom'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-sitemap
 *
 * Description:
 *
 *
 * Usage:
 *  <section data-router-page="/sitemap">
 *    <div data-router-sitemap></div>
 *  </section>
 */
defineDirective(Directive.Sitemap, (elements) => {
  const elementWithSitemap = getFirstHTMLElementsWithDirective(elements, Directive.Sitemap)
  if (elementWithSitemap == null) {
    return // sitemap not needed
  }

  const elementsWithPage = getHTMLElementsWithDirective(elements, Directive.Page)
  if (elementsWithPage.length === 0) {
    return // no pages - no sitemap
  }

  const list = document.createElement('ol')

  for (const { directives } of elementsWithPage) {
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

  elementWithSitemap.content.append(list)
})
