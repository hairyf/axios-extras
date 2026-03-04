import { describe, expect, it, vi } from 'vitest'
import { withRequestPacker } from '.'

describe('withRequestPacker', () => {
  it('calls caller with (config, request) for request(config)', async () => {
    const request = vi.fn((_config?: any) => Promise.resolve({ data: 1 }))
    const axios = { request }
    const caller = vi.fn((config: any, req: any) => {
      expect(config).toEqual({ url: '/a' })
      return req(config)
    })
    withRequestPacker(axios as any, caller)
    const result = await axios.request({ url: '/a' } as any)
    expect(result).toEqual({ data: 1 })
    expect(caller).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith({ url: '/a' })
  })

  it('normalizes request(url, config) to config with url', async () => {
    const request = vi.fn((_config?: any, _config2?: any) => Promise.resolve({ data: 2 }))
    const axios = { request }
    const caller = vi.fn((config: any, req: any) => req(config))
    withRequestPacker(axios as any, caller)
    await axios.request('/path', { method: 'GET' } as any)
    expect(caller).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/path', method: 'GET' }),
      expect.any(Function),
    )
  })

  it('returns caller result when caller returns value', async () => {
    const request = vi.fn((_config?: any) => Promise.resolve({ data: 3 }))
    const axios = { request }
    const customResult = { data: 'custom' }
    const caller = vi.fn(() => Promise.resolve(customResult))
    withRequestPacker(axios as any, caller)
    const result = await axios.request({ url: '/x' } as any)
    expect(result).toEqual(customResult)
    expect(request).not.toHaveBeenCalled()
  })
})
