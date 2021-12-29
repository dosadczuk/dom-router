/**
 * Check if given HTMLElement is HTMLTemplateElement (<template>).
 */
export const isHTMLTemplateElement = (element: HTMLElement): element is HTMLTemplateElement => {
  return element instanceof HTMLTemplateElement
}
