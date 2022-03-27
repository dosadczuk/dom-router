import { isDirective } from '@router/asserts'
import { defineDirective, Directive } from '@router/directives'
import {
  displayHideElement,
  displayShowElement,
  getElementsWithAnyDirective,
  getElementsWithDirective,
  getElementWithDirective,
  getRoot,
  removeDirectiveFromElements,
  replaceElementWithTemplate,
  replaceTemplateWithElement,
  setRoot,
} from '@router/dom'
import { afterEach, beforeAll, beforeEach, describe, expect, fn, it } from 'vitest'

describe('dom', () => {

  let DOM_ROOT = document.documentElement
  let DOM_ELEMENTS: HTMLElement[] = []

  const DIRECTIVE_NAME = Directive.Initialize
  const DIRECTIVE_VALUE = 'test'
  const DIRECTIVE_FACTORY = fn()

  beforeAll(() => {
    setRoot(DOM_ROOT)

    defineDirective(DIRECTIVE_NAME, { factory: DIRECTIVE_FACTORY })

    DOM_ELEMENTS = Array.from({ length }, () => {
      return createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    })
  })

  beforeEach(() => {
    for (const { name } of Array.from(DOM_ROOT.attributes)) {
      if (isDirective(name)) {
        DOM_ROOT.removeAttribute(name)
      }
    }

    DOM_ROOT.append(...DOM_ELEMENTS)
  })

  afterEach(() => {
    DOM_ROOT.innerHTML = ''
  })

  it('should set Root element', () => {
    // given
    const element = DOM_ELEMENTS[0]

    // when
    const oldRoot = getRoot()
    setRoot(element)
    const newRoot = getRoot()

    // then
    expect(oldRoot).toBe(DOM_ROOT)
    expect(newRoot).toBe(element)
    expect(newRoot).not.toBe(oldRoot)
  })

  it('should get elements with any directive', () => {
    // when
    const elementsWithAnyDirective = getElementsWithAnyDirective()

    // then
    expect(elementsWithAnyDirective).toHaveLength(DOM_ELEMENTS.length)
  })

  it('should get elements with directive', () => {
    // given
    const elements = getElementsWithAnyDirective()
    const elementWithTestDirective = DOM_ELEMENTS[0]

    // when
    const elementWithDirective = getElementsWithDirective(elements, DIRECTIVE_NAME)[0]

    // then
    expect(elementWithDirective.element.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(elementWithDirective.directives).toHaveLength(1)
    expect(elementWithDirective.directives.has(DIRECTIVE_NAME)).toBeTruthy()
    expect(elementWithDirective.directives.get(DIRECTIVE_NAME)).toBe(DIRECTIVE_VALUE)
  })

  it('should get first element with directive', () => {
    // given
    const elements = getElementsWithAnyDirective()
    const elementWithTestDirective = DOM_ELEMENTS[0]

    // when
    const elementWithDirective = getElementWithDirective(elements, DIRECTIVE_NAME)!

    // then
    expect(elementWithDirective.element.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(elementWithDirective.directives).toHaveLength(1)
    expect(elementWithDirective.directives.has(DIRECTIVE_NAME)).toBeTruthy()
    expect(elementWithDirective.directives.get(DIRECTIVE_NAME)).toBe(DIRECTIVE_VALUE)
  })

  it('should remove directive from element', () => {
    // given
    const element1 = createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    const element2 = createElementWithDirective(DIRECTIVE_NAME, DIRECTIVE_VALUE)

    DOM_ROOT.append(element1, element2)

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
    element.element.style.display = 'none'

    // when
    displayShowElement(element)

    // then
    expect(element.element.style.display).toBe('revert')
    expect(element.visible).toBeTruthy()
  })

  it('should hide element using CSS display property', () => {
    // given
    const elements = getElementsWithAnyDirective()

    const element = getElementsWithDirective(elements, DIRECTIVE_NAME)[0]
    element.element.style.display = 'block'

    // when
    displayHideElement(element)

    // then
    expect(element.element.style.display).toBe('none')
    expect(element.visible).toBeFalsy()
  })

  it('should replace template with element', () => {
    // given
    const template = document.createElement('template')
    template.setAttribute(DIRECTIVE_NAME, DIRECTIVE_VALUE)
    template.content.append(DOM_ELEMENTS[0])

    DOM_ROOT.prepend(template)

    const element = getElementsWithDirective(getElementsWithAnyDirective(), DIRECTIVE_NAME)[0]

    // when
    replaceTemplateWithElement(element)

    // then
    expect(element.element.isEqualNode(DOM_ELEMENTS[0])).toBeTruthy()
    expect(element.visible).toBeTruthy()
  })

  it('should replace element with template', () => {
    // given
    const element = getElementsWithDirective(getElementsWithAnyDirective(), DIRECTIVE_NAME)[0]

    // when
    replaceElementWithTemplate(element)

    // then
    const template = element.element as HTMLTemplateElement

    expect(template).instanceof(HTMLTemplateElement)
    expect(template.content.firstElementChild).not.toBeNull()
    expect(template.content.firstElementChild!.isEqualNode(DOM_ELEMENTS[0])).toBeTruthy()
    expect(template.content.firstElementChild!.hasAttribute('data-test')).toBeTruthy()
    expect(template.content.firstElementChild!.getAttribute('data-test')).toEqual('test')
    expect(element.visible).toBeFalsy()
  })
})

const createElementWithDirective = (directive: Directive, value: string): HTMLElement => {
  const element = document.createElement('div')
  element.setAttribute(directive, value)

  return element
}
