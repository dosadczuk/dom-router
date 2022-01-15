import { isEmptyString, isHTMLAnchorElement } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'
import { Directive, InternalEvent } from '@router/enums'
import { dispatch, prevented } from '@router/events'
import type { HTMLElementWithDirectives, Nullable } from '@router/types'

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
defineDirective(Directive.Link, (elements) => {
  const elementsWithLink = getHTMLElementsWithDirective(elements, Directive.Link)
  if (elementsWithLink.length === 0) {
    return
  }

  for (const link of elementsWithLink) {
    const route = getRouteFromLink(link)
    if (route == null) {
      continue
    }

    link.content.addEventListener('click', prevented(() => {
      dispatch(InternalEvent.PageChange, route)
    }))
  }
})

export const getRouteFromLink = ({ content: link, directives }: HTMLElementWithDirectives): Nullable<string> => {
  const route = directives.get(Directive.Link)
  if (!isEmptyString(route)) {
    return route
  }

  if (isHTMLAnchorElement(link)) {
    return link.pathname ?? null
  }

  return null
}
