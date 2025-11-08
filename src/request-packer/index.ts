import type { Factory } from '../types'

/**
 * Function that intercepts and potentially modifies axios requests
 */
interface RequestPackerCaller<T extends Factory.Instance> {
  /**
   * @param config - The request configuration
   * @param request - The original axios request function
   * @returns The result of the request or a modified request
   */
  (config: Factory.ExtractConfig<T>, request: T['request']): any
}

/**
 * Wrap axios request methods with custom logic
 *
 * This utility allows you to intercept all axios requests before they are sent,
 * giving you the opportunity to modify the request, cancel it, or handle it in a custom way.
 * It's a foundation for other interceptors like caching or batching.
 *
 * @param axios - The Axios instance or static object to modify
 * @param caller - Function that will be called for each request
 */
export function withRequestPacker<T extends Factory.Instance>(axios: T, caller: RequestPackerCaller<T>): void {
  // Store the original request method
  const request = axios.request.bind(axios)

  // Replace the request method with our custom implementation
  axios.request = function (configOrUrl: any, config: any) {
    // - request(config)
    // - request(url, config)
    if (typeof configOrUrl === 'string') {
      config = config || {}
      config.url = configOrUrl
    }
    else {
      config = configOrUrl || {}
    }

    // Call the provided function with the normalized config and original request method
    // Fall back to the original request if the caller returns nothing
    return caller(config, request) || request(config)
  } as any
}
