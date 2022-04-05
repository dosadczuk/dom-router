import { isEmptyString } from '@router/asserts'
import type { ElementWithDirectives } from '@router/directives'
import { Directive } from '@router/directives'

// -----------------------------------------------------------------------------
// -- Definition
// -----------------------------------------------------------------------------

const PageRegistry = new Map<string, ElementWithDirectives>()

/**
 * Returns pages for routes.
 */
export const getRouteToPage = (elements: ElementWithDirectives[]): RouteToPage => {
  if (PageRegistry.size > 0) {
    return PageRegistry // already created
  }

  for (const element of elements) {
    const route = element.directives.get(Directive.Page)
    if (isEmptyString(route)) {
      continue // not a page or invalid page
    }

    PageRegistry.set(route, element)
  }

  return PageRegistry
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

type RouteToPage = Map<string, ElementWithDirectives>
