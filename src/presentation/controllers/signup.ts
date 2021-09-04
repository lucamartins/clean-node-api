import { MissingParamError } from '../errors/missing-param-error'
import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpReq: HttpRequest): HttpResponse {
    const requireFields = ['name', 'email']
    for (const field of requireFields) {
      if (!httpReq.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 1,
      body: {}
    }
  }
}
