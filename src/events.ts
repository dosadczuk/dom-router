/**
 * Events to be emitted internally. For library usage only.
 */
export enum InternalEvent {
  PageChanged,
  ViewChanged
}

/**
 * Events to be emitted to the DOM. For library users only.
 */
export enum ExternalEvent {
  BeforeMount = 'router:before-mount',
  Mounted = 'router:mounted',

  BeforeUpdate = 'router:before-update',
  Updated = 'router:updated',
}

// -----------------------------------------------------------------------------
// -- Internal events
// -----------------------------------------------------------------------------

const EventBus = new Map<InternalEvent, Set<Subscriber>>()

/**
 * Subscribe to an internal event with handler.
 */
export const subscribe = (event: InternalEvent, fn: Subscriber): Unsubscriber => {
  if (!EventBus.has(event)) {
    EventBus.set(event, new Set())
  }

  EventBus.get(event)!.add(fn)

  return () => {
    EventBus.get(event)!.delete(fn)
  }
}

/**
 * Dispatch an internal event with data.
 */
export const dispatch = <T = unknown>(event: InternalEvent, data?: T): void => {
  EventBus.get(event)?.forEach(fn => fn(data))
}

// -----------------------------------------------------------------------------
// -- External events
// -----------------------------------------------------------------------------

/**
 * Subscribe to an external event with handler.
 */
export const subscribeTo = (target: EventTarget, event: ExternalEvent, fn: Subscriber): Unsubscriber => {
  target.addEventListener(String(event), fn)

  return () => {
    target.removeEventListener(String(event), fn)
  }
}

/**
 * Dispatch an external event with data.
 */
export const dispatchTo = <T = unknown>(target: EventTarget, event: ExternalEvent, data?: T): void => {
  target.dispatchEvent(
    new CustomEvent(String(event), {
      detail: data,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  )
}

// -----------------------------------------------------------------------------
// -- Event helpers
// -----------------------------------------------------------------------------

/**
 * Prevent default behavior of an event and stop propagation.
 */
export const prevent = (fn: EventListener): EventListener => {
  return event => {
    event.preventDefault()
    event.stopPropagation()

    fn(event)
  }
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

/**
 * Event subscriber.
 */
export type Subscriber = <T>(data?: T) => void

/**
 * Event unsubscriber.
 */
export type Unsubscriber = () => void
