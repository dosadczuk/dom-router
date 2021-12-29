import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, hideHTMLElement, HTMLElementWithDirectives, showHTMLElement } from '@router/dom'
import { Event, subscribe } from '@router/events'
import { isMatchingURL } from '@router/url'

setDirective(Directive.Page, () => {
  getHTMLElementsWithDirective(Directive.Page).forEach(subscribeToChangeView)
})

const subscribeToChangeView = (page: HTMLElementWithDirectives): void => {
  const route = page.directives.get(Directive.Page)
  if (route == null) {
    return
  }

  subscribe(document, Event.ChangeView, () => {
    if (isMatchingURL(route)) {
      showHTMLElement(page)
    } else {
      hideHTMLElement(page)
    }
  })
}
