import { defineDirective, Directive } from '@router/directives'
import { getRouteToLink } from '@router/directives/data-router-link.model'
import { dispatch, InternalEvent, prevent } from '@router/events'

defineDirective(Directive.Link, {
  factory: (elements) => {
    const routeToLink = getRouteToLink(elements)
    if (routeToLink.size === 0) {
      return // no link found
    }

    for (const [ route, link ] of routeToLink) {
      link.element.addEventListener('click', prevent(() => {
        dispatch(InternalEvent.PageChange, route)
      }))
    }
  },
  options: {
    removable: true,
  },
})
