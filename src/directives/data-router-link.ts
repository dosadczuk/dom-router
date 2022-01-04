import { isEmpty, isHTMLAnchorElement } from '@router/asserts'
import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'
import { dispatch, InternalEvent } from '@router/events'

setDirective(Directive.Link, () => {
  const links = getHTMLElementsWithDirective(Directive.Link)
  if (links.length === 0) {
    return
  }

  links.forEach(({ content: link, directives }) => {
    let route = directives.get(Directive.Link)

    // if empty, maybe it's an anchor
    if (isEmpty(route) && isHTMLAnchorElement(link)) {
      route = link.href
    }

    // if empty, no way to determine route
    if (route == null) {
      return
    }

    link.addEventListener('click', event => {
      event.preventDefault()

      dispatch(InternalEvent.PageChange, route)
    })
  })
})
