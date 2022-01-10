import { Directive, setDirective } from "@router/directives";
import { appendClassNamesToElement, getHTMLElementsWithDirective, removeClassNamesFromElement } from "@router/dom";
import { isEmpty } from "@router/asserts";
import { getCurrentURL, isMatchingURL } from "@router/url";
import { getRouteFromLink } from "@router/directives/data-router-link";
import { InternalEvent, subscribe } from "@router/events";

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
setDirective(Directive.LinkActive, () => {
  const elementsWithLinkActive = getHTMLElementsWithDirective(Directive.LinkActive)
  if (elementsWithLinkActive.length === 0) {
    return
  }

  subscribe(InternalEvent.ViewChange, () => {
    const url = getCurrentURL()

    for (const element of elementsWithLinkActive) {
      const route = getRouteFromLink(element)
      if (route == null) {
        continue
      }

      let className = element.directives.get(Directive.LinkActive);
      if (className == null || isEmpty(className)) {
        className = 'active' // default class 'active'
      }

      const classNames = className.split(' ')

      if (isMatchingURL(route, url)) {
        appendClassNamesToElement(element, classNames)
      } else {
        removeClassNamesFromElement(element, classNames)
      }
    }
  })
})
