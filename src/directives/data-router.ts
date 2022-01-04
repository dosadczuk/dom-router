import { isEmpty, isEnumValue } from '@router/asserts'
import { Directive, setDirective } from '@router/directives'
import { dispatch, Event, subscribe } from '@router/events'
import { getModes, Mode } from '@router/mode'
import { getCurrentURL, isMatchingURL } from '@router/url'

setDirective(Directive.Init, () => {
  let mode = document.documentElement.getAttribute(Directive.Init)
  if (isEmpty(mode) || !isEnumValue(Mode, mode)) {
    mode = Mode.Display // default mode

    console.warn(`Setting default router mode: ${mode}. Available modes: ${getModes().join(', ')}.`)
  }

  // let app subscribe to "before init"
  dispatch(document, Event.Initialize)

  // update forced with link
  subscribe(document, Event.PageChange, (event) => {
    const { detail: route } = event as CustomEvent

    // FIXME: In theory, may cause bugs
    if (isMatchingURL(route, getCurrentURL())) {
      return // same page, no need to change
    }

    history.pushState(null, '', route)

    dispatch(document, Event.ViewChange, mode)
  })

  // update forced with History API
  subscribe(window, 'popstate', () => {
    dispatch(document, Event.ViewChange, mode)
  })

  // force update view, let event set up app
  dispatch(document, Event.ViewChange, mode)

  // let app subscribe to "after init"
  dispatch(document, Event.Initialized)
})
