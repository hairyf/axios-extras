import type { Factory } from '../types'

export interface LoadingOptions {
  /**
   * @description Field name in config that triggers loading interceptor when its value exists
   * @default loading
   */
  fieldName?: string
}

export type RenderCallback<T extends Factory.Instance> = (config: Factory.ExtractConfig<T>) => void
export type VanishCallback<T extends Factory.Instance> = (config: Factory.ExtractConfig<T>, response?: Factory.ExtractResponse<T>, error?: any) => void

/**
 * Global loading indicator for axios requests
 *
 * This interceptor manages loading state for axios requests, showing a loading indicator
 * when requests are in progress and hiding it when all requests complete.
 * It tracks multiple concurrent requests and only shows/hides the indicator when the first
 * request starts and the last request completes.
 *
 * @param axios - The Axios instance or static object to apply the interceptor to
 * @param render - Callback function to render the loading indicator
 * @param vanish - Callback function to vanish the loading indicator
 * @param options - Configuration options for the loading helper
 */
export function withLoadingHelper<T extends Factory.Instance>(axios: T, render: RenderCallback<T>, vanish: VanishCallback<T>, options: LoadingOptions = {}): void {
  let subscribers = 0
  const fieldName = options.fieldName || 'loading'
  const isLoading = (config: any): boolean => !!config?.[fieldName]

  axios.interceptors.request.use((config) => {
    if (isLoading(config)) {
      !subscribers && render(config)
      subscribers++
    }
    return config
  })

  axios.interceptors.response.use(
    (response) => {
      if (isLoading(response.config)) {
        subscribers--
        !subscribers && vanish(response.config, response)
      }
      return response
    },
    (error) => {
      if (isLoading(error.config)) {
        subscribers--
        !subscribers && vanish(error.config, undefined, error)
      }
      return Promise.reject(error)
    },
  )
}

declare module 'axios' {
  interface AxiosRequestConfig {
    loading?: boolean
  }
}
