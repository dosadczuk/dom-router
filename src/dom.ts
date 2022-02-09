import { isHTMLTemplateElement } from '@router/asserts'
import { getDirectivesAsSelector, isDirective } from '@router/directives'
import { Mode } from '@router/enums'
import type { ElementWithDirectives, HideElement, Nullable, ShowElement, ToggleElementVisibility } from '@router/types'

/**
 * Root HTMLElement. For now it's constant.
 */
export const root = document.documentElement

/**
 * Get value of given directive from root HTMLElement.
 */
export const getRootElementDirective = (directive: string): Nullable<string> => {
  return root.getAttribute(directive) ?? null
}

/**
 * Get values of given directives from root HTMLElement.
 */
export const getRootElementDirectives = (directives: string[]): Nullable<string>[] => {
  return directives.map(getRootElementDirective)
}

/**
 * Check if root HTMLElement contains given directive.
 */
export const hasRootElementDirective = (directive: string): boolean => {
  return root.hasAttribute(directive)
}

/**
 * Remove given directive from root HTMLElement.
 */
export const removeDirectiveFromRootElement = (directive: string): void => {
  root.removeAttribute(directive)
}

/**
 * Remove given directives from root HTMLElement.
 */
export const removeDirectivesFromRootElement = (directives: string[]): void => {
  directives.forEach(removeDirectiveFromRootElement)
}

/**
 * Get all HTMLElements with any directive.
 */
export const getElementsWithAnyDirective = (): ElementWithDirectives[] => {
  const elements = root.querySelectorAll<HTMLElement>(getDirectivesAsSelector())
  if (elements.length === 0) {
    return []
  }

  return Array.from(elements, element => {
    const attributes = Array.from(element.attributes)
    const directives = new Map<string, string>()

    for (const { name, value } of attributes) {
      if (isDirective(name)) {
        directives.set(name, value)
      }
    }

    return {
      content: element,
      visible: false,
      directives,
    }
  })
}

/**
 * Get HTMLElements with given directive.
 */
export const getElementsWithDirective = (elements: ElementWithDirectives[], directive: string): ElementWithDirectives[] => {
  return elements.filter(element => element.directives.has(directive))
}

/**
 * Get first HTMLElement of element with given directive.
 */
export const getFirstElementWithDirective = (elements: ElementWithDirectives[], directive: string): Nullable<ElementWithDirectives> => {
  return elements.find(element => element.directives.has(directive)) ?? null
}

/**
 * Remove given directive from elements.
 */
export const removeDirectiveFromElements = (elements: ElementWithDirectives[], directive: string): void => {
  elements.forEach(({ content: element }) => element.removeAttribute(directive))
}

/**
 * Toggle element visibility, depends on mode.
 */
export const changeViewWithMode = (mode: string): ToggleElementVisibility => {
  return (element, canBeVisible) => {
    switch (mode) {
      case Mode.Display: {
        return canBeVisible
          ? displayShowElement(element)
          : displayHideElement(element)
      }

      case Mode.Template: {
        return canBeVisible
          ? replaceTemplateWithElement(element)
          : replaceElementWithTemplate(element)
      }
    }

    return false
  }
}

/**
 * Show element using CSS display property.
 */
export const displayShowElement: ShowElement = (element) => {
  element.content.style.display = 'revert'
  element.visible = true

  return true
}

/**
 * Hide element using CSS display property.
 */
export const displayHideElement: HideElement = (element) => {
  element.content.style.display = 'none'
  element.visible = false

  return false
}

/**
 * Show element replacing HTMLTemplateElement with visible HTMLElement.
 */
export const replaceTemplateWithElement: ShowElement = (element) => {
  const { content: template } = element

  if (!isHTMLTemplateElement(template)) {
    return true // already shown
  }

  const content = template.content.firstElementChild as Nullable<HTMLElement>
  if (content == null) {
    return false // nothing to replace with
  }

  element.content.replaceWith(content)
  element.content = content
  element.visible = true

  return true
}

/**
 * Hide element replacing visible HTMLElement with HTMLTemplateElement.
 */
export const replaceElementWithTemplate: HideElement = (element) => {
  const { content } = element

  if (isHTMLTemplateElement(content)) {
    return false // already hidden
  }

  const template = document.createElement('template')
  template.content.append(content.cloneNode(true))

  element.content.replaceWith(template)
  element.content = template
  element.visible = false

  return false
}

/**
 * Append class names to HTMLElement.
 */
export const appendClassNamesToElement = (element: ElementWithDirectives, classNames: string[]): void => {
  element.content.classList.add(...classNames)
}

/**
 * Remove class names from HTMLElement.
 */
export const removeClassNamesFromElement = (element: ElementWithDirectives, classNames: string[]): void => {
  element.content.classList.remove(...classNames)
}
