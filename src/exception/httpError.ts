type errorCode = { code: string; message: string };

export class HttpException extends Error {
  status: number;
  errorDetails: errorCode;
  constructor(status: number, errorCode: errorCode, message?: string) {
    super(message);
    this.status = status;
    this.errorDetails = errorCode;
  }
}
