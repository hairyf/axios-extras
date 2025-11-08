/**
 * Check if a value is a FormData instance
 *
 * This utility function safely checks if a value is a FormData object,
 * which is only available in browser environments.
 *
 * @param value - The value to check
 * @returns True if the value is a FormData instance, false otherwise
 */

import type { Factory } from '../types'
import { isFormData } from '@hairy/utils'

export function assign(config: Factory.RequestConfig, path: string, params: object | (() => object)): Factory.RequestConfig | undefined {
  // Skip if the target is FormData (can't merge objects into FormData)
  if (isFormData(config[path]))
    return

  // Only proceed if the target is undefined or an object
  if (typeof config[path] === 'undefined' || typeof config[path] === 'object') {
    // Get parameters (evaluate function if params is a function)
    const option = typeof params === 'function' ? params() : params

    // Merge parameters with existing config, prioritizing existing values
    config[path] = { ...option, ...config[path] }
  }
}
