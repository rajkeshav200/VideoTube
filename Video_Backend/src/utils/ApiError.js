class ApiError extends Error {
  constructor(
    statuscode,
    message = "something went wrong",
    stack = "",
    errors = []
  ) {
    super(message)
    this.data = null
    this.statuscode = statuscode
    this.message = message
    this.stack = stack
    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApiError