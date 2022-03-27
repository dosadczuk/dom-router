import { isEmptyString, isHTMLAnchorElement } from '@router/asserts.old'
import { defineDirective } from '@router/directives.old'
import { Directive, InternalEvent } from '@router/enums'
import { dispatch, prevented } from '@router/events.old'
import type { ElementWithDirectives, Nullable } from '@router/types'

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
defineDirective(Directive.Link, {
  factory: (_, elementsWithLink) => {
    for (const link of elementsWithLink) {
      const route = getRouteFromLink(link)
      if (isEmptyString(route)) {
        continue
      }

      link.content.addEventListener('click', prevented(() => {
        dispatch(InternalEvent.PageChange, route)
      }))
    }
  },
  options: {
    removable: true,
  },
})

export const getRouteFromLink = ({ content: link, directives }: ElementWithDirectives): Nullable<string> => {
  const route = directives.get(Directive.Link)
  if (!isEmptyString(route)) {
    return route
  }

  if (isHTMLAnchorElement(link)) {
    return link.pathname ?? null
  }

  return null
}
