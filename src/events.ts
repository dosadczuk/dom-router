export enum Event {
  Initialize = 'router:initialize',
  Initialized = 'router:initialized',

  PageChange = 'router:page-change',
  PageChanged = 'router:page-changed',
  ViewChanged = 'router:view-changed'
}

type Subscriber = EventListenerOrEventListenerObject;
type Unsubscriber = () => void;

/**
 * Subscribe to custom event with given handler.
 */
export const subscribe = (element: EventTarget, event: string, handler: Subscriber): Unsubscriber => {
  element.addEventListener(event, handler)

  return () => {
    element.removeEventListener(event, handler)
  }
}

/**
 * Dispatch custom event on given content.
 */
export const dispatch = (element: EventTarget, event: string, data?: any): void => {
  element.dispatchEvent(
    new CustomEvent(event, {
      detail: data,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  )
}
