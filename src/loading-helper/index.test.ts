import _axios from 'axios'
import { withLoadingHelper } from '.'

const noop: (...args: any[]) => void = () => {}
const axios = _axios as any
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'

describe('withLoadingHelper', () => {
  it('show loading call.', async () => {
    const http = axios.create()
    let count = 0
    withLoadingHelper(http, () => count++, noop)

    await http.get('/albums', { loading: true })
    expect(count).toEqual(1)
  })
  it('hide loading call.', async () => {
    const http = axios.create()
    let count = 0
    withLoadingHelper(http, noop, () => count++)

    await http.get('/albums', { loading: true })
    expect(count).toEqual(1)
  })
  it('many times loading call.', async () => {
    const https = axios.create()
    let showCount = 0
    let hideCount = 0
    withLoadingHelper(
      https,
      () => showCount++,
      () => hideCount++,
    )

    await Promise.all([
      https.get('/albums', { loading: true }),
      https.get('/albums', { loading: true }),
      https.get('/albums', { loading: true }),
    ])

    expect(showCount).toBe(1)
    expect(hideCount).toBe(1)
  })

  it('calls vanish on request error when loading is true', async () => {
    const http = axios.create()
    let vanishCalls = 0
    let lastError: any
    withLoadingHelper(
      http,
      () => {},
      (_config, _response, error) => {
        vanishCalls++
        lastError = error
      },
    )
    try {
      await http.get('/nonexistent-404-path-xyz', { loading: true })
    }
    catch {
      // expected
    }
    expect(vanishCalls).toBe(1)
    expect(lastError).toBeDefined()
  })
})
