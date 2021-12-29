import { dispatch } from '@router/events'
import { describe, expect, fn, it } from 'vitest'

describe('events', () => {

  it('should dispatch event', () => {
    // given
    const eventHandler = fn()
    const eventName = 'custom-event'
    const eventData = { test: 123 }

    // when
    document.addEventListener(eventName, eventHandler)
    dispatch(document, eventName, eventData)

    // then
    expect(eventHandler).toBeCalledTimes(1)
  })
})
