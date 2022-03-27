import { isEmptyString } from '@router/asserts'
import type { ElementWithDirectives } from '@router/directives'
import { defineDirective, Directive } from '@router/directives'
import type { ToggleElementVisibility } from '@router/dom'
import { getElementWithDirective } from '@router/dom'
import { dispatchTo, ExternalEvent, InternalEvent, subscribe } from '@router/events'
import type { Nullable } from '@router/types'
import { isMatchingURL } from '@router/url'

defineDirective(Directive.Page, {
  factory: (elements, elementsWithPage) => {
    const pages = getRoutePages(elements)
    if (pages.size === 0) {
      return // no pages
    }

    const fallback = getElementWithDirective(elementsWithPage, Directive.PageFallback)

    subscribe(InternalEvent.ViewChange, (toggleElementVisibility: ToggleElementVisibility) => {
      const payload = {
        route: null as Nullable<string>,
        element: null as Nullable<Element>,
      }

      // let client subscribe to event "before-view-update"
      dispatchTo(document, ExternalEvent.BeforeViewUpdate, payload)

      // change pages visibility
      for (const [ route, page ] of pages) {
        if (toggleElementVisibility(page, isMatchingURL(route))) {
          payload.route = route
          payload.element = page.element
        }
      }

      // if page is not found, show fallback (if exists)
      if (payload.element == null && fallback != null) {
        if (toggleElementVisibility(fallback, true)) {
          payload.element = fallback.element
        }
      }

      // let client subscribe to event "view-updated"
      dispatchTo(document, ExternalEvent.ViewUpdated, payload)
    })
  },
  options: {
    removable: true,
  },
})

/**
 * Get all pages with their routes.
 */
const getRoutePages = (elements: ElementWithDirectives[]): Map<string, ElementWithDirectives> => {
  const pages = new Map<string, ElementWithDirectives>()

  for (const element of elements) {
    const route = element.directives.get(Directive.Page)
    if (isEmptyString(route)) {
      continue // // nowhere to go
    }

    pages.set(route, element)
  }

  return pages
}
