import { formDataToObject, isFormData, objectToFormData } from '@hairy/libcore'
import { pickByParams } from './utils'
import isPlainObject from 'lodash/isPlainObject'
import { AxiosStatic, AxiosInstance } from 'axios'

export interface FilterParamsOptions {
  /** 是否过滤请求头, 默认 false */
  header?: boolean
  /** 是否过滤请求体, 默认 true */
  data?: boolean
  /** 是否过滤请求参数, 默认 true */
  params?: boolean
  /** 是否过滤表单数据, 默认 true */
  formData?: boolean
  /** 是否深层过滤, 默认 false */
  deep?: boolean
}
/**
 * 根据过滤器, 过滤 body|params 参数
 * @param axios 实例
 * @param filters 过滤参数
 */
export const withFilterParams = (
  axios: AxiosStatic | AxiosInstance,
  filters: any[],
  option: FilterParamsOptions = {}
) => {
  const { header = false, data = true, params = true, deep = false, formData = true } = option
  axios.interceptors.request.use((config) => {
    if (header && isPlainObject(config.headers)) {
      config.headers = pickByParams(config.headers as any, filters, deep) as any
    }
    if (params && isPlainObject(config.params)) {
      config.params = pickByParams(config.params, filters, deep)
    }
    if (data && isPlainObject(config.data)) {
      config.data = pickByParams(config.data, filters, deep)
    }
    if (formData && isFormData(config.data)) {
      const transformObject = formDataToObject(config.data)
      const pickByObject = pickByParams(transformObject, filters)
      config.data = objectToFormData(pickByObject as Record<string, string>)
    }
    return config
  })
}
