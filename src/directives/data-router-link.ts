import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'
import { dispatch, Event } from '@router/events'

setDirective(Directive.Link, () => {
  const links = getHTMLElementsWithDirective(Directive.Link)
  if (links.length === 0) {
    return
  }

  links.forEach(({ content: link, directives }) => {
    const route = directives.get(Directive.Link)
    if (route == null) {
      return
    }

    link.addEventListener('click', event => {
      event.preventDefault()

      dispatch(document, Event.ChangePage, route)
    })
  })
})
