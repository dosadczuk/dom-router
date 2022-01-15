import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { getHTMLElementsWithDirectives } from '@router/dom'
import { Directive, InternalEvent } from '@router/enums'
import { subscribe } from '@router/events'
import { getCurrentURL, isMatchingURL } from '@router/url'

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
defineDirective(Directive.Title, (elements) => {
  const elementsWithPageAndTitle = getHTMLElementsWithDirectives(elements, [Directive.Page, Directive.Title])
  if (elementsWithPageAndTitle.length === 0) {
    return
  }

  const titleTemplate = document.documentElement.getAttribute(Directive.Title)

  subscribe(InternalEvent.ViewChange, () => {
    const url = getCurrentURL()

    for (const page of elementsWithPageAndTitle) {
      const route = page.directives.get(Directive.Page)
      const title = page.directives.get(Directive.Title)

      if (isEmptyString(route) || isEmptyString(title)) {
        continue
      }

      if (isMatchingURL(route, url)) {
        if (titleTemplate != null) {
          document.title = titleTemplate.replace('{title}', title)
        } else {
          document.title = title
        }

        break // first match
      }
    }
  })
})
