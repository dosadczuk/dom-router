import { Directive, processDirectives } from '@router/directives'
import * as directives from '@router/directives/index'
import { getElementsWithAnyDirective, hasRootDirective } from '@router/dom'

(function Router() {
  const canInitialize = hasRootDirective(Directive.Initialize)
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Initialize}' attribute to root element.`)
  }

  const elements = getElementsWithAnyDirective()
  if (elements.length === 0) {
    throw new Error(`Router cannot be initialized. No directive found.`)
  }

  processDirectives(elements, directives.definition)
})()
