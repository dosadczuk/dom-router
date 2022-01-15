import { defineDirective } from '@router/directives'
import {
  displayHideElement,
  displayShowElement,
  getFirstHTMLElementsWithDirective,
  getHTMLElementsWithAnyDirective,
  getHTMLElementsWithDirective,
  removeDirectiveFromHTMLElements,
  replaceElementWithTemplate,
  replaceTemplateWithElement,
} from '@router/dom'
import { afterEach, beforeAll, beforeEach, describe, expect, fn, it } from 'vitest'

describe('dom', () => {

  let ELEMENTS: HTMLElement[] = []

  const DIRECTIVE_NAME = 'data-test'
  const DIRECTIVE_VALUE = 'test'

  beforeAll(() => {
    defineDirective('data-test', fn())

    ELEMENTS = Array.from({ length: 5 }, () => {
      return createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    })
  })

  const createElementWithDirective = (name: string, value: string): HTMLElement => {
    const element = document.createElement('div')
    element.setAttribute(name, value)

    return element
  }

  beforeEach(() => {
    document.body.append(...ELEMENTS)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should get HTMLElements with any directive', () => {
    // when
    const elementsWithAnyDirective = getHTMLElementsWithAnyDirective()

    // then
    expect(elementsWithAnyDirective).length(ELEMENTS.length)
  })

  it('should get HTMLElements with directive', () => {
    // given
    const elements = getHTMLElementsWithAnyDirective()
    const elementWithTestDirective = ELEMENTS[0]

    // when
    const { content, directives } = getHTMLElementsWithDirective(elements, DIRECTIVE_NAME)[0]

    // then
    expect(content.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(directives.size).toEqual(1)
    expect(directives.has('data-test')).toBeTruthy()
    expect(directives.get('data-test')).toEqual('test')
  })

  it('should get first HTMLElement with directive', () => {
    // given
    const elements = getHTMLElementsWithAnyDirective()
    const elementWithTestDirective = ELEMENTS[0]

    // when
    const element = getFirstHTMLElementsWithDirective(elements, DIRECTIVE_NAME)
    const { content, directives } = element!

    // then
    expect(content.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(directives.size).toEqual(1)
    expect(directives.has('data-test')).toBeTruthy()
    expect(directives.get('data-test')).toEqual('test')
  })

  it('should remove directive from HTMLElement', function () {
    document.body.innerHTML = ''

    // given
    const element1 = createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    const element2 = createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)

    document.body.append(element1, element2)

    // when
    removeDirectiveFromHTMLElements(getHTMLElementsWithAnyDirective(), DIRECTIVE_NAME)

    // then
    expect(element1.hasAttribute(DIRECTIVE_NAME)).toBeFalsy()
    expect(element2.hasAttribute(DIRECTIVE_NAME)).toBeFalsy()
  })

  it('should show element using CSS display property', function () {
    // given
    const elements = getHTMLElementsWithAnyDirective()

    const element = getHTMLElementsWithDirective(elements, DIRECTIVE_NAME)[0]
    element.content.style.display = 'none'

    // when
    displayShowElement(element)

    // then
    expect(element.content.style.display).toEqual('revert')
  })

  it('should hide element using CSS display property', function () {
    // given
    const elements = getHTMLElementsWithAnyDirective()

    const element = getHTMLElementsWithDirective(elements, DIRECTIVE_NAME)[0]
    element.content.style.display = 'block'

    // when
    displayHideElement(element)

    // then
    expect(element.content.style.display).toEqual('none')
  })

  it('should replace HTMLTemplateElement with HTMLElement', () => {
    // given
    const elements = getHTMLElementsWithAnyDirective()

    const template = document.createElement('template')
    template.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    template.content.append(ELEMENTS[0])

    document.body.prepend(template)

    const element = getHTMLElementsWithDirective(elements, DIRECTIVE_NAME)[0]

    // when
    replaceTemplateWithElement(element)

    // then
    expect(element.content.isEqualNode(ELEMENTS[0])).toBeTruthy()
  })

  it('should replace HTMLElement with HTMLTemplateElement', () => {
    // given
    const elements = getHTMLElementsWithAnyDirective()

    const element = getHTMLElementsWithDirective(elements, DIRECTIVE_NAME)[0]

    // when
    replaceElementWithTemplate(element)

    // then
    const template = element.content as HTMLTemplateElement

    expect(template).instanceof(HTMLTemplateElement)
    expect(template.content.firstElementChild).not.toBeNull()
    expect(template.content.firstElementChild!.isEqualNode(ELEMENTS[0])).toBeTruthy()
    expect(template.content.firstElementChild!.hasAttribute('data-test')).toBeTruthy()
    expect(template.content.firstElementChild!.getAttribute('data-test')).toEqual('test')
  })
})
