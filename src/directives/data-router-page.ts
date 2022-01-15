import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { getHTMLElementsWithDirective, toggleDisplayElement, toggleTemplateElement } from '@router/dom'
import { Directive, ExternalEvent, InternalEvent, Mode } from '@router/enums'
import { dispatchToElement, subscribe } from '@router/events'
import { getCurrentURL, isMatchingURL } from '@router/url'

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

  subscribe(InternalEvent.ViewChange, (mode: string) => {
    const url = getCurrentURL()

    for (const page of elementsWithPage) {
      const route = page.directives.get(Directive.Page)
      if (isEmptyString(route)) {
        continue
      }

      switch (mode) {
        case Mode.Display:
          toggleDisplayElement(page, isMatchingURL(route, url))
          break

        case Mode.Template:
          toggleTemplateElement(page, isMatchingURL(route, url))
          break
      }
    }

    dispatchToElement(document, ExternalEvent.ViewChanged)
  })
})
