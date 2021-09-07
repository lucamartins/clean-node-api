import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

// Essa funcao factory vai facilitar quando tivermos dependencias injetadas na classe
// Obs: sem a funcao makeSut() teriamos que instanciar as depencias em todos testes
// Stub: duble de teste, fixa-se um retorno a uma funcao (eh um tipo de MOCK)

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()

    const httpReq = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpRes = sut.handle(httpReq)
    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const httpReq = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpRes = sut.handle(httpReq)
    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const httpRes = sut.handle(httpReq)
    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()

    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpRes = sut.handle(httpReq)
    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpReq = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpRes = sut.handle(httpReq)
    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new InvalidParamError('email'))
  })
})
