import { dispatch, dispatchTo, ExternalEvent, InternalEvent, subscribe, subscribeTo } from '../src/events'
import { describe, expect, fn, it } from 'vitest'

describe('events', () => {

  it('should dispatch an internal event', () => {
    // given
    const eventFn = fn()
    const eventName = InternalEvent.PageChange
    const eventData = { test: 123 }

    subscribe(eventName, eventFn)

    // when
    dispatch(eventName, eventData)

    // then
    expect(eventFn).toBeCalledTimes(1)
  })

  it('should dispatch an external event', () => {
    // given
    const eventFn = fn()
    const eventName = ExternalEvent.BeforeMount
    const eventData = { test: 123 }

    subscribeTo(document, eventName, eventFn)

    // when
    dispatchTo(document, eventName, eventData)

    // then
    expect(eventFn).toBeCalledTimes(1)
  })
})
