import type { Optional } from '@router/types'

/**
 * Events to be emitted internally. For library usage only.
 */
export enum InternalEvent {
  PageChange,
  ViewChange
}

/**
 * Events to be emitted to the DOM. For library users only.
 */
export enum ExternalEvent {
  BeforeMount = 'router:before-mount',
  Mounted = 'router:mounted',

  BeforePageUpdate = 'router:before-page-update',
  PageUpdated = 'router:page-updated',

  BeforeViewUpdate = 'router:before-view-update',
  ViewUpdated = 'router:view-updated',
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
export const dispatch = (event: InternalEvent, data?: unknown): void => {
  EventBus.get(event)?.forEach(fn => fn(data))
}

// -----------------------------------------------------------------------------
// -- External events
// -----------------------------------------------------------------------------

/**
 * Subscribe to an external event with handler.
 */
export const subscribeTo = (target: EventTarget, event: ExternalEvent | string, fn: Subscriber): Unsubscriber => {
  target.addEventListener(String(event), fn)

  return () => {
    target.removeEventListener(String(event), fn)
  }
}

/**
 * Dispatch an external event with data.
 */
export const dispatchTo = (target: EventTarget, event: ExternalEvent | string, data?: unknown): void => {
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

    fn(event)
  }
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

/**
 * Payload sent with "view-updated" event.
 */
export type ViewUpdatedPayload = {
  /**
   * Matching route.
   */
  route: Optional<string>

  /**
   * Element visible for route.
   */
  element: Optional<HTMLElement>
}

/**
 * Event subscriber.
 */
type Subscriber = (data?: any) => void

/**
 * Event unsubscriber.
 */
type Unsubscriber = () => void
