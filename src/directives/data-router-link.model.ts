import { isEmptyString, isHTMLAnchorElement } from '@router/asserts'
import type { ElementWithDirectives } from '@router/directives'
import { Directive } from '@router/directives'
import type { Optional } from '@router/types'

// -----------------------------------------------------------------------------
// -- Definition
// -----------------------------------------------------------------------------

const LinkRegistry = new Map<string, Set<ElementWithDirectives>>()

/**
 * Returns links for routes.
 */
export const getRouteToLinks = (elements: ElementWithDirectives[]): RouteToLink => {
  if (LinkRegistry.size > 0) {
    return LinkRegistry // already created
  }

  for (const element of elements) {
    const route = getRouteFromLink(element)
    if (isEmptyString(route)) {
      continue // not a link or invalid link
    }

    if (!LinkRegistry.has(route)) {
      LinkRegistry.set(route, new Set())
    }

    LinkRegistry.get(route)!.add(element)
  }

  return LinkRegistry
}

const getRouteFromLink = (element: ElementWithDirectives): Optional<string> => {
  const { element: link, directives } = element

  if (isHTMLAnchorElement(link) && !isEmptyString(link.href)) {
    return link.pathname
  }

  return directives.get(Directive.Link) ?? null
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

type RouteToLink = Map<string, Set<ElementWithDirectives>>
