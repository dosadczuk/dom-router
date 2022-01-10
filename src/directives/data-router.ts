import { isEmpty, isEnumValue } from '@router/asserts'
import { Directive, setDirective } from '@router/directives'
import {
  dispatch,
  dispatchToElement,
  ExternalEvent,
  InternalEvent,
  subscribe,
  subscribeToElement,
} from '@router/events'
import { Mode } from '@router/mode'
import { getCurrentURL, isMatchingURL } from '@router/url'

/**
 * Directive:   data-router
 *
 * Description:
 *  Main directive, enables and configures router. Without the directive, router will not work.
 *
 * Values:
 *  - display   : show/hide pages using CSS display property [default]
 *  - template  : show/hide pages using HTML <template> tag
 *
 * Usage:
 *  <html lang="en" data-router></html>
 *  <html lang="en" data-router="display"></html>
 *  <html lang="en" data-router="template"></html>
 */
setDirective(Directive.Init, () => {
  let mode = document.documentElement.getAttribute(Directive.Init)
  if (isEmpty(mode) || !isEnumValue(Mode, mode)) {
    mode = Mode.Display // default mode
  }

  // let app subscribe to "before init"
  dispatchToElement(document, ExternalEvent.Initialize)

  // update forced with link
  subscribe(InternalEvent.PageChange, (route) => {
    if (isMatchingURL(route, getCurrentURL())) {
      return // same page, no need to change
    }

    history.pushState(null, '', route)

    dispatch(InternalEvent.ViewChange, mode)
  })

  // update forced with History API
  subscribeToElement(window, 'popstate', () => {
    dispatch(InternalEvent.ViewChange, mode)
  })

  // force update view, let event set up app view
  dispatch(InternalEvent.ViewChange, mode)

  // let app subscribe to "after init"
  dispatchToElement(document, ExternalEvent.Initialized)
})
