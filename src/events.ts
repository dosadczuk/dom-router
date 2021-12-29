/**
 * Dispatch custom event on given content.
 */
export const dispatch = (element: Node, event: string, data?: any): void => {
  element.dispatchEvent(
    new CustomEvent(event, {
      detail: data,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  )
}
