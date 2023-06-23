"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountRoute = void 0;
const crypto_1 = require("crypto");
const __1 = require("../..");
/**
 * @summary Create an account
 */
class CreateAccountRoute extends __1.Route {
    path = `/account`;
    method = __1.HttpMethod.post;
    async handle(request) {
        if (request.body.age >= 18) {
            return new __1.OkResponse({ id: (0, crypto_1.randomUUID)() });
        }
        else {
            return new __1.FailureResponse(400, 'Must be 18 years old');
        }
    }
}
exports.CreateAccountRoute = CreateAccountRoute;
