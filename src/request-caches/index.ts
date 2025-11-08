import type { Factory } from '../types'
import { asyncCacheFn, stableStringify } from 'async-cache-fn'
import { withRequestPacker } from '../request-packer'

export interface CacheLocalOptions {
  /** Whether to enable local storage caching */
  enable?: boolean
  /** Storage implementation to use (defaults to localStorage) */
  storage?: Storage
}

export interface RequestCacheOptions {
  /** Whether to enable caching by default for all requests */
  default?: boolean
  /** Configuration for local storage caching */
  local?: boolean | CacheLocalOptions
}

export type RequestCacheConfig = boolean | { local?: boolean | CacheLocalOptions }

/**
 * Cache identical axios requests to improve performance
 *
 * This interceptor caches responses from identical requests to avoid unnecessary
 * network traffic. It can cache in memory and optionally in localStorage for
 * persistence across page reloads.
 *
 * @param axios - The Axios instance or static object to apply the interceptor to
 * @param options - Configuration options for request caching behavior
 */
export function withRequestCaches(axios: Factory.Instance, options: RequestCacheOptions = {}): void {
  // Map to store cached request functions
  const cacheFuncs = new Map()

  // Use request packer to intercept requests
  withRequestPacker(axios, (config, request) => {
    // Parse cache configuration from options and request config
    const { enable, storage } = parseCacheConfig(options, config.cache)

    // Skip caching if disabled
    if (!enable)
      return request(config)

    // Create a stable string key from the request config
    const cacheKey = stableStringify(config)

    // Check local storage cache if enabled
    if (storage) {
      const value = storage.getItem(cacheKey)
      if (value)
        return JSON.parse(value)
    }

    // Create or retrieve cached request function
    if (!cacheFuncs.has(cacheKey)) {
      // Create new cached function for this request
      const fn = asyncCacheFn(request)
      cacheFuncs.set(cacheKey, fn)
      request = fn as any
    }
    else {
      // Use existing cached function
      request = cacheFuncs.get(cacheKey)
    }

    // Execute the request
    const promise = request(config)

    // Store result in local storage if enabled
    if (storage) {
      promise.then((v) => {
        storage.setItem(cacheKey, JSON.stringify(v))
      })
    }

    return promise
  })
}

/**
 * Parse and merge cache configuration from default options and request config
 *
 * @param defaultConfig - Default cache options
 * @param config - Request-specific cache configuration
 * @returns Object with enable flag and optional storage
 */
function parseCacheConfig(defaultConfig: RequestCacheOptions = {}, config?: RequestCacheConfig): any {
  let enable = false
  let storage: Storage | undefined

  if (config || defaultConfig.default)
    enable = true
  else
    return { enable }

  if (defaultConfig.local) {
    const conf = parseLocalConfig(defaultConfig.local)
    storage = conf.enable ? conf.storage : storage
  }

  if (typeof config === 'object') {
    const conf = parseLocalConfig(config.local)
    storage = conf.enable ? conf.storage : storage
  }

  return { enable, storage }
}

/**
 * Parse local storage configuration
 *
 * @param local - Local storage configuration
 * @returns Object with enable flag and storage implementation
 */
function parseLocalConfig(local?: boolean | CacheLocalOptions): any {
  let storage: Storage | undefined
  let enable = false

  if (typeof local === 'object') {
    storage = local.storage
    enable = !!local.enable
  }

  if (local === true) {
    storage = localStorage
    enable = true
  }

  return { storage, enable }
}

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * Request caching configuration
     * - true to enable in-memory caching
     * - Object with local property to configure localStorage caching
     */
    cache?: RequestCacheConfig
  }
}
