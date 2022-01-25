import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { getFirstHTMLElementWithDirective } from '@router/dom'
import { Directive, ExternalEvent, InternalEvent } from '@router/enums'
import { dispatchToElement, subscribe } from '@router/events'
import type { ToggleElementVisibility } from '@router/types'
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
    const fallback = getFirstHTMLElementWithDirective(elementsWithPage, Directive.PageFallback)

    // update page visibility after firing up view change event
    subscribe(InternalEvent.ViewChange, (toggleElementVisibility: ToggleElementVisibility) => {
      let hasVisiblePage = false

      for (const page of elementsWithPage) {
        const route = page.directives.get(Directive.Page)
        if (isEmptyString(route)) {
          continue
        }

        const isPageVisible = toggleElementVisibility(page, isMatchingURL(route))

        hasVisiblePage ||= isPageVisible
      }

      if (!hasVisiblePage && fallback != null) {
        toggleElementVisibility(fallback, true)
      }

      dispatchToElement(document, ExternalEvent.ViewChanged)
    })
  },
  options: {
    removable: true,
  },
})
