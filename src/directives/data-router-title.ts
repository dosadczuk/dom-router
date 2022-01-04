import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'
import { InternalEvent, subscribe } from '@router/events'
import { getCurrentURL, isMatchingURL } from '@router/url'

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
