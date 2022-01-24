import { isEmptyString } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { getRouteFromLink } from '@router/directives/data-router-link'
import { appendClassNamesToElement, removeClassNamesFromElement } from '@router/dom'
import { Directive, InternalEvent } from '@router/enums'
import { subscribe } from '@router/events'
import { isMatchingURL } from '@router/url'

/**
 * Directive:   data-router-link-active
 *
 * Description:
 *  Adds additional class to a link when current page matches it. Directive value
 *  is a class name, which will be added to a link. If directive exists on an element
 *  but value is empty - default 'active' class will be used.
 *
 * Values:
 *  - no value      : 'active' class will be added
 *  - class name
 *
 * Usage:
 *  <a data-router-link href="/path" data-router-link-active></a>
 *  <a data-router-link href="/path" data-router-link-active="my-special-class"></a>
 */
defineDirective(Directive.LinkActive, {
  factory: (_, elementsWithLinkActive) => {
    // update link active after firing up view change event
    subscribe(InternalEvent.ViewChange, () => {
      for (const link of elementsWithLinkActive) {
        const route = getRouteFromLink(link)
        if (isEmptyString(route)) {
          continue
        }

        let className = link.directives.get(Directive.LinkActive)
        if (isEmptyString(className)) {
          className = 'active' // default class 'active'
        }

        if (isMatchingURL(route)) {
          appendClassNamesToElement(link, className.split(' '))
        } else {
          removeClassNamesFromElement(link, className.split(' '))
        }
      }
    })
  },
  options: {
    removable: true,
  },
})
