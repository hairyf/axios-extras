

import axios from 'axios'
import { withExtraParams } from '.'

axios.defaults['baseURL'] = 'https://jsonplaceholder.typicode.com'

describe('withExtraParams', () => {
  it('extra params', async () => {
    const http = axios.create()
    withExtraParams(http, { aaa: '123' }, 'params')
    const v = await http.get('/albums')
    expect(v.config.params).toEqual({ aaa: '123' })
  })
  it('extra headers', async () => {
    const http = axios.create()
    withExtraParams(http, { aaa: '123' }, 'headers')
    const v = await http.get('/albums')
    expect(v.config.headers?.['aaa']).toEqual('123')
  })
  it('extra data', async () => {
    const http = axios.create()
    withExtraParams(http, { aaa: '123' }, 'data')
    const v = await http.get('/albums')
    expect(JSON.parse(v.config.data)).toEqual({ aaa: '123' })
  })
  it('extra *', async () => {
    const http = axios.create()
    withExtraParams(http, { aaa: '123' }, '*')
    const v = await http.get('/albums')
    expect(v.config.params).toEqual({ aaa: '123' })
    expect(v.config.headers?.['aaa']).toEqual('123')
    expect(JSON.parse(v.config.data)).toEqual({ aaa: '123' })
  })
})
