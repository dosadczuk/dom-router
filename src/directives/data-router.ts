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

setDirective(Directive.Init, () => {
  let mode = document.documentElement.getAttribute(Directive.Init)
  if (isEmpty(mode) || !isEnumValue(Mode, mode)) {
    mode = Mode.Display // default mode
  }

  // let app subscribe to "before init"
  dispatchToElement(document, ExternalEvent.Initialize)

  // update forced with link
  subscribe(InternalEvent.PageChange, (route) => {
    // FIXME: In theory, may cause bugs
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

  // force update view, let event set up app
  dispatch(InternalEvent.ViewChange, mode)

  // let app subscribe to "after init"
  dispatchToElement(document, ExternalEvent.Initialized)
})
