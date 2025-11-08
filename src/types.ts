/* eslint-disable ts/no-namespace */
const _Error = Error

/**
 * Type factory for axios or instances of axios class
 */
export namespace Factory {
  declare class Axios {
    constructor(config?: any)
    interceptors: {
      request: InterceptorManager<any>
      response: InterceptorManager<any>
    }

    [key: string]: any
  }

  export type ExtractResponse<T extends Factory.Instance> = Parameters<NonNullable<Parameters<T['interceptors']['response']['use']>[0]>>[0]
  export type ExtractConfig<T extends Factory.Instance> = Parameters<NonNullable<Parameters<T['interceptors']['request']['use']>[0]>>[0]

  export interface RequestConfig {
    [key: string]: any
  }

  export interface InterceptorManager<V> {
    use: (onFulfilled?: ((value: V) => V | Promise<V>) | null, onRejected?: ((error: any) => any) | null, options?: any) => number
    eject: (id: number) => void
    clear: () => void
  }

  export interface Instance extends Axios {
    [key: string]: any
    request: (config: RequestConfig) => Promise<any>
  }

  export interface Response<T = any> {
    [key: string]: any
    data: T
  }
  /**
   * Create an Error with the specified message, config, error code, request and response.
   */
  export class Error extends _Error {
    code?: string
    config?: any
    request?: any
    response?: any
    isAxiosError: boolean = true
    status?: number
    cause?: Error

    constructor(message?: string, code?: string, config?: any, request?: any, response?: any) {
      super(message)
      this.name = 'AxiosError'
      Error.captureStackTrace
        ? Error.captureStackTrace(this, this.constructor)
        : this.stack = new Error(message).stack
      this.code = code
      this.config = config
      this.request = request
      this.response = response
    }

    toJSON(): object {
      return {
        message: this.message,
        name: this.name,
        description: (this as any).description,
        number: (this as any).number,
        fileName: (this as any).fileName,
        lineNumber: (this as any).lineNumber,
        columnNumber: (this as any).columnNumber,
        stack: this.stack,
        config: this.config ? JSON.parse(JSON.stringify(this.config)) : undefined,
        code: this.code,
        status: this.response?.status ?? null,
      }
    }
  }

}
