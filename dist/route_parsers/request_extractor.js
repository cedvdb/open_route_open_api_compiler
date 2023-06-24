"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestExtractor = void 0;
const ts_json_schema_generator_1 = require("ts-json-schema-generator");
const typescript_1 = __importDefault(require("typescript"));
/** Extractor for an user defined request  */
class RequestExtractor {
    _tsconfig;
    constructor(_tsconfig) {
        this._tsconfig = _tsconfig;
    }
    /** extract body and query */
    extractRequestSchema(route) {
        const requestIdentifier = this._findRequestIdentifier(route);
        const sourceFileName = requestIdentifier.getSourceFile().fileName;
        const requestType = requestIdentifier.escapedText.toString();
        return this._buildRequestJsonSchema(requestType, sourceFileName);
    }
    /** find the request identifier by looking at the heritage clause.
     *
     * Example :
     * ```ts
     * class MyRoute extends Route<MyRequest, MyResponseBody>
     * ```
     * will find the identifier for MyRequest by looking at the
     * generic type arguments.
     */
    _findRequestIdentifier(route) {
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
        const request = expWithTypeArguments.typeArguments?.at(0);
        if (request && typescript_1.default.isTypeReferenceNode(request) && typescript_1.default.isIdentifier(request.typeName)) {
            return request.typeName;
        }
        throw new Error(`request identifier not found`);
    }
    /** build a json schema from the response type, using ts-json-schema-generator library */
    _buildRequestJsonSchema(requestType, sourceFileName) {
        const generator = (0, ts_json_schema_generator_1.createGenerator)({
            path: sourceFileName,
            type: requestType,
            expose: 'none',
            discriminatorType: 'open-api',
            additionalProperties: false,
            tsconfig: this._tsconfig,
        });
        const schema = generator.createSchema(requestType);
        const requestDefinition = (schema?.definitions || {})[requestType];
        if (!requestDefinition) {
            throw new Error(`no definition found for ${requestType} in schema`);
        }
        return requestDefinition;
    }
}
exports.RequestExtractor = RequestExtractor;
