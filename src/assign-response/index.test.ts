import axios from 'axios'
import { withAssignResponse } from '.'

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'

describe('withAssignResponse', () => {
  it('assign all data to response', async () => {
    const http = axios.create()
    withAssignResponse(http, '*')
    const response = await http.get('/posts/1')
    expect(response.id).toBeTypeOf('number')
    expect(response.title).toBeTypeOf('string')
    expect(response.body).toBeTypeOf('string')
    expect(response.userId).toBeTypeOf('number')
  })

  it('assign part data to response', async () => {
    const http = axios.create()
    withAssignResponse(http, ['id', 'title'])
    const response = await http.get('/posts/1')
    expect(response.id).toBeTypeOf('number')
    expect(response.title).toBeTypeOf('string')
    expect(response.body).toBeTypeOf('undefined')
    expect(response.userId).toBeTypeOf('undefined')
  })

  it('change field', async () => {
    const http = axios.create()
    withAssignResponse(http, [['id', 'sid']])
    const response = await http.get('/posts/1')

    expect(response.id).toBeTypeOf('undefined')
    expect(response.sid).toBeTypeOf('number')
  })

  it('assigns on error.response when request fails', async () => {
    const http = axios.create()
    withAssignResponse(http, ['message'])
    let err: any
    try {
      await http.get('/posts/99999')
    }
    catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect(err?.response).toBeDefined()
  })
})

declare module 'axios' {
  interface AxiosResponse {
    [key: string]: any
  }
}
