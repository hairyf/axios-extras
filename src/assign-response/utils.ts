import type { Factory } from '../types'
import type { AssignResponseExpands } from './types'
import { isArray } from '@hairy/utils'

/**
 * Copy a property from source to target if it exists
 *
 * @param target - The object to copy the property to
 * @param source - The object to copy the property from
 * @param field - The property name in the source object
 * @param key - The property name to use in the target object (defaults to field)
 */
export function extend(target: any, source: any, field: string, key = field): void {
  if (typeof source[field] !== 'undefined')
    target[key] = source[field]
}

export function assign(response: Factory.Response, expands: AssignResponseExpands, data: any): void {
  // Skip if data is not an object or is an array
  if (!data || typeof data !== 'object' || Array.isArray(data))
    return

  // Skip if expands is an empty array
  if (!expands.length)
    return

  // Handle wildcard case - promote all properties
  if (expands === '*') {
    for (const key of Object.keys(data))
      extend(response, data, key)
    return
  }

  // Handle specific properties case
  for (const keys of expands) {
    const field = isArray(keys) ? keys[0] : keys // Source field in data
    const key = isArray(keys) ? keys[1] : keys // Target field in response
    extend(response, data, field, key)
  }
}
