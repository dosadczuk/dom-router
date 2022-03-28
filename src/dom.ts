import { isDirective, isHTMLTemplateElement } from '@router/asserts'
import type { ElementWithDirectives } from '@router/directives'
import { Directive, getDirectivesAsSelector } from '@router/directives'
import type { Nullable } from '@router/types'

export enum ToggleMode {
  Display = 'display',
  Template = 'template',
}

// -----------------------------------------------------------------------------
// -- Definition
// -----------------------------------------------------------------------------

/**
 * Router root element.
 */
let Root: HTMLElement = document.body

/**
 * Returns router root element.
 */
export const getRoot = (): HTMLElement => Root

/**
 * Sets router root element.
 */
export const setRoot = (root: HTMLElement) => { Root = root }

/**
 * Returns document's directive value.
 */
export const getDocumentDirective = (directive: Directive, defaultValue?: string): Nullable<string> => {
  return document.documentElement.getAttribute(String(directive)) ?? defaultValue
}

/**
 * Returns document's directives values.
 */
export const getDocumentDirectives = (directives: Directive[]): Nullable<string>[] => {
  return directives.map(directive => getDocumentDirective(directive))
}

/**
 * Checks if document has directive.
 */
export const hasDocumentDirective = (directive: Directive): boolean => {
  return document.documentElement.hasAttribute(String(directive))
}

/**
 * Removes document's directive.
 */
export const removeDocumentDirective = (directive: Directive): void => {
  document.documentElement.removeAttribute(String(directive))
}

/**
 * Removes document's directives.
 */
export const removeDocumentDirectives = (directives: Directive[]): void => {
  directives.forEach(directives => removeDocumentDirective(directives))
}

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
export const toggleViewWithMode = (mode: ToggleMode): ToggleView => {
  return (element, visible) => {
    switch (mode) {
      case ToggleMode.Display:
        return visible
          ? displayShowElement(element)
          : displayHideElement(element)

      case ToggleMode.Template:
        return visible
          ? replaceTemplateWithElement(element)
          : replaceElementWithTemplate(element)
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

  return true
}

/**
 * Hide element using CSS display property.
 */
export const displayHideElement: HideElement = (element) => {
  element.element.style.display = 'none'
  element.visible = false

  return false
}

/**
 * Show element replacing HTMLTemplateElement with Element.
 */
export const replaceTemplateWithElement: ShowElement = (element) => {
  const { element: elementToHide } = element

  if (!isHTMLTemplateElement(elementToHide)) {
    return true // already shown
  }

  const elementToShow = elementToHide.content.firstElementChild as Nullable<HTMLElement>
  if (elementToShow == null) {
    return false // nothing to replace with
  }

  element.element.replaceWith(elementToShow)
  element.element = elementToShow
  element.visible = true

  return true
}

/**
 * Hide element replacing Element with HTMLTemplateElement.
 */
export const replaceElementWithTemplate: HideElement = (element) => {
  const { element: elementToHide } = element

  if (isHTMLTemplateElement(elementToHide)) {
    return false // already hidden
  }

  const elementToShow = document.createElement('template')
  elementToShow.content.append(elementToHide.cloneNode(true))

  element.element.replaceWith(elementToShow)
  element.element = elementToShow
  element.visible = false

  return false
}

/**
 * Applies classes to element.
 */
export const appendClassNameToElement = (element: ElementWithDirectives, classes: string[]): void => {
  element.element.classList.add(...classes)
}

/**
 * Removes classes from element.
 */
export const removeClassNameFromElement = (element: ElementWithDirectives, classes: string[]): void => {
  element.element.classList.remove(...classes)
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

/**
 * Mount/unmount element from DOM.
 */
export type ToggleView = (element: ElementWithDirectives, visible: boolean) => boolean

/**
 * Mount element in DOM.
 */
type ShowElement = (element: ElementWithDirectives) => boolean

/**
 * Unmount element from DOM.
 */
type HideElement = (element: ElementWithDirectives) => boolean
