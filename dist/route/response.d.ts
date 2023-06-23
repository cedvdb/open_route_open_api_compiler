export type Response<T> = OkResponse<T> | FailureResponse | InternalErrorResponse | RedirectResponse;
/** A success response. Results in a 2XX status code */
export declare class OkResponse<T> {
    readonly body: T;
    constructor(body: T);
}
/** A redirection. Results in a 3XX status code */
export declare class RedirectResponse {
    readonly url: string;
    constructor(url: string);
}
/** A failure response. Results in a 4XX status code */
export declare class FailureResponse {
    readonly code: number;
    readonly failure: string;
    constructor(code: number, failure: string);
}
/** A internal error response. Results in a 5XX status code */
export declare class InternalErrorResponse {
    readonly error: any;
    constructor(error: any);
}
