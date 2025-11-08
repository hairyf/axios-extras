/**
 * Create an Error with the specified message, config, error code, request and response.
 */
export class AxiosError extends Error {
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
