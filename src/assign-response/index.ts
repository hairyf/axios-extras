import type { Factory } from '../types'
import type { AssignResponseExpands } from './types'
import { assign } from './utils'

/**
 * Merge response data properties into the response object based on expansion rules
 *
 * This interceptor allows you to promote specific properties from the response data
 * to the top level of the response object for easier access. Due to execution order,
 * withAssignResponse should be called first before other interceptors.
 *
 * After using this interceptor, you may need to extend the AxiosResponse type
 * with your own declarations to properly type the added properties.
 *
 * @param axios - The Axios instance or static object to apply the interceptor to
 * @param expands - Configuration for which properties to promote:
 *                  - '*' to promote all properties from response.data
 *                  - Array of property names to promote specific properties
 *                  - Array of [sourceField, targetField] tuples to rename properties when promoting
 */
export function withAssignResponse<T extends Factory.Instance>(axios: T, expands: AssignResponseExpands): void {
  // Apply to successful responses
  axios.interceptors.response.use(
    (response) => {
      assign(response, expands, response.data)
      return response
    },
    (error) => {
      // Also apply to error responses if they have data
      assign(error.response, expands, error.response?.data)
      return Promise.reject(error)
    },
  )
}
