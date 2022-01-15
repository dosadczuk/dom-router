import { defineDirective } from '@router/directives'
import { getHTMLElementsWithDirective, removeDirectiveFromHTMLElements } from '@router/dom'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-cloak
 *
 * Description:
 *  Prevents blinking effect on the very first page load. By default, every page is visible.
 *  The directive can be used to hide them all, prepare and show the only one which matches url.
 *
 * Usage:
 *  HTML file:
 *    <section data-router-cloak data-router-page="/page">
 *      ...
 *    </section>
 *
 *  CSS file:
 *    [data-router-cloak] {
 *      display: none !important;
 *    }
 */
defineDirective(Directive.Cloak, (elements) => {
  const elementsWithCloak = getHTMLElementsWithDirective(elements, Directive.Cloak)
  if (elementsWithCloak.length === 0) {
    return
  }

  removeDirectiveFromHTMLElements(elementsWithCloak, Directive.Cloak)
})
