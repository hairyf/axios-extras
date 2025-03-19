import axios from 'axios'
import { withLoadingHelper } from '.'

const noop: (...args: any[]) => void = () => {}
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
})
