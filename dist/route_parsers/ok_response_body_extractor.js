"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OkResponseBodyExtractor = void 0;
const ts_json_schema_generator_1 = require("ts-json-schema-generator");
const typescript_1 = __importDefault(require("typescript"));
/** Extractor for ok response body  */
class OkResponseBodyExtractor {
    constructor() { }
    /** extract response as a json schema */
    extractOkResponseSchema(route) {
        const responseBodyIdentifier = this._findResponseIdentifier(route);
        const responseBodyType = responseBodyIdentifier.escapedText.toString();
        const responseBodyFileName = responseBodyIdentifier.getSourceFile().fileName;
        const response = this._buildResponseJsonSchema(responseBodyType, responseBodyFileName);
        return response;
    }
    /** find the response identifier by looking at the heritage clause.
     *
     * Example :
     * ```ts
     * class MyRoute extends Route<MyRequest, MyResponseBody>
     * ```
     * will find the identifier for MyResponseBody by looking at the
     * generic type arguments.
     */
    _findResponseIdentifier(route) {
        const extended = route.heritageClauses?.at(0);
        if (!extended) {
            throw new Error(`A route must have Route in its ancestors`);
        }
        // verify generic
        const expWithTypeArguments = extended.types.at(0);
        if (!expWithTypeArguments || !typescript_1.default.isExpressionWithTypeArguments(expWithTypeArguments)) {
            throw new Error(`No generic parameter found`);
        }
        // extract generic, assuming the first one is the Request like on Route<Request, Response>
        // this is a false assumption as it's possible that it's not the case. However for a proof
        // of concept this is fine.
        const response = expWithTypeArguments.typeArguments?.at(1);
        if (response && typescript_1.default.isTypeReferenceNode(response) && typescript_1.default.isIdentifier(response.typeName)) {
            return response.typeName;
        }
        throw new Error(`response identifier not found`);
    }
    /** build a json schema from the response type, using ts-json-schema-generator library */
    _buildResponseJsonSchema(responseType, sourceFileName) {
        const generator = (0, ts_json_schema_generator_1.createGenerator)({
            path: sourceFileName,
            type: responseType,
            expose: 'none',
            discriminatorType: 'open-api',
        });
        const schema = generator.createSchema(responseType);
        const responseDefinition = (schema?.definitions || {})[responseType];
        if (!responseDefinition) {
            throw new Error(`no definition found for ${responseType} in schema`);
        }
        return responseDefinition;
    }
}
exports.OkResponseBodyExtractor = OkResponseBodyExtractor;
