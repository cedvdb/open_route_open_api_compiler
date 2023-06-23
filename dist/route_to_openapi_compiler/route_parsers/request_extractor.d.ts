import ts from 'typescript';
import { JSONSchema7 } from 'json-schema';
/** Extractor for an user defined request  */
export declare class RequestExtractor {
    private _tsconfig?;
    constructor(_tsconfig?: string | undefined);
    /** extract body and query */
    extractRequestSchema(route: ts.ClassDeclaration): JSONSchema7;
    /** find the request identifier by looking at the heritage clause.
     *
     * Example :
     * ```ts
     * class MyRoute extends Route<MyRequest, MyResponseBody>
     * ```
     * will find the identifier for MyRequest by looking at the
     * generic type arguments.
     */
    private _findRequestIdentifier;
    /** build a json schema from the response type, using ts-json-schema-generator library */
    private _buildRequestJsonSchema;
}
