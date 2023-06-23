import { JSONSchema7 } from 'json-schema';
import { PathItemObject } from 'openapi3-ts/oas31';
import { HttpMethod } from '../../route/http_method';
import { HttpPath } from '../../route/http_path';
import { FailureResponse } from '../../route/response';
/**
 * Generates open api files from various information.
 *
 * This class does not deal with AST parsing, it merely receive information
 * that it formats into open api format.
 */
export declare class OpenApiGenerator {
    /** generates the open api path part for a single route  */
    generateForPath(cfg: {
        path: HttpPath;
        method: HttpMethod;
        description: string;
        summary: string;
        consumes: string;
        produces: string;
        request: JSONSchema7;
        okResponse: JSONSchema7;
        failures: FailureResponse[];
    }): {
        [key: HttpPath]: PathItemObject;
    };
    /**
     * Gets the request.body if it's defined from the request json schema
     * @param requestJsonSchema the result of transpiling a request interface defined by the user into a json schema
     * @param mediaType the mediaType defined by the user in a [@consumes] comment tag. Defaults to application/json
     * and might be multipart/form-data for File uploads, or others.
     * @return the requestBody open api object
     */
    private _transformToRequestBodyOpenApiSchema;
    /**
     * Gets the request.query if it's defined from the request json schema
     * @param requestJsonSchema the result of transpiling a request interface defined by the user into a json schema
     * @returns the parameters open api object array
     */
    private _transformToParameterOpenApiSchema;
    /**
     * Transforms an ok response body into an openapi ResponseObject
     * @param responseBodyJsonSchema the result of transpiling a response body interface defined by the user into a json schema
     * @param produces the mediaType defined by the user in a [@produces] comment tag. Defaults to application/json.
     * @returns the response object for success
     */
    private _transformOkResponseBodyToOpenApi;
    /**
     * Transform FailureResponse[] into an open api ResponsesObject, eg { '400': { description: 'some failure' }}
     * @param failures The failures that might be returned by a route
     * @returns The open api responses for those failures
     */
    private _transformFailures;
}
