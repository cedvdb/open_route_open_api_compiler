import { randomUUID } from 'crypto';
import { FailureResponse, HandlerResponse, HttpMethod, OkResponse, Response, Route } from 'open_route';


export interface CreateAccountRequest {
  body: CreateAccountRequestBody;
}

export interface CreateAccountRequestBody {
  name: {
    firstname: string;
    lastname: string;
  },
  age: number;
}

export interface CreateAccountResponseBody {
  id: string;
}

/**
 * @summary Create an account
 */
export class CreateAccountRoute implements Route<CreateAccountRequest, CreateAccountResponseBody> {
  readonly path = `/account`;
  readonly method = HttpMethod.post;

  async handle(request: CreateAccountRequest): Promise<HandlerResponse<CreateAccountResponseBody>> {
    if (request.body.age >= 18) {
      return new OkResponse({ id: randomUUID() });
    } else {
      return new FailureResponse(400, 'Must be 18 years old');
    }
  }
}