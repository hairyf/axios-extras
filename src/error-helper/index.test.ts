import { describe, expect, it, vi } from 'vitest'
import { withErrorHelper } from '.'

describe('withErrorHelper', () => {
  it('registers response interceptor and handles error when handleError is not false', async () => {
    let capturedReject: (err: any) => any = () => {}
    const axios = {
      interceptors: {
        response: {
          use: vi.fn((_onFulfilled: any, onRejected: (err: any) => any) => {
            capturedReject = onRejected
            return 0
          }),
        },
      },
    }
    const rejected = vi.fn(() => undefined)
    withErrorHelper(axios as any, rejected)

    const err = { config: {}, message: 'fail' }
    await expect(capturedReject(err)).rejects.toEqual(err)
    expect(rejected).toHaveBeenCalledWith(err)
  })

  it('bypasses handler when config.handleError is false', async () => {
    let capturedReject: (err: any) => any = () => {}
    const axios = {
      interceptors: {
        response: {
          use: vi.fn((_onFulfilled: any, onRejected: (err: any) => any) => {
            capturedReject = onRejected
            return 0
          }),
        },
      },
    }
    const rejected = vi.fn()
    withErrorHelper(axios as any, rejected)

    const err = { config: { handleError: false }, message: 'fail' }
    await expect(capturedReject(err)).rejects.toEqual(err)
    expect(rejected).not.toHaveBeenCalled()
  })

  it('resolves with returned value when handler returns non-undefined', async () => {
    let capturedReject: (err: any) => any = () => {}
    const axios = {
      interceptors: {
        response: {
          use: vi.fn((_onFulfilled: any, onRejected: (err: any) => any) => {
            capturedReject = onRejected
            return 0
          }),
        },
      },
    }
    const resolvedValue = { data: 'recovered' }
    const rejected = vi.fn(() => resolvedValue)
    withErrorHelper(axios as any, rejected)

    const err = { config: {}, message: 'fail' }
    const result = await Promise.resolve(capturedReject(err))
    expect(result).toEqual(resolvedValue)
    expect(rejected).toHaveBeenCalledWith(err)
  })
})
