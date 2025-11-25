import type { Factory } from '../types'
import { formdataToObject, isFormData, isPlainObject, objectToFormdata } from '@hairy/utils'
import { pickByParams } from './utils'

export type FilterField = 'params' | 'data' | 'headers' | 'formData'

export interface FilterParamsOptions {
  /** Whether to filter request headers, default false */
  headers?: boolean
  /** Whether to filter request body, default true */
  data?: boolean
  /** Whether to filter request parameters, default true */
  params?: boolean
  /** Whether to filter form data, default true */
  formData?: boolean
  /** Whether to perform deep filtering, default false */
  deep?: boolean
}

/**
 * Filter request parameters based on specified filters
 *
 * This interceptor removes unwanted values from request parameters, headers, and body
 * based on the provided filter array. It can process regular objects, nested objects,
 * and FormData objects.
 *
 * @param axios - The Axios instance or static object to apply the interceptor to
 * @param field - The request field to filter parameters from ('params', 'data', 'headers', or 'auth')
 * @param filters - Array of values to be filtered out from requests
 * @param option - Configuration options for filtering behavior
 */
export function withParamsFilter(
  axios: Factory.Instance,
  field: ('*' | FilterField | FilterField[]),
  filters: any[],
  option: FilterParamsOptions = {},
): void {
  const fields = field === '*'
    ? ['params', 'data', 'headers', 'formData'] as FilterField[]
    : Array.isArray(field) ? field : [field]
  const deep = option.deep ?? false

  axios.interceptors.request.use((config) => {
    // Filter headers if enabled and headers is a plain object
    if (fields.includes('headers') && isPlainObject(config.headers)) {
      config.headers = pickByParams(config.headers as any, filters, deep) as any
    }

    // Filter URL parameters if enabled and params is a plain object
    if (fields.includes('params') && isPlainObject(config.params)) {
      config.params = pickByParams(config.params, filters, deep)
    }

    // Filter request body if enabled and data is a plain object
    if (fields.includes('data') && isPlainObject(config.data)) {
      config.data = pickByParams(config.data, filters, deep)
    }

    // Filter FormData if enabled and data is FormData
    if (fields.includes('formData') && isFormData(config.data)) {
      const transformObject = formdataToObject(config.data)
      const pickByObject = pickByParams(transformObject, filters)
      config.data = objectToFormdata(pickByObject as Record<string, string>)
    }

    return config
  })
}
