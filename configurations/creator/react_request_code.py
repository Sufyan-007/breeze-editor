
REQUEST = """

// ready to use
export class ApiError extends Error {
    constructor(request, response, message) {
      super(message)
  
      this.name = "ApiError"
      this.url = response.url
      this.status = response.status
      this.statusText = response.statusText
      this.body = response.body
      this.request = request
    }
  }
  /* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export class CancelError extends Error {
    constructor(message) {
      super(message)
      this.name = "CancelError"
    }
  
    get isCancelled() {
      return true
    }
  }
  
export class CancelablePromise {
  #isResolved
  #isRejected
  #isCancelled
  #cancelHandlers
  #promise
  #resolve
  #reject

  constructor(executor) {
    this.#isResolved = false
    this.#isRejected = false
    this.#isCancelled = false
    this.#cancelHandlers = []
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve
      this.#reject = reject

      const onResolve = value => {
        if (this.#isResolved || this.#isRejected || this.#isCancelled) {
          return
        }
        this.#isResolved = true
        this.#resolve?.(value)
      }

      const onReject = reason => {
        if (this.#isResolved || this.#isRejected || this.#isCancelled) {
          return
        }
        this.#isRejected = true
        this.#reject?.(reason)
      }

      const onCancel = cancelHandler => {
        if (this.#isResolved || this.#isRejected || this.#isCancelled) {
          return
        }
        this.#cancelHandlers.push(cancelHandler)
      }

      Object.defineProperty(onCancel, "isResolved", {
        get: () => this.#isResolved
      })

      Object.defineProperty(onCancel, "isRejected", {
        get: () => this.#isRejected
      })

      Object.defineProperty(onCancel, "isCancelled", {
        get: () => this.#isCancelled
      })

      return executor(onResolve, onReject, onCancel)
    })
  }

  get [Symbol.toStringTag]() {
    return "Cancellable Promise"
  }

  then(onFulfilled, onRejected) {
    return this.#promise.then(onFulfilled, onRejected)
  }

  catch(onRejected) {
    return this.#promise.catch(onRejected)
  }

  finally(onFinally) {
    return this.#promise.finally(onFinally)
  }

  cancel() {
    if (this.#isResolved || this.#isRejected || this.#isCancelled) {
      return
    }
    this.#isCancelled = true
    if (this.#cancelHandlers.length) {
      try {
        for (const cancelHandler of this.#cancelHandlers) {
          cancelHandler()
        }
      } catch (error) {
        console.warn("Cancellation threw an error", error)
        return
      }
    }
    this.#cancelHandlers.length = 0
    this.#reject?.(new CancelError("Request aborted"))
  }

  get isCancelled() {
    return this.#isCancelled
  }
}
  
  // ready to use
  export const isDefined = value => {
    return value !== undefined && value !== null
  }

  // ready to use
  export const isString = value => {
    return typeof value === "string"
  }
  
  // ready to use
  export const isStringWithValue = value => {
    return isString(value) && value !== ""
  }
  
  // ready to use
  export const isBlob = value => {
    return (
      typeof value === "object" &&
      typeof value.type === "string" &&
      typeof value.stream === "function" &&
      typeof value.arrayBuffer === "function" &&
      typeof value.constructor === "function" &&
      typeof value.constructor.name === "string" &&
      /^(Blob|File)$/.test(value.constructor.name) &&
      /^(Blob|File)$/.test(value[Symbol.toStringTag])
    )
  }
  
  // ready to use
  export const isFormData = value => {
    return value instanceof FormData
  }
  
  // ready to use
  export const base64 = str => {
    try {
      return btoa(str)
    } catch (err) {
      // @ts-ignore
      return Buffer.from(str).toString("base64")
    }
  }
  
  export const getQueryString = params => {
    const qs = []
  
    const append = (key, value) => {
      qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    }
  
    const process = (key, value) => {
      if (isDefined(value)) {
        if (Array.isArray(value)) {
          value.forEach(v => {
            process(key, v)
          })
        } else if (typeof value === "object") {
          Object.entries(value).forEach(([k, v]) => {
            process(`${key}[${k}]`, v)
          })
        } else {
          append(key, value)
        }
      }
    }
  
    Object.entries(params).forEach(([key, value]) => {
      process(key, value)
    })
  
    if (qs.length > 0) {
      return `?${qs.join("&")}`
    }
  
    return ""
  }
  
  const getUrl = ( options) => {
    
    let url = `http://localhost:8000${options.url}`
    if (options.query) {
      return `${url}${getQueryString(options.query)}`
    }
    if (options.path) {
      let obj = options.path;
      for(let key in obj){
        url = url.replace(`{${key}}`,obj[key])
      } 
      
      return `${url}`
    }
    return url
  }
  
  // ready to use
  export const getFormData = options => {
    if (options.formData) {
      const formData = new FormData()
  
      const process = (key, value) => {
        if (isString(value) || isBlob(value)) {
          formData.append(key, value)
        } else {
          formData.append(key, JSON.stringify(value))
        }
      }
  
      Object.entries(options.formData)
        .filter(([_, value]) => isDefined(value))
        .forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => process(key, v))
          } else {
            process(key, value)
          }
        })
  
      return formData
    }
    return undefined
  }

  // ready to use
  export const resolve = async (options, resolver) => {
    if (typeof resolver === "function") {
      return resolver(options)
    }
    return resolver
  }
  
  // ready to use
  export const getHeaders = async ( options) => {
    const token =  options.TOKEN
    const username =  options.USERNAME
    const password =  options.PASSWORD
    const additionalHeaders =  options.HEADERS
  
    const headers = Object.entries({
      Accept: "application/json",
      ...additionalHeaders
    })
      .filter(([_, value]) => isDefined(value))
      .reduce(
        (headers, [key, value]) => ({
          ...headers,
          [key]: String(value)
        }),
        {}
      )
  
    if (isStringWithValue(token)) {
      headers["Authorization"] = `Bearer ${token}`
    }
  
    if (isStringWithValue(username) && isStringWithValue(password)) {
      const credentials = base64(`${username}:${password}`)
      headers["Authorization"] = `Basic ${credentials}`
    }
  
    if (options.body) {
      if (options.mediaType) {
        headers["Content-Type"] = options.mediaType
      } else if (isBlob(options.body)) {
        headers["Content-Type"] = options.body.type || "application/octet-stream"
      } else if (isString(options.body)) {
        headers["Content-Type"] = "text/plain"
      } else if (!isFormData(options.body)) {
        headers["Content-Type"] = "application/json"
      }
    }
  
    return new Headers(headers)
  }
  
  // ready to use
  export const getRequestBody = options => {
    if (options.body !== undefined) {
      if (options.mediaType?.includes("/json")) {
        return JSON.stringify(options.body)
      } else if (
        isString(options.body) ||
        isBlob(options.body) ||
        isFormData(options.body)
      ) {
        return options.body
      } else {
        return JSON.stringify(options.body)
      }
    }
    return undefined
  }
  
  // look for AbortController
  // ready to use
  export const sendRequest = async (
    options,
    url,
    body,
    formData,
    headers,
    onCancel
  ) => {
    const controller = new AbortController()
  
    const request = {
      headers,
      body: body ?? formData,
      method: options.method,
      signal: controller.signal
    }
  
    if (options.WITH_CREDENTIALS) {
      request.credentials = options.CREDENTIALS
    }
  
    onCancel(() => controller.abort())
  
    return await fetch(url, request)
  }
  
  // ready to use
  export const catchErrorCodes = (options, result) => {
    const errors = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
      ...options.errors
    }
  
    const error = errors[result.status]
    if (error) {
      throw new ApiError(options, result, error)
    }
  
    if (!result.ok) {
      const errorStatus = result.status ?? "unknown"
      const errorStatusText = result.statusText ?? "unknown"
      const errorBody = () => {
        try {
          return JSON.stringify(result.body, null, 2)
        } catch (e) {
          return undefined
        }
      }
  
      throw new ApiError(
        options,
        result,
        `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`
      )
    }
  }
  
  // ready to use
  export const getResponseHeader = (response, responseHeader) => {
    if (responseHeader) {
      const content = response.headers.get(responseHeader)
      if (isString(content)) {
        return content
      }
    }
    return undefined
  }
  
  // ready to use
  export const getResponseBody = async response => {
    if (response.status !== 204) {
      try {
        const contentType = response.headers.get("Content-Type")
        if (contentType) {
          const jsonTypes = ["application/json", "application/problem+json"]
          const isJSON = jsonTypes.some(type =>
            contentType.toLowerCase().startsWith(type)
          )
          if (isJSON) {
            return await response.json()
          } else {
            return await response.text()
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    return undefined
  }
  

export const request = ( options) => {
    return new CancelablePromise(async (resolve, reject, onCancel) => {
      try {
        const url = getUrl( options)
        const formData = getFormData(options)
        const body = getRequestBody(options)
        const headers = await getHeaders( options)
  
        if (!onCancel.isCancelled) {
          const response = await sendRequest(
            options,
            url,
            body,
            formData,
            headers,
            onCancel
          )
          const responseBody = await getResponseBody(response)
          const responseHeader = getResponseHeader(
            response,
            options.responseHeader
          )
  
          const result = {
            url,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            body: responseHeader ?? responseBody
          }
  
          catchErrorCodes(options, result)
  
          resolve(result.body)
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  

"""