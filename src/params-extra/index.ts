import type { Fn } from '@hairy/utils'
import type { Factory } from '../types'
import { assign } from './utils'

export type ExtraField = 'params' | 'data' | 'headers' | 'auth'
/**
 * Add extra parameters to requests
 *
 * This interceptor allows you to automatically include additional parameters
 * in every request, such as authentication tokens, API keys, or other common parameters.
 * The extra parameters can be provided as a static object or a function that returns
 * an object (useful for dynamic values like tokens from localStorage).
 *
 * @param axios - The Axios instance or static object to apply the interceptor to
 * @param field - The request field to add parameters to ('params', 'data', 'headers', or 'auth')
 * @param params - Object containing extra parameters or a function that returns such an object
 */
export function withParamsExtra(axios: Factory.Instance, field: ExtraField, params: object | Fn<object>): void {
  axios.interceptors.request.use((config) => {
    // Apply the assignment to the specified field
    assign(config, field, params)
    return config
  })
}
