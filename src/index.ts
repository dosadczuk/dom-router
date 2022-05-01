import { Directive, processDirectives } from '@router/directives'
import * as directives from '@router/directives/index'
import { getElementsWithAnyDirective, hasDocumentDirective } from '@router/dom'

(function Router() {
  const canInitialize = hasDocumentDirective(Directive.Initialize)
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Initialize}' attribute to root element.`)
  }

  const elements = getElementsWithAnyDirective()
  if (elements.length === 0) {
    throw new Error(`Router cannot be initialized. No element with directive found.`)
  }

  processDirectives(elements, directives.order)
})()
