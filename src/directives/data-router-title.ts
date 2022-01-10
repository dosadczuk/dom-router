import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'
import { InternalEvent, subscribe } from '@router/events'
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
setDirective(Directive.Title, () => {
  const elementsWithTitle = getHTMLElementsWithDirective(Directive.Title)
  if (elementsWithTitle.length === 0) {
    return
  }

  const titleTemplate = document.documentElement.getAttribute(Directive.Title)

  subscribe(InternalEvent.ViewChange, () => {
    const url = getCurrentURL()

    for (const element of elementsWithTitle) {
      const route = element.directives.get(Directive.Page)
      const title = element.directives.get(Directive.Title)

      if (route == null || title == null) {
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
