import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, toggleDisplayElement, toggleTemplateElement } from '@router/dom'
import { dispatchToElement, ExternalEvent, InternalEvent, subscribe } from '@router/events'
import { Mode } from '@router/mode'
import { getCurrentURL, isMatchingURL } from '@router/url'

setDirective(Directive.Page, () => {
  const pages = getHTMLElementsWithDirective(Directive.Page)
  if (pages.length === 0) {
    return
  }

  subscribe(InternalEvent.ViewChange, (mode: string) => {
    const url = getCurrentURL()

    for (const page of pages) {
      const route = page.directives.get(Directive.Page)
      if (route == null) {
        continue
      }

      const canBeVisible = isMatchingURL(route, url)

      switch (mode) {
        case Mode.Display:
          toggleDisplayElement(canBeVisible, page)
          break

        case Mode.Template:
          toggleTemplateElement(canBeVisible, page)
          break
      }
    }

    dispatchToElement(document, ExternalEvent.ViewChanged)
  })
})
