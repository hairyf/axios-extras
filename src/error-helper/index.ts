import type { Factory } from '../types'

/**
 * Global error handling interceptor for axios requests
 *
 * This interceptor provides centralized error handling for all axios requests.
 * It allows you to implement custom error handling logic, such as displaying error messages,
 * logging errors, or attempting recovery actions.
 *
 * The interceptor can be bypassed for specific requests by setting the handleError
 * option to false in the request config.
 *
 * @param axios - The Axios instance or static object to apply the interceptor to
 * @param rejected - Function that handles errors and optionally returns a value to resolve the promise
 */
export function withErrorHelper<T extends Factory.Instance>(axios: T, rejected: (error: any) => any): void {
  axios.interceptors.response.use(undefined, (error: Factory.Error) => {
    // Only handle errors if not explicitly disabled in the request config
    if (error.config?.handleError !== false) {
      const result = rejected(error)
      // If the handler returns a value, use it to resolve the promise
      if (result)
        return result
    }
    // Otherwise, continue with the error rejection
    return Promise.reject(error)
  })
}

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * Whether to apply global error handling to this request
     * Set to false to bypass the global error handler
     */
    handleError?: boolean
  }
}
