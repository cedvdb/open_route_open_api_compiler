"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalErrorResponse = exports.FailureResponse = exports.RedirectResponse = exports.OkResponse = void 0;
/** A success response. Results in a 2XX status code */
class OkResponse {
    body;
    constructor(body) {
        this.body = body;
    }
}
exports.OkResponse = OkResponse;
/** A redirection. Results in a 3XX status code */
class RedirectResponse {
    url;
    constructor(url) {
        this.url = url;
    }
}
exports.RedirectResponse = RedirectResponse;
/** A failure response. Results in a 4XX status code */
class FailureResponse {
    code;
    failure;
    constructor(code, failure) {
        this.code = code;
        this.failure = failure;
    }
}
exports.FailureResponse = FailureResponse;
/** A internal error response. Results in a 5XX status code */
class InternalErrorResponse {
    error;
    constructor(error) {
        this.error = error;
    }
}
exports.InternalErrorResponse = InternalErrorResponse;
