import { isDirective, isHTMLTemplateElement } from '@router/asserts'
import type { ElementWithDirectives } from '@router/directives'
import { Directive, getDirectivesAsSelector } from '@router/directives'
import type { Nullable } from '@router/types'

export enum ToggleMode {
  Display = 'display',
  Template = 'template',
}

// -----------------------------------------------------------------------------
// -- Functions
// -----------------------------------------------------------------------------

/**
 * Router root element.
 */
let Root = document.documentElement

/**
 * Returns router root element.
 */
export const getRoot = () => Root

/**
 * Sets router root element.
 */
export const setRoot = (root: HTMLElement) => { Root = root }

/**
 * Return router root's children elements with directives.
 */
export const getElementsWithAnyDirective = (): ElementWithDirectives[] => {
  const elements = Root.querySelectorAll<HTMLElement>(getDirectivesAsSelector())
  if (elements.length === 0) {
    return []
  }

  return Array.from(elements, element => {
    const attributes = Array.from(element.attributes)
    const directives = new Map<Directive, string>()

    for (const { name, value } of attributes) {
      if (isDirective(name)) {
        directives.set(name, value)
      }
    }

    return {
      element,
      visible: false,
      directives,
    }
  })
}

/**
 * Returns elements with directive.
 */
export const getElementsWithDirective = (elements: ElementWithDirectives[], directive: Directive): ElementWithDirectives[] => {
  return elements.filter(element => element.directives.has(directive))
}

/**
 * Returns first element with directive.
 */
export const getElementWithDirective = (elements: ElementWithDirectives[], directive: Directive): Nullable<ElementWithDirectives> => {
  return elements.find(element => element.directives.has(directive)) ?? null
}

/**
 * Removes directive from elements.
 */
export const removeDirectiveFromElements = (elements: ElementWithDirectives[], directive: Directive) => {
  elements.forEach(({ element }) => { element.removeAttribute(directive) })
}

/**
 * Toggles elements visibility.
 */
export const toggleViewWithMode = (mode: ToggleMode): ToggleElementVisibility => {
  return (element, visible) => {
    switch (mode) {
      case ToggleMode.Display:
        visible
          ? displayShowElement(element)
          : displayHideElement(element)
        break

      case ToggleMode.Template:
        visible
          ? replaceTemplateWithElement(element)
          : replaceElementWithTemplate(element)
        break
    }

    return element.visible
  }
}

/**
 * Show element using CSS display property.
 */
export const displayShowElement: ShowElement = (element) => {
  element.element.style.display = 'revert'
  element.visible = true
}

/**
 * Hide element using CSS display property.
 */
export const displayHideElement: HideElement = (element) => {
  element.element.style.display = 'none'
  element.visible = false
}

/**
 * Show element replacing HTMLTemplateElement with Element.
 */
export const replaceTemplateWithElement: ShowElement = (element) => {
  const { element: elementToHide } = element

  if (!isHTMLTemplateElement(elementToHide)) {
    return // already shown
  }

  const elementToShow = elementToHide.content.firstElementChild as Nullable<HTMLElement>
  if (elementToShow == null) {
    return // nothing to replace with
  }

  element.element.replaceWith(elementToShow)
  element.element = elementToShow
  element.visible = true
}

/**
 * Hide element replacing Element with HTMLTemplateElement.
 */
export const replaceElementWithTemplate: HideElement = (element) => {
  const { element: elementToHide } = element

  if (isHTMLTemplateElement(elementToHide)) {
    return // already hidden
  }

  const elementToShow = document.createElement('template')
  elementToShow.content.append(elementToHide.cloneNode(true))

  element.element.replaceWith(elementToShow)
  element.element = elementToShow
  element.visible = false
}

/**
 * Applies classes to element.
 */
export const appendClassesToElement = (element: ElementWithDirectives, classes: string[]): void => {
  element.element.classList.add(...classes)
}

/**
 * Removes classes from element.
 */
export const removeClassesFromElement = (element: ElementWithDirectives, classes: string[]): void => {
  element.element.classList.remove(...classes)
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

/**
 * Mount/unmount element from DOM.
 */
export type ToggleElementVisibility = (element: ElementWithDirectives, visible: boolean) => boolean

/**
 * Mount element in DOM.
 */
export type ShowElement = (element: ElementWithDirectives) => void

/**
 * Unmount element from DOM.
 */
export type HideElement = (element: ElementWithDirectives) => void
