import { isEnumValue } from '@router/asserts'
import { defineDirective } from '@router/directives'
import { changeViewWithMode, getRootElementDirective, removeDirectiveFromRootElement } from '@router/dom'
import { Directive, ExternalEvent, InternalEvent, Mode } from '@router/enums'
import { dispatch, dispatchToElement, subscribe, subscribeToElement } from '@router/events.old'
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
defineDirective(Directive.Init, {
  factory: () => {
    let mode = getRootElementDirective(Directive.Init) ?? ''
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

      // let client subscribe to event "page-changed"
      dispatchToElement(document, ExternalEvent.PageChanged, route)

      dispatch(InternalEvent.ViewChange, changeViewWithMode(mode))
    })

    // update forced by History API
    subscribeToElement(window, 'popstate', () => {
      dispatch(InternalEvent.ViewChange, changeViewWithMode(mode))
    })

    // initial view change
    dispatch(InternalEvent.ViewChange, changeViewWithMode(mode))

    // remove before "initialized" event
    removeDirectiveFromRootElement(Directive.Init)

    // let client subscribe to event "initialized"
    dispatchToElement(document, ExternalEvent.Initialized)
  },
})
