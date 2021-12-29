/**
 * Dispatch custom event on given element.
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
