import { Directive, setDirective } from '@router/directives'
import { dispatch, Event, subscribe } from '@router/events'
import { getCurrentURL, isMatchingURL } from '@router/url'

setDirective(Directive.Init, () => {
  // let app subscribe to "before init"
  dispatch(document, Event.Initialize)

  // update forced with link
  subscribe(document, Event.ChangePage, (event) => {
    const { detail: route } = event as CustomEvent

    // FIXME: In theory, may cause bugs
    if (isMatchingURL(route, getCurrentURL())) {
      return // same page, no need to change
    }

    history.pushState(null, '', route)

    dispatch(document, Event.ChangeView)
  })

  // update forced with History API
  subscribe(window, 'popstate', () => {
    dispatch(document, Event.ChangeView)
  })

  // force update view, let event set up app
  dispatch(document, Event.ChangeView)

  // let app subscribe to "after init"
  dispatch(document, Event.Initialized)
})
