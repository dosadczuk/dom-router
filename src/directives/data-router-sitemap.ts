import { isEmptyString } from '@router/asserts.old'
import { defineDirective } from '@router/directives'
import { getFirstElementWithDirective, getElementsWithDirective } from '@router/dom'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-sitemap
 *
 * Description:
 *  Marks HTML tag as sitemap placeholder. Sitemap is generated automatically
 *  and consists of <ol> and <li> tags.
 *
 *  Element will be included in sitemap if:
 *    - has data-router-page directive
 *    - has data-router-title directive
 *
 *  Directive will not be removed, so sitemap can be styled easily with CSS.
 *
 * Usage:
 *  <section data-router-page="/sitemap">
 *    <div data-router-sitemap></div>
 *  </section>
 */
defineDirective(Directive.Sitemap, {
  factory: (elements) => {
    const elementWithSitemap = getFirstElementWithDirective(elements, Directive.Sitemap)
    if (elementWithSitemap == null) {
      return // sitemap not needed
    }

    const elementsWithPage = getElementsWithDirective(elements, Directive.Page)
    if (elementsWithPage.length === 0) {
      return // no pages - no sitemap
    }

    const list = document.createElement('ol')

    for (const { directives } of elementsWithPage) {
      if (directives.has(Directive.SitemapIgnore)) {
        continue // exclude from sitemap
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

    elementWithSitemap.content.append(list)
  },
  options: {
    removable: false,
  },
})
