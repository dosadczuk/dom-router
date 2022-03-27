import { defineDirective, Directive } from '@router/directives'
import { getRouteToPage } from '@router/directives/data-router-page.model'
import type { ToggleView } from '@router/dom'
import { getElementWithDirective } from '@router/dom'
import type { ViewUpdatedPayload } from '@router/events'
import { dispatchTo, ExternalEvent, InternalEvent, subscribe } from '@router/events'
import { isMatchingURL } from '@router/url'

defineDirective(Directive.Page, {
  factory: (elements) => {
    const routeToPage = getRouteToPage(elements)
    if (routeToPage.size === 0) {
      return // no page found
    }

    const fallback = getElementWithDirective(elements, Directive.PageFallback)

    subscribe(InternalEvent.ViewChange, (toggleView: ToggleView) => {
      const payload: ViewUpdatedPayload = { route: null, element: null }

      // let client subscribe to event "before-view-update"
      dispatchTo(document, ExternalEvent.BeforeViewUpdate)

      for (const [ route, page ] of routeToPage) {
        // find page with matching route and set it visible
        if (toggleView(page, isMatchingURL(route))) {
          payload.route = route
          payload.element = page.element
        }
      }

      if (payload.element == null && fallback != null) {
        // if page is not found, set fallback page visible
        if (toggleView(fallback, true)) {
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
