import { runDirective } from '@router/directives'
import '@router/directives/index'
import { dispatch, Event, subscribe } from '@router/events'

runDirective('data-router-cloak')
runDirective('data-router-page')
runDirective('data-router-link')

// let app subscribe to "before init"
dispatch(document, Event.Initialize)

// update forced with link
subscribe(document, Event.ChangePage, (event) => {
  const { detail: route } = event as CustomEvent

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
