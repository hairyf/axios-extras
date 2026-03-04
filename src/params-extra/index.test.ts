import _axios from 'axios'
import { withParamsExtra } from '.'

const axios = _axios as any
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'

describe('withParamsExtra', () => {
  it('extra params', async () => {
    const http = axios.create()
    withParamsExtra(http, 'params', { aaa: '123' })
    const v = await http.get('/albums')
    expect(v.config.params).toEqual({ aaa: '123' })
  })
  it('extra headers', async () => {
    const http = axios.create()
    withParamsExtra(http, 'headers', { aaa: '123' })
    const v = await http.get('/albums')
    expect(v.config.headers?.aaa).toEqual('123')
  })
  it('extra data', async () => {
    const http = axios.create()
    withParamsExtra(http, 'data', { aaa: '123' })
    const v = await http.get('/albums')
    expect(JSON.parse(v.config.data)).toEqual({ aaa: '123' })
  })
})
