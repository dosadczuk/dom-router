import { dispatch, dispatchToElement, subscribe } from '@router/events'
import { describe, expect, fn, it } from 'vitest'

describe('events', () => {

  it('should dispatch internal event', () => {
    // given
    const eventHandler = fn()
    const eventName = 'custom-event'
    const eventData = { test: 123 }

    subscribe(eventName, eventHandler)

    // when
    dispatch(eventName, eventData)

    // then
    expect(eventHandler).toBeCalledTimes(1)
  })

  it('should dispatch external event', () => {
    // given
    const eventHandler = fn()
    const eventName = 'custom-event'
    const eventData = { test: 123 }

    document.addEventListener(eventName, eventHandler)

    // when
    dispatchToElement(document, eventName, eventData)

    // then
    expect(eventHandler).toBeCalledTimes(1)
  })
})
