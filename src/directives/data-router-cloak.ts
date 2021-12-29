import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, HTMLElementWithDirectives } from '@router/dom'

setDirective(Directive.Cloak, () => {
  getHTMLElementsWithDirective(Directive.Cloak).forEach(removeCloakDirective)
})

const removeCloakDirective = (cloak: HTMLElementWithDirectives): void => {
  cloak.content.removeAttribute(Directive.Cloak)
}
