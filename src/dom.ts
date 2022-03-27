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
 * Return root's directive value.
 */
export const getRootDirective = (directive: Directive, defaultValue?: string): Nullable<string> => {
  return Root.getAttribute(String(directive)) ?? defaultValue
}

/**
 * Returns root's directives values.
 */
export const getRootDirectives = (directives: Directive[]): Nullable<string>[] => {
  return directives.map(directive => getRootDirective(directive))
}

/**
 * Checks if root has directive.
 */
export const hasRootDirective = (directive: Directive): boolean => {
  return Root.hasAttribute(String(directive))
}

/**
 * Removes root's directive.
 */
export const removeRootDirective = (directive: Directive): void => {
  Root.removeAttribute(String(directive))
}

/**
 * Removes root's directives.
 */
export const removeRootDirectives = (directives: Directive[]): void => {
  directives.forEach(directive => removeRootDirective(directive))
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
export const toggleViewWithMode = (mode: ToggleMode): ToggleElementVisibility => {
  return (element, visible) => {
    switch (mode) {
      case ToggleMode.Display:
        element.visible = visible
          ? displayShowElement(element)
          : displayHideElement(element)
        break

      case ToggleMode.Template:
        element.visible = visible
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

  return true
}

/**
 * Hide element using CSS display property.
 */
export const displayHideElement: HideElement = (element) => {
  element.element.style.display = 'none'

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
export type ToggleElementVisibility = (element: ElementWithDirectives, visible: boolean) => boolean

/**
 * Mount element in DOM.
 */
export type ShowElement = (element: ElementWithDirectives) => boolean

/**
 * Unmount element from DOM.
 */
export type HideElement = (element: ElementWithDirectives) => boolean
