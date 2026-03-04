import { describe, expect, it } from 'vitest'
import { AxiosError } from './error'

describe('axiosError', () => {
  it('creates with message and optional args', () => {
    const err = new AxiosError('msg', 'CODE', { url: '/x' }, {}, { status: 404 })
    expect(err.message).toBe('msg')
    expect(err.name).toBe('AxiosError')
    expect(err.code).toBe('CODE')
    expect(err.config).toEqual({ url: '/x' })
    expect(err.response).toEqual({ status: 404 })
    expect(err.isAxiosError).toBe(true)
  })

  it('toJSON returns serializable object', () => {
    const config = { url: '/api' }
    const err = new AxiosError('fail', 'ERR', config, undefined, { status: 500 })
    const json = err.toJSON() as any
    expect(json.message).toBe('fail')
    expect(json.name).toBe('AxiosError')
    expect(json.code).toBe('ERR')
    expect(json.status).toBe(500)
    expect(json.config).toEqual(config)
  })

  it('toJSON with no config or response', () => {
    const err = new AxiosError('msg')
    const json = err.toJSON() as any
    expect(json.config).toBeUndefined()
    expect(json.status).toBeNull()
  })
})
