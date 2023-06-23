import { HttpMethod, Route, Response } from '../..';
export interface CreateAccountRequest {
    body: CreateAccountRequestBody;
}
export interface CreateAccountRequestBody {
    name: {
        firstname: string;
        lastname: string;
    };
    age: number;
}
export interface CreateAccountResponseBody {
    id: string;
}
/**
 * @summary Create an account
 */
export declare class CreateAccountRoute extends Route<CreateAccountRequest, CreateAccountResponseBody> {
    readonly path = "/account";
    readonly method = HttpMethod.post;
    handle(request: CreateAccountRequest): Promise<Response<CreateAccountResponseBody>>;
}
