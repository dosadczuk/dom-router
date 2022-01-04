import { setDirective } from '@router/directives'
import {
  displayHideElement,
  displayShowElement,
  getHTMLElementsWithDirective,
  replaceElementWithTemplate,
  replaceTemplateWithElement,
} from '@router/dom'
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

  it('should show element using CSS display property', function () {
    // given
    const div = document.createElement('div')
    div.setAttribute('data-test', 'test')
    div.style.display = 'none'

    document.body.append(div)

    const element = getHTMLElementsWithDirective('data-test')[0]

    // when
    displayShowElement(element)

    // then
    expect(element.content.style.display).toEqual('revert')
  })

  it('should hide element using CSS display property', function () {
    // given
    const div = document.createElement('div')
    div.setAttribute('data-test', 'test')

    document.body.append(div)

    const element = getHTMLElementsWithDirective('data-test')[0]

    // when
    displayHideElement(element)

    // then
    expect(element.content.style.display).toEqual('none')
  })

  it('should replace HTMLTemplateElement with HTMLElement', () => {
    // given
    const templateElement = document.createElement('div')
    templateElement.setAttribute('data-test', 'test')

    const template = document.createElement('template')
    template.setAttribute('data-test', 'test')
    template.content.append(templateElement)

    document.body.append(template)

    const element = getHTMLElementsWithDirective('data-test')[0]

    // when
    replaceTemplateWithElement(element)

    // then
    expect(element.content.isEqualNode(templateElement)).toBeTruthy()
  })

  it('should replace HTMLElement with HTMLTemplateElement', () => {
    // given
    const templateElement = document.createElement('div')
    templateElement.setAttribute('data-test', 'test')

    document.body.append(templateElement)

    const element = getHTMLElementsWithDirective('data-test')[0]

    // when
    replaceElementWithTemplate(element)

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
