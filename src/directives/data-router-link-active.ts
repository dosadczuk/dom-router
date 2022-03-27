import { isEmptyString } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getRoute } from '@router/directives/data-router-link'
import { appendClassNameToElement, removeClassNameFromElement } from '@router/dom'
import { InternalEvent, subscribe } from '@router/events'
import { isMatchingURL } from '@router/url'

defineDirective(Directive.LinkActive, {
  factory: (_, elementsWithLinkActive) => {
    subscribe(InternalEvent.ViewChange, () => {
      for (const link of elementsWithLinkActive) {
        const route = getRoute(link)
        if (isEmptyString(route)) {
          continue // nowhere to go
        }

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
