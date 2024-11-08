class ApiError extends Error {
  statusCode: number;
  data: null | any;
  success: boolean;
  errors: string | any[];

  constructor(
    statusCode: number = 500,
    message: string | null = 'Something went wrong',
    errors: string | any[] = [],
    stack: string = ''
  ) {
    super(message ?? 'Something went wrong');
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
