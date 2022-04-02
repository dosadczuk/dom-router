import { isEnum } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import { getDocumentDirective, ToggleMode, toggleViewWithMode } from '@router/dom'
import { dispatch, dispatchTo, ExternalEvent, InternalEvent, subscribe, subscribeTo } from '@router/events'
import { isMatchingURL } from '@router/url'

defineDirective(Directive.Initialize, {
  factory: () => {
    let mode = getDocumentDirective(Directive.Initialize, '') as ToggleMode
    if (!isEnum(mode, ToggleMode)) {
      mode = ToggleMode.Display // default mode
    }

    // let client subscribe to event "before-mount"
    dispatchTo(document, ExternalEvent.BeforeMount)

    // update forced by internal mechanism
    subscribe(InternalEvent.PageChange, (route: string) => {
      if (isMatchingURL(route)) {
        return // same page, no need to change
      }

      // let client subscribe to event "before-page-update"
      dispatchTo(document, ExternalEvent.BeforePageUpdate)

      history.pushState(null, '', route)

      // let client subscribe to event "page-updated"
      dispatchTo(document, ExternalEvent.PageUpdated, route)

      dispatch(InternalEvent.ViewChange, toggleViewWithMode(mode))
    })

    // update forced by external mechanism
    subscribeTo(window, 'popstate', () => {
      dispatch(InternalEvent.ViewChange, toggleViewWithMode(mode))
    })

    // force initial view change
    dispatch(InternalEvent.ViewChange, toggleViewWithMode(mode))

    // let client subscribe to event "mounted"
    dispatchTo(document, ExternalEvent.Mounted)
  },
  options: {
    removable: true,
  },
})
