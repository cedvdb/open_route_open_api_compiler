import ts from 'typescript';
import { JSONSchema7 } from 'json-schema';
/** Extractor for ok response body  */
export declare class OkResponseBodyExtractor {
    constructor();
    /** extract response as a json schema */
    extractOkResponseSchema(route: ts.ClassDeclaration): JSONSchema7;
    /** find the response identifier by looking at the heritage clause.
     *
     * Example :
     * ```ts
     * class MyRoute extends Route<MyRequest, MyResponseBody>
     * ```
     * will find the identifier for MyResponseBody by looking at the
     * generic type arguments.
     */
    private _findResponseIdentifier;
    /** build a json schema from the response type, using ts-json-schema-generator library */
    private _buildResponseJsonSchema;
}
