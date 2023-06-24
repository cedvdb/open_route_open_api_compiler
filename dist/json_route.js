"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountRoute = void 0;
const crypto_1 = require("crypto");
const open_route_1 = require("open_route");
/**
 * @summary Create an account
 */
class CreateAccountRoute {
    path = `/account`;
    method = open_route_1.HttpMethod.post;
    async handle(request) {
        if (request.body.age >= 18) {
            return new open_route_1.OkResponse({ id: (0, crypto_1.randomUUID)() });
        }
        else {
            return new open_route_1.FailureResponse(400, 'Must be 18 years old');
        }
    }
}
exports.CreateAccountRoute = CreateAccountRoute;
