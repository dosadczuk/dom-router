import { Directive, setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, HTMLElementWithDirectives } from '@router/dom'
import { dispatch, Event } from '@router/events'

setDirective(Directive.Link, () => {
  getHTMLElementsWithDirective(Directive.Link).forEach(dispatchPageChangeOnClick)
})

const dispatchPageChangeOnClick = ({ content: link, directives }: HTMLElementWithDirectives): void => {
  const route = directives.get(Directive.Link)
  if (route == null) {
    return
  }

  link.addEventListener('click', event => {
    event.preventDefault()

    dispatch(document, Event.ChangePage, route)
  })
}
