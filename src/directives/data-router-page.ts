import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import {
  getFirstHTMLElementsWithDirective,
  getHTMLElementsWithDirective,
  removeDirectiveFromHTMLElements,
} from '@router/dom'
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
defineDirective(Directive.Page, (elements) => {
  const elementsWithPage = getHTMLElementsWithDirective(elements, Directive.Page)
  if (elementsWithPage.length === 0) {
    return
  }

  const elementWithFallback = getFirstHTMLElementsWithDirective(elementsWithPage, Directive.PageFallback)

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

    if (!hasVisiblePage && elementWithFallback != null) {
      toggleElementVisibility(elementWithFallback, true)
    }

    dispatchToElement(document, ExternalEvent.ViewChanged)
  })

  removeDirectiveFromHTMLElements(elementsWithPage, Directive.Page)
})
