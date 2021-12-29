import { getCurrentURL } from '@router/url'
import { beforeEach, describe, expect, it } from 'vitest'

describe('url', () => {

  const LOCATION_HREF = 'http://localhost:3000/'

  beforeEach(() => {
    global.window.location.href = LOCATION_HREF
  })

  it('should return current URL', () => {
    // when
    const url = getCurrentURL()

    // then
    expect(url.href).toEqual(LOCATION_HREF)
  })
})
