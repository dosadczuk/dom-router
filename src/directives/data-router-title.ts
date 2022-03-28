import { isEmptyString } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getRouteToPage } from '@router/directives/data-router-page.model'
import { getDocumentDirectives, removeDocumentDirectives } from '@router/dom'
import { InternalEvent, subscribe } from '@router/events'
import { getCurrentURL, isMatchingURL } from '@router/url'

defineDirective(Directive.Title, {
  factory: (elements) => {
    const routeToPage = getRouteToPage(elements)
    if (routeToPage.size === 0) {
      return // no page found
    }

    const [ titleTemplate, titleFallback ] = getDocumentDirectives([ Directive.Title, Directive.TitleDefault ])

    subscribe(InternalEvent.ViewChange, () => {
      for (const [ route, page ] of routeToPage) {
        if (!isMatchingURL(route, getCurrentURL())) {
          continue // skip if not matching
        }

        const title = page.directives.get(Directive.Title) ?? titleFallback
        if (isEmptyString(title)) {
          continue // no title for current page
        }

        if (titleTemplate != null) {
          document.title = titleTemplate.replace('{{title}}', title)
        } else {
          document.title = title
        }

        break // stop on first match
      }
    })

    return () => {
      removeDocumentDirectives([ Directive.Title, Directive.TitleDefault ])
    }
  },
  options: {
    removable: true,
  },
})
