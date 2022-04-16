import { defineDirective, Directive } from '@router/directives'
import { getRouteToLinks } from '@router/directives/data-router-link.model'
import { dispatch, InternalEvent, prevent } from '@router/events'

defineDirective(Directive.Link, {
  factory: (elements) => {
    const routeToLinks = getRouteToLinks(elements)
    if (routeToLinks.size === 0) {
      return // no link found
    }

    for (const [ route, links ] of routeToLinks) {
      for (const { element: link } of links) {
        link.addEventListener('click', prevent(() => {
          dispatch(InternalEvent.PageChange, route)
        }))
      }
    }
  },
  options: {
    removable: true,
  },
})
