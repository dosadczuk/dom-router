import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, hideHTMLElement, showHTMLElement } from '@router/dom'
import { Event, subscribe } from '@router/events'
import { getCurrentURL, isMatchingURL } from '@router/url'

setDirective(Directive.Page, () => {
  const pages = getHTMLElementsWithDirective(Directive.Page)
  if (pages.length === 0) {
    return
  }

  subscribe(document, Event.ChangeView, () => {
    const url = getCurrentURL()

    for (const page of pages) {
      const route = page.directives.get(Directive.Page)
      if (route == null) {
        continue
      }

      if (isMatchingURL(route, url)) {
        showHTMLElement(page)
      } else {
        hideHTMLElement(page)
      }
    }
  })
})
