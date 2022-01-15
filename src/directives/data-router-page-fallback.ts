import { defineDirective } from '@router/directives'
import { getHTMLElementsWithDirective, removeDirectiveFromHTMLElements } from '@router/dom'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-page-fallback
 *
 * Description:
 *  Marks page as fallback when no page is matching URL.
 *
 * Usage:
 *  <section data-router-page="/404" data-router-page-fallback>
 *    <!-- page content -->
 *  </section>
 */
defineDirective(Directive.PageFallback, (elements) => {
  const elementsWithFallback = getHTMLElementsWithDirective(elements, Directive.PageFallback)
  if (elementsWithFallback.length === 0) {
    return
  }

  removeDirectiveFromHTMLElements(elementsWithFallback, Directive.PageFallback)
})
