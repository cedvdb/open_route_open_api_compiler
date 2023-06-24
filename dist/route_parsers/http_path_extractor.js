"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpPathExtractor = void 0;
const typescript_1 = __importDefault(require("typescript"));
/** extractor for the path property of a route */
class HttpPathExtractor {
    /** gets the value of the Route.path property by analyzing the AST */
    extractPath(routeNode) {
        const pathDeclaration = routeNode.members.find((member) => this._isPathProperty(member));
        const initializer = pathDeclaration?.initializer;
        if (initializer && typescript_1.default.isTemplateExpression(initializer)) {
            throw new Error('template literals are not currently supported for path');
        }
        if (initializer && (typescript_1.default.isStringLiteral(initializer) || typescript_1.default.isNoSubstitutionTemplateLiteral(initializer))) {
            const path = initializer.text;
            if (!path || !path.startsWith('/')) {
                throw new Error('invalid path');
            }
            return path;
        }
        throw new Error('path not found');
    }
    _isPathProperty(node) {
        if (typescript_1.default.isPropertyDeclaration(node) && typescript_1.default.isIdentifier(node.name)) {
            if (node.name.escapedText == 'path') {
                return true;
            }
        }
        return false;
    }
}
exports.HttpPathExtractor = HttpPathExtractor;
