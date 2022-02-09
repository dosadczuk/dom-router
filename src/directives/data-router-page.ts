import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { getFirstElementWithDirective } from '@router/dom'
import { Directive, ExternalEvent, InternalEvent } from '@router/enums'
import { dispatchToElement, subscribe } from '@router/events'
import type { ElementWithDirectives, ToggleElementVisibility, ViewChangedPayload } from '@router/types'
import { isMatchingURL } from '@router/url'

/**
 * Directive:   data-router-page
 *
 * Description:
 *  Marks HTML tag as page. Value of the directive must be a valid path name or pattern.
 *  It will be converted into regular expression and matched with current url.
 *  Result of matching will determine if page can be visible or not.
 *
 *  There are a few valid path patterns:
 *    - static                    : /users, /books, /books/titles
 *    - with parameter            : /users/:id, /books/:genre/:title
 *    - with parameter (suffix)   : /videos/:id.mov, /images/:id.(jpeg|png)
 *    - with parameter(optional)  : /users/:name?, /books/:genre?
 *    - with wildcards            : /users/*, /books/:genre/*
 *
 * Values:
 *  - page path name
 *
 * Usage:
 *  <section data-router-page="/page">
 *    <!-- page content -->
 *  </section>
 */
defineDirective(Directive.Page, {
  factory: (_, elementsWithPage) => {
    const pages = mapRoutesWithPages(elementsWithPage)
    if (pages.size === 0) {
      return // no pages registered
    }

    const fallback = getFirstElementWithDirective(elementsWithPage, Directive.PageFallback)

    // update page visibility after firing up view change event
    subscribe(InternalEvent.ViewChange, (toggleElementVisibility: ToggleElementVisibility) => {
      const payload: ViewChangedPayload = {
        page: null,
        route: null,
      }

      for (const [ route, page ] of pages.entries()) {
        const isPageVisible = toggleElementVisibility(page, isMatchingURL(route))
        if (isPageVisible) {
          payload.page = page.content
          payload.route = route
        }
      }

      if (payload.page == null && fallback != null) {
        const isPageVisible = toggleElementVisibility(fallback, true)
        if (isPageVisible) {
          payload.page = fallback.content
        }
      }

      // let client subscribe to event "view-changed"
      dispatchToElement(document, ExternalEvent.ViewChanged, payload)
    })
  },
  options: {
    removable: true,
  },
})

const mapRoutesWithPages = (elements: ElementWithDirectives[]): Map<string, ElementWithDirectives> => {
  const pages = new Map<string, ElementWithDirectives>()

  for (const element of elements) {
    const route = element.directives.get(Directive.Page)
    if (isEmptyString(route)) {
      continue
    }

    pages.set(route, element)
  }

  return pages
}
