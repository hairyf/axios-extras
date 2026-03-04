import { describe, expect, it, vi } from 'vitest'
import { withRequestCaches } from '.'

describe('withRequestCaches', () => {
  it('when cache disabled, passes through to request', async () => {
    const request = vi.fn((_config?: any) => Promise.resolve({ data: 1 }))
    const axios = { request }
    withRequestCaches(axios as any, {})
    const result = await axios.request({ url: '/a' } as any)
    expect(result).toEqual({ data: 1 })
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('when options.default true, caches by config (in-memory)', async () => {
    const request = vi.fn((_config?: any) => Promise.resolve({ data: 42 }))
    const axios = { request }
    withRequestCaches(axios as any, { default: true })
    const config = { url: '/same' }
    const r1 = await axios.request(config as any)
    const r2 = await axios.request(config as any)
    expect(r1).toEqual({ data: 42 })
    expect(r2).toEqual({ data: 42 })
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('when config.cache is true, enables caching for that request', async () => {
    const request = vi.fn((_config?: any) => Promise.resolve({ data: 99 }))
    const axios = { request }
    withRequestCaches(axios as any, {})
    const config = { url: '/x', cache: true }
    await axios.request(config as any)
    await axios.request(config as any)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('when local storage enabled, uses storage get/set', async () => {
    const stored: Record<string, string> = {}
    const storage = {
      getItem: vi.fn((k: string) => stored[k]),
      setItem: vi.fn((k: string, v: string) => { stored[k] = v }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }
    const request = vi.fn((_config?: any) => Promise.resolve({ data: 'from-network' }))
    const axios = { request }
    withRequestCaches(axios as any, { default: true, local: { enable: true, storage } })
    const config = { url: '/local' }
    const r1 = await axios.request(config as any)
    expect(r1).toEqual({ data: 'from-network' })
    expect(storage.setItem).toHaveBeenCalled()
    expect(request).toHaveBeenCalledTimes(1)
    const r2 = await axios.request(config as any)
    expect(storage.getItem).toHaveBeenCalled()
    expect(r2).toEqual({ data: 'from-network' })
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('when config.cache is object with local, merges storage', async () => {
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }
    const request = vi.fn((_config?: any) => Promise.resolve({ data: 1 }))
    const axios = { request }
    withRequestCaches(axios as any, { default: true })
    await axios.request({ url: '/y', cache: { local: { enable: true, storage } } } as any)
    expect(request).toHaveBeenCalledTimes(1)
  })
})
