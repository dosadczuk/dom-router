import { isEmptyString, isHTMLAnchorElement } from '@router/asserts'
import type { ElementWithDirectives } from '@router/directives'
import { Directive } from '@router/directives'
import type { Nullable } from '@router/types'

// -----------------------------------------------------------------------------
// -- Definition
// -----------------------------------------------------------------------------

const LinkRegistry = new Map<string, ElementWithDirectives>()

/**
 * Returns links for routes.
 */
export const getRouteToLink = (elements: ElementWithDirectives[]): RouteToLink => {
  if (LinkRegistry.size > 0) {
    return LinkRegistry // already created
  }

  for (const element of elements) {
    const route = getRouteFromLink(element)
    if (isEmptyString(route)) {
      continue // invalid link
    }

    LinkRegistry.set(route, element)
  }

  return LinkRegistry
}

const getRouteFromLink = (element: ElementWithDirectives): Nullable<string> => {
  const { element: link, directives } = element

  if (isHTMLAnchorElement(link) && !isEmptyString(link.href)) {
    return link.pathname
  }

  return directives.get(Directive.Link) ?? null
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

type RouteToLink = Map<string, ElementWithDirectives>
