import { defineDirective } from '@router/directives'
import {
  displayHideElement,
  displayShowElement,
  getElementsWithAnyDirective,
  getElementsWithDirective,
  getFirstElementWithDirective,
  getRootElementDirective,
  hasRootElementDirective,
  removeDirectiveFromElements,
  removeDirectiveFromRootElement,
  replaceElementWithTemplate,
  replaceTemplateWithElement,
  root,
} from '@router/dom'
import { afterEach, beforeAll, beforeEach, describe, expect, fn, it } from 'vitest'

describe('dom', () => {

  let ELEMENTS: HTMLElement[] = []

  const DIRECTIVE_NAME = 'data-test'
  const DIRECTIVE_VALUE = 'test'

  beforeAll(() => {
    defineDirective('data-test', { factory: fn() })

    ELEMENTS = Array.from({ length: 5 }, () => {
      return createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    })
  })

  beforeEach(() => {
    // clear root HTMLElement from directives
    for (const { name } of Array.from(root.attributes)) {
      root.removeAttribute(name)
    }

    document.body.append(...ELEMENTS)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should get directive from root HTMLElement', () => {
    // given
    root.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)

    // when
    const directive = getRootElementDirective(DIRECTIVE_NAME)

    // then
    expect(directive).toEqual(DIRECTIVE_VALUE)
  })

  it('should check if root HTMLElement contains directive', () => {
    // given
    root.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)

    // when
    const withDirective = hasRootElementDirective(DIRECTIVE_NAME)
    const withoutDirective = hasRootElementDirective('not-existing')

    // then
    expect(withDirective).toBeTruthy()
    expect(withoutDirective).toBeFalsy()
  })

  it('should remove directive from root HTMLElement', () => {
    // given
    root.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)

    // when
    const hasDirectiveBeforeRemove = hasRootElementDirective(DIRECTIVE_NAME)
    removeDirectiveFromRootElement(DIRECTIVE_NAME)
    const hasDirectiveAfterRemove = hasRootElementDirective(DIRECTIVE_NAME)

    // then
    expect(hasDirectiveBeforeRemove).toBeTruthy()
    expect(hasDirectiveAfterRemove).toBeFalsy()
  })

  it('should get HTMLElements with any directive', () => {
    // when
    const elementsWithAnyDirective = getElementsWithAnyDirective()

    // then
    expect(elementsWithAnyDirective).length(ELEMENTS.length)
  })

  it('should get HTMLElements with directive', () => {
    // given
    const elements = getElementsWithAnyDirective()
    const elementWithTestDirective = ELEMENTS[0]

    // when
    const { content, directives } = getElementsWithDirective(elements, DIRECTIVE_NAME)[0]

    // then
    expect(content.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(directives.size).toEqual(1)
    expect(directives.has('data-test')).toBeTruthy()
    expect(directives.get('data-test')).toEqual('test')
  })

  it('should get first HTMLElement with directive', () => {
    // given
    const elements = getElementsWithAnyDirective()
    const elementWithTestDirective = ELEMENTS[0]

    // when
    const element = getFirstElementWithDirective(elements, DIRECTIVE_NAME)
    const { content, directives } = element!

    // then
    expect(content.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(directives.size).toEqual(1)
    expect(directives.has('data-test')).toBeTruthy()
    expect(directives.get('data-test')).toEqual('test')
  })

  it('should remove directive from HTMLElement', () => {
    document.body.innerHTML = ''

    // given
    const element1 = createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    const element2 = createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)

    document.body.append(element1, element2)

    // when
    removeDirectiveFromElements(getElementsWithAnyDirective(), DIRECTIVE_NAME)

    // then
    expect(element1.hasAttribute(DIRECTIVE_NAME)).toBeFalsy()
    expect(element2.hasAttribute(DIRECTIVE_NAME)).toBeFalsy()
  })

  it('should show element using CSS display property', () => {
    // given
    const elements = getElementsWithAnyDirective()

    const element = getElementsWithDirective(elements, DIRECTIVE_NAME)[0]
    element.content.style.display = 'none'

    // when
    displayShowElement(element)

    // then
    expect(element.content.style.display).toEqual('revert')
    expect(element.visible).toBeTruthy()
  })

  it('should hide element using CSS display property', () => {
    // given
    const elements = getElementsWithAnyDirective()

    const element = getElementsWithDirective(elements, DIRECTIVE_NAME)[0]
    element.content.style.display = 'block'

    // when
    displayHideElement(element)

    // then
    expect(element.content.style.display).toEqual('none')
    expect(element.visible).toBeFalsy()
  })

  it('should replace HTMLTemplateElement with HTMLElement', () => {
    // given
    const template = document.createElement('template')
    template.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    template.content.append(ELEMENTS[0])

    document.body.prepend(template)

    const element = getElementsWithDirective(getElementsWithAnyDirective(), DIRECTIVE_NAME)[0]

    // when
    replaceTemplateWithElement(element)

    // then
    expect(element.content.isEqualNode(ELEMENTS[0])).toBeTruthy()
    expect(element.visible).toBeTruthy()
  })

  it('should replace HTMLElement with HTMLTemplateElement', () => {
    // given
    const element = getElementsWithDirective(getElementsWithAnyDirective(), DIRECTIVE_NAME)[0]

    // when
    replaceElementWithTemplate(element)

    // then
    const template = element.content as HTMLTemplateElement

    expect(template).instanceof(HTMLTemplateElement)
    expect(template.content.firstElementChild).not.toBeNull()
    expect(template.content.firstElementChild!.isEqualNode(ELEMENTS[0])).toBeTruthy()
    expect(template.content.firstElementChild!.hasAttribute('data-test')).toBeTruthy()
    expect(template.content.firstElementChild!.getAttribute('data-test')).toEqual('test')
    expect(element.visible).toBeFalsy()
  })
})

const createElementWithDirective = (name: string, value: string): HTMLElement => {
  const element = document.createElement('div')
  element.setAttribute(name, value)

  return element
}
