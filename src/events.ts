import type { Subscriber, Unsubscriber } from '@router/types'

const EventBus = new Map<string, Set<Subscriber>>()

/**
 * Subscribe to internal event.
 */
export const subscribe = (event: string, handler: Subscriber): Unsubscriber => {
  if (!EventBus.has(event)) {
    EventBus.set(event, new Set())
  }

  EventBus.get(event)!.add(handler)

  return () => {
    if (EventBus.has(event)) {
      EventBus.get(event)!.delete(handler)
    }
  }
}

/**
 * Dispatch internal event.
 */
export const dispatch = (event: string, data?: any): void => {
  EventBus.get(event)?.forEach(handler => handler(data))
}

/**
 * Subscribe to external event with given handler.
 */
export const subscribeToElement = (element: EventTarget, event: string, handler: EventListener): Unsubscriber => {
  element.addEventListener(event, handler)

  return () => {
    element.removeEventListener(event, handler)
  }
}

/**
 * Dispatch external event with given data.
 */
export const dispatchToElement = (element: EventTarget, event: string, data?: any): void => {
  element.dispatchEvent(
    new CustomEvent(event, {
      detail: data,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  )
}

/**
 * Handle prevented event.
 */
export const prevented = (handler: EventListener): EventListener => {
  return (event: Event): void => {
    event.preventDefault()

    handler(event)
  }
}
