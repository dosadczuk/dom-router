import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, toggleDisplayElement, toggleTemplateElement } from '@router/dom'
import { dispatchToElement, ExternalEvent, InternalEvent, subscribe } from '@router/events'
import { Mode } from '@router/mode'
import { getCurrentURL, isMatchingURL } from '@router/url'
import { isEmpty } from "@router/asserts";

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
setDirective(Directive.Page, () => {
  const elementsWithPage = getHTMLElementsWithDirective(Directive.Page)
  if (elementsWithPage.length === 0) {
    return
  }

  subscribe(InternalEvent.ViewChange, (mode: string) => {
    const url = getCurrentURL()

    for (const element of elementsWithPage) {
      const route = element.directives.get(Directive.Page)
      if (route == null || isEmpty(route)) {
        continue
      }

      const canBeVisible = isMatchingURL(route, url)

      switch (mode) {
        case Mode.Display:
          toggleDisplayElement(element, canBeVisible)
          break

        case Mode.Template:
          toggleTemplateElement(element, canBeVisible)
          break
      }
    }

    dispatchToElement(document, ExternalEvent.ViewChanged)
  })
})
