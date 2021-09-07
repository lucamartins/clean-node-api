import { MissingParamError } from '../errors/missing-param-error'
import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpReq: HttpRequest): HttpResponse {
    const requireFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requireFields) {
      if (!httpReq.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    // Validar email
    const emailIsValid = this.emailValidator.isValid(httpReq.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return {
      statusCode: 1,
      body: {}
    }
  }
}
