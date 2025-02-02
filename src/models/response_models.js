export class ResponseModel {
  constructor(status, code, message, data) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
