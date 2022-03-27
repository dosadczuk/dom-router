import { isEmptyString } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getElementsWithDirective, getRootDirectives, removeRootDirectives } from '@router/dom'
import { InternalEvent, subscribe } from '@router/events'
import { isMatchingURL } from '@router/url'

defineDirective(Directive.Title, {
  factory: (elements) => {
    const elementsWithPage = getElementsWithDirective(elements, Directive.Page)
    if (elementsWithPage.length === 0) {
      return // nothing to process
    }

    const [ titleTemplate, titleFallback ] = getRootDirectives([ Directive.Title, Directive.TitleDefault ])

    subscribe(InternalEvent.ViewChange, () => {
      for (const page of elementsWithPage) {
        const route = page.directives.get(Directive.Page)
        const title = page.directives.get(Directive.Title) ?? titleFallback

        if (isEmptyString(route) || isEmptyString(title)) {
          continue // no way to set title if neither route nor title are set
        }

        if (!isMatchingURL(route)) {
          continue // not the current route
        }

        if (titleTemplate != null) {
          document.title = titleTemplate.replace('{{title}}', title)
        } else {
          document.title = title
        }

        break // only set the title once
      }
    })

    return () => {
      removeRootDirectives([ Directive.Title, Directive.TitleDefault ])
    }
  },
  options: {
    removable: true,
  },
})
