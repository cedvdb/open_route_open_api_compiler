"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethodExtractor = void 0;
const typescript_1 = __importDefault(require("typescript"));
/** extractor for the method property of a route */
class HttpMethodExtractor {
    /** gets the value of Route.method */
    extractHttpMethod(routeNode) {
        const methodDeclaration = routeNode.members.find((member) => this._isMethodProperty(member));
        const initializer = methodDeclaration?.initializer;
        // verify that we are using HttpMethod.get, HttpMethod.post, ...
        if (initializer && typescript_1.default.isPropertyAccessExpression(initializer)) {
            const method = initializer.name.escapedText.toString();
            return method;
        }
        throw new Error('http method not found');
    }
    _isMethodProperty(node) {
        if (typescript_1.default.isPropertyDeclaration(node) && typescript_1.default.isIdentifier(node.name)) {
            if (node.name.escapedText == 'method') {
                return true;
            }
        }
        return false;
    }
}
exports.HttpMethodExtractor = HttpMethodExtractor;
