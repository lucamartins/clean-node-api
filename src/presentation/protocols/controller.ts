import { HttpResponse, HttpRequest } from './http'

export interface Controller {
  handle: (httpReq: HttpRequest) => HttpResponse
}
