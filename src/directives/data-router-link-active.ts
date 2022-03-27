import { isEmptyString } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getRouteToLink } from '@router/directives/data-router-link.model'
import { appendClassNameToElement, removeClassNameFromElement } from '@router/dom'
import { InternalEvent, subscribe } from '@router/events'
import { isMatchingURL } from '@router/url'

defineDirective(Directive.LinkActive, {
  factory: (elements) => {
    const routeToLink = getRouteToLink(elements)
    if (routeToLink.size === 0) {
      return // no link found
    }

    subscribe(InternalEvent.ViewChange, () => {
      for (const [ route, link ] of routeToLink) {
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
    })
  },
  options: {
    removable: true,
  },
})
