import { defineDirective } from '@router/directives'
import { getHTMLElementsWithDirective, removeDirectiveFromHTMLElements } from '@router/dom'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-sitemap-ignore
 *
 * Description:
 *  Marks page to be excluded from sitemap.
 *
 * Usage:
 *  <section data-router-page="/page" data-router-sitemap-ignore>
 *    <!-- page content -->
 *  </section>
 */
defineDirective(Directive.SitemapIgnore, (elements) => {
  const elementsWithSitemapIgnore = getHTMLElementsWithDirective(elements, Directive.SitemapIgnore)
  if (elementsWithSitemapIgnore.length === 0) {
    return
  }

  removeDirectiveFromHTMLElements(elementsWithSitemapIgnore, Directive.SitemapIgnore)
})
