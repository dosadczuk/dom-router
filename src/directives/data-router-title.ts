import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import {
  getElementsWithDirective,
  getRootElementDirectives,
  removeDirectivesFromRootElement,
} from '@router/dom'
import { Directive, InternalEvent } from '@router/enums'
import { subscribe } from '@router/events.old'
import { isMatchingURL } from '@router/url'

/**
 * Directive:   data-router-title
 *
 * Description:
 *  Provides a way to change page title. It can be used in two ways:
 *    - on <html> tag - creates title template, {title} is the place where page title will be put
 *    - on element with data-router-page directive - creates title for the page
 *
 * Values:
 *  - page title
 *
 * Usage:
 *  On <html> element:
 *    <html lang="en" data-router data-router-title="{title} | Sample website">
 *      ...
 *    </html>
 *
 *  On other element with data-router-page:
 *    <section data-router-page="/page" data-router-title="Sample page">
 *      ...
 *    </section>
 */
defineDirective(Directive.Title, {
  factory: (elements) => {
    const elementsWithPage = getElementsWithDirective(elements, Directive.Page)
    if (elementsWithPage.length === 0) {
      return
    }

    const [ titleTemplate, titleFallback ] = getRootElementDirectives([ Directive.Title, Directive.TitleDefault ])

    // update title after firing up view change event
    subscribe(InternalEvent.ViewChange, () => {
      for (const page of elementsWithPage) {
        const route = page.directives.get(Directive.Page)
        const title = page.directives.get(Directive.Title) ?? titleFallback

        if (isEmptyString(route) || isEmptyString(title)) {
          continue // no way to set title if neither route nor title is known
        }

        if (isMatchingURL(route)) {
          if (titleTemplate != null) {
            document.title = titleTemplate.replace('{title}', title)
          } else {
            document.title = title
          }

          break // first match
        }
      }
    })

    return () => {
      removeDirectivesFromRootElement([ Directive.Title, Directive.TitleDefault ])
    }
  },
  options: {
    removable: true,
  },
})
