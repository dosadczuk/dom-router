import { isEmptyString, isHTMLAnchorElement } from '@router/asserts'
import type { ElementWithDirectives } from '@router/directives'
import { defineDirective, Directive } from '@router/directives'
import { dispatch, InternalEvent, prevent } from '@router/events'
import type { Nullable } from '@router/types'

defineDirective(Directive.Link, {
  factory: (_, elementsWithLink) => {
    for (const link of elementsWithLink) {
      const route = getRoute(link)
      if (isEmptyString(route)) {
        continue // nowhere to go
      }

      link.element.addEventListener('click', prevent(() => {
        dispatch(InternalEvent.PageChange, route)
      }))
    }
  },
  options: {
    removable: true,
  },
})

/**
 * Returns the route for the given link (data-router-link).
 */
export const getRoute = (element: ElementWithDirectives): Nullable<string> => {
  const { element: link, directives } = element

  if (isHTMLAnchorElement(link) && !isEmptyString(link.href)) {
    return link.pathname
  }

  return directives.get(Directive.Link) ?? null
}
