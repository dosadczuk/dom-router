import { setDirective } from '@router/directives'
import { getHTMLElementsWithDirective, hideHTMLElement, showHTMLElement } from '@router/dom'
import { afterEach, beforeEach, describe, expect, fn, it } from 'vitest'

describe('dom', () => {

  beforeEach(() => {
    setDirective('data-test', fn())
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should get HTMLElements with directive', () => {
    // given
    const elementWithTestDirective = document.createElement('div')
    elementWithTestDirective.setAttribute('data-test', 'test')

    document.body.append(elementWithTestDirective)

    // when
    const elements = getHTMLElementsWithDirective('data-test')
    const { content, directives } = elements[0]

    // then
    expect(elements).length(1)
    expect(content.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(directives.size).toEqual(1)
    expect(directives.has('data-test')).toBeTruthy()
    expect(directives.get('data-test')).toEqual('test')
  })

  it('should show HTMLElement', () => {
    // given
    const templateElement = document.createElement('div')
    templateElement.setAttribute('data-test', 'test')

    const template = document.createElement('template')
    template.setAttribute('data-test', 'test')
    template.content.append(templateElement)

    document.body.append(template)

    const element = getHTMLElementsWithDirective('data-test')[0]

    // when
    showHTMLElement(element)

    // then
    expect(element.content.isEqualNode(templateElement)).toBeTruthy()
  })

  it('should hide HTMLElement', () => {
    // given
    const templateElement = document.createElement('div')
    templateElement.setAttribute('data-test', 'test')

    document.body.append(templateElement)

    const element = getHTMLElementsWithDirective('data-test')[0]

    // when
    hideHTMLElement(element)

    // then
    const template = element.content as HTMLTemplateElement

    expect(template).instanceof(HTMLTemplateElement)
    expect(template.hasAttribute('data-test')).toBeTruthy()
    expect(template.getAttribute('data-test')).toEqual('test')
    expect(template.content.firstElementChild).not.toBeNull()
    expect(template.content.firstElementChild!.isEqualNode(templateElement)).toBeTruthy()
    expect(template.content.firstElementChild!.hasAttribute('data-test')).toBeTruthy()
    expect(template.content.firstElementChild!.getAttribute('data-test')).toEqual('test')
  })
})
