import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'

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
setDirective(Directive.Cloak, () => {
  const elementsWithCloak = getHTMLElementsWithDirective(Directive.Cloak)
  if (elementsWithCloak.length === 0) {
    return
  }

  for (const element of elementsWithCloak) {
    element.content.removeAttribute(Directive.Cloak)
  }
})
