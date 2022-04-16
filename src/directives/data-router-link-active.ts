import { isEmptyString } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getRouteToLinks } from '@router/directives/data-router-link.model'
import { appendClassNameToElement, removeClassNameFromElement } from '@router/dom'
import { InternalEvent, subscribe } from '@router/events'
import { isMatchingURL } from '@router/url'

defineDirective(Directive.LinkActive, {
  factory: (elements) => {
    const routeToLinks = getRouteToLinks(elements)
    if (routeToLinks.size === 0) {
      return // no link found
    }

    subscribe(InternalEvent.ViewChange, () => {
      for (const [ route, links ] of routeToLinks) {
        for (const link of links) {
          let className = link.directives.get(Directive.LinkActive)
          if (isEmptyString(className)) {
            className = 'active'
          }

          if (isMatchingURL(route)) {
            appendClassNameToElement(link, className.split(' '))
          } else {
            removeClassNameFromElement(link, className.split(' '))
          }
        }
      }
    })
  },
  options: {
    removable: true,
  },
})
