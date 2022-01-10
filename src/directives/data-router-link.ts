import { isEmpty, isHTMLAnchorElement } from '@router/asserts'
import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'
import { dispatch, InternalEvent } from '@router/events'

/**
 * Directive:   data-router-link
 *
 * Description:
 *  Marks HTML tag as link to a page. It should be an anchor, but can be any other valid
 *  HTML element. Directive does not require value for <a> tag if href attribute is present.
 *  In any other case, value is required. If link is an anchor and has both href and directive
 *  value - href has higher priority.
 *
 * Values:
 *  - page path name
 *
 * Usage:
 *  On <a> element:
 *    <a data-router-link href="/page">
 *      ...
 *    </a>
 *
 *  On other element:
 *    <button data-router-link="/page" type="button">
 *      ...
 *    </button>
 */
setDirective(Directive.Link, () => {
  const elementsWithLink = getHTMLElementsWithDirective(Directive.Link)
  if (elementsWithLink.length === 0) {
    return
  }

  for (const { content: link, directives } of elementsWithLink) {
    let route = directives.get(Directive.Link)

    // if empty, maybe it's an anchor
    if (isEmpty(route) && isHTMLAnchorElement(link)) {
      route = link.href
    }

    // if empty, no way to determine route
    if (route == null) {
      continue;
    }

    link.addEventListener('click', event => {
      event.preventDefault()

      dispatch(InternalEvent.PageChange, route)
    })
  }
})
