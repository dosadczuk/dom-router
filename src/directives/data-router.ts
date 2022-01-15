import { isEnumValue } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { Directive, ExternalEvent, InternalEvent, Mode } from '@router/enums'
import { dispatch, dispatchToElement, subscribe, subscribeToElement } from '@router/events'
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
defineDirective(Directive.Init, () => {
  let mode = document.documentElement.getAttribute(Directive.Init)
  if (!isEnumValue(Mode, mode)) {
    mode = Mode.Display // default mode
  }

  // let client subscribe to event "initialize"
  dispatchToElement(document, ExternalEvent.Initialize)

  // update forced by internal mechanism
  subscribe(InternalEvent.PageChange, (route) => {
    if (isMatchingURL(route, getCurrentURL())) {
      return // same page, no need to change
    }

    history.pushState(null, '', route)

    dispatch(InternalEvent.ViewChange, mode)
  })

  // update forced by History API
  subscribeToElement(window, 'popstate', () => {
    dispatch(InternalEvent.ViewChange, mode)
  })

  // initial view change
  dispatch(InternalEvent.ViewChange, mode)

  // let client subscribe to event "initialized"
  dispatchToElement(document, ExternalEvent.Initialized)
})
