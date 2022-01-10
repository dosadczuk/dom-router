import { setDirective } from '@router/directives'
import {
  displayHideElement,
  displayShowElement,
  getHTMLElementsWithDirective,
  replaceElementWithTemplate,
  replaceTemplateWithElement,
} from '@router/dom'
import { afterEach, beforeAll, beforeEach, describe, expect, fn, it } from 'vitest'

describe('dom', () => {

  let ELEMENTS: HTMLElement[] = [];

  const DIRECTIVE_NAME = 'data-test';
  const DIRECTIVE_VALUE = 'test';

  beforeAll(() => {
    setDirective('data-test', fn())

    ELEMENTS = Array.from({ length: 5 }, () => {
      const element = document.createElement('div')
      element.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)

      return element
    })
  })

  beforeEach(() => {
    document.body.append(...ELEMENTS);
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should get HTMLElements with directive', () => {
    // given
    const elementWithTestDirective = ELEMENTS[0]

    // when
    const { content, directives } = getHTMLElementsWithDirective(DIRECTIVE_NAME)[0]

    // then
    expect(content.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(directives.size).toEqual(1)
    expect(directives.has('data-test')).toBeTruthy()
    expect(directives.get('data-test')).toEqual('test')
  })

  it('should show element using CSS display property', function () {
    // given
    const element = getHTMLElementsWithDirective(DIRECTIVE_NAME)[0]
    element.content.style.display = 'none'

    // when
    displayShowElement(element)

    // then
    expect(element.content.style.display).toEqual('revert')
  })

  it('should hide element using CSS display property', function () {
    // given
    const element = getHTMLElementsWithDirective(DIRECTIVE_NAME)[0]
    element.content.style.display = 'block'

    // when
    displayHideElement(element)

    // then
    expect(element.content.style.display).toEqual('none')
  })

  it('should replace HTMLTemplateElement with HTMLElement', () => {
    // given
    const templateElement = ELEMENTS[0]

    const template = document.createElement('template')
    template.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    template.content.append(templateElement)

    document.body.prepend(template)

    const element = getHTMLElementsWithDirective(DIRECTIVE_NAME)[0]

    // when
    replaceTemplateWithElement(element)

    // then
    expect(element.content.isEqualNode(templateElement)).toBeTruthy()
  })

  it('should replace HTMLElement with HTMLTemplateElement', () => {
    // given
    const elementTemplate = ELEMENTS[0]

    const element = getHTMLElementsWithDirective(DIRECTIVE_NAME)[0]

    // when
    replaceElementWithTemplate(element)

    // then
    const template = element.content as HTMLTemplateElement

    expect(template).instanceof(HTMLTemplateElement)
    expect(template.hasAttribute(DIRECTIVE_NAME)).toBeTruthy()
    expect(template.getAttribute(DIRECTIVE_NAME)).toEqual('test')
    expect(template.content.firstElementChild).not.toBeNull()
    expect(template.content.firstElementChild!.isEqualNode(elementTemplate)).toBeTruthy()
    expect(template.content.firstElementChild!.hasAttribute('data-test')).toBeTruthy()
    expect(template.content.firstElementChild!.getAttribute('data-test')).toEqual('test')
  })
})
