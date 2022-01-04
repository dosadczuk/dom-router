import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, toggleDisplayElement, toggleTemplateElement } from '@router/dom'
import { dispatch, Event, subscribe } from '@router/events'
import { Mode } from '@router/mode'
import { getCurrentURL, isMatchingURL } from '@router/url'

setDirective(Directive.Page, () => {
  const pages = getHTMLElementsWithDirective(Directive.Page)
  if (pages.length === 0) {
    return
  }

  subscribe(document, Event.ViewChange, (event) => {
    const { detail: mode } = event as CustomEvent
    const url = getCurrentURL()

    for (const page of pages) {
      const route = page.directives.get(Directive.Page)
      if (route == null) {
        continue
      }

      switch (mode) {
        case Mode.Display:
          toggleDisplayElement(isMatchingURL(route, url), page)
          break

        case Mode.Template:
          toggleTemplateElement(isMatchingURL(route, url), page)
          break
      }
    }

    dispatch(document, Event.ViewChanged)
  })
})
