import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'

setDirective(Directive.Cloak, () => {
  const elementsWithCloak = getHTMLElementsWithDirective(Directive.Cloak)
  if (elementsWithCloak.length === 0) {
    return
  }

  for (const element of elementsWithCloak) {
    element.content.removeAttribute(Directive.Cloak)
  }
})
