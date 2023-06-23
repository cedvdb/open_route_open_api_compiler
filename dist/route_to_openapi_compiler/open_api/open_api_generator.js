"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiGenerator = void 0;
/**
 * Generates open api files from various information.
 *
 * This class does not deal with AST parsing, it merely receive information
 * that it formats into open api format.
 */
class OpenApiGenerator {
    /** generates the open api path part for a single route  */
    generateForPath(cfg) {
        const requestBody = this._transformToRequestBodyOpenApiSchema(cfg.request, cfg.consumes);
        const parameters = this._transformToParameterOpenApiSchema(cfg.request);
        const okResponseSchema = this._transformOkResponseBodyToOpenApi(cfg.okResponse, cfg.produces);
        const failuresResponsesSchema = this._transformFailures(cfg.failures);
        return {
            // /my-route
            [cfg.path]: {
                // get
                [cfg.method]: {
                    summary: cfg.summary,
                    description: cfg.description,
                    requestBody,
                    parameters,
                    responses: {
                        // 200: { ... }
                        ...okResponseSchema,
                        // 400: { ... }
                        ...failuresResponsesSchema,
                    }
                }
            },
        };
    }
    /**
     * Gets the request.body if it's defined from the request json schema
     * @param requestJsonSchema the result of transpiling a request interface defined by the user into a json schema
     * @param mediaType the mediaType defined by the user in a [@consumes] comment tag. Defaults to application/json
     * and might be multipart/form-data for File uploads, or others.
     * @return the requestBody open api object
     */
    _transformToRequestBodyOpenApiSchema(requestJsonSchema, mediaType) {
        const bodySchema = requestJsonSchema.properties?.body;
        // return nothing if no body schema was provided
        if (!bodySchema) {
            return;
        }
        // if any property is a file set it up accordingly
        const bodyProperties = bodySchema.properties;
        if (bodyProperties) {
            Object.keys(bodyProperties).forEach((key) => {
                const prop = bodyProperties[key];
                if (prop.format == 'binary') {
                    prop.type = 'string';
                    delete prop.properties;
                    delete prop.required;
                }
            });
        }
        // request schema has a required: ['body'] property
        const isBodyRequired = requestJsonSchema.required?.includes('body') || false;
        const requestBodyObject = {
            required: isBodyRequired,
            content: {
                [mediaType]: {
                    schema: bodySchema
                }
            }
        };
        return requestBodyObject;
    }
    /**
     * Gets the request.query if it's defined from the request json schema
     * @param requestJsonSchema the result of transpiling a request interface defined by the user into a json schema
     * @returns the parameters open api object array
     */
    _transformToParameterOpenApiSchema(requestJsonSchema) {
        const querySchema = requestJsonSchema.properties?.query;
        if (!querySchema) {
            return undefined;
        }
        return Object.entries(querySchema.properties || []).map(([name, jsonSchema]) => ({
            // currently only support query
            in: 'query',
            name: name,
            description: jsonSchema.description,
            example: jsonSchema.example,
            examples: jsonSchema.examples,
            required: querySchema.required?.includes(name),
            schema: {
                type: jsonSchema.type,
                format: jsonSchema.format,
            }
        }));
    }
    /**
     * Transforms an ok response body into an openapi ResponseObject
     * @param responseBodyJsonSchema the result of transpiling a response body interface defined by the user into a json schema
     * @param produces the mediaType defined by the user in a [@produces] comment tag. Defaults to application/json.
     * @returns the response object for success
     */
    _transformOkResponseBodyToOpenApi(responseBodyJsonSchema, produces) {
        return {
            // currently the return code is fixed to 200, but that will have to change in the future
            '200': {
                description: responseBodyJsonSchema.description || 'ok',
                content: {
                    [produces]: {
                        schema: responseBodyJsonSchema,
                    }
                }
            }
        };
    }
    /**
     * Transform FailureResponse[] into an open api ResponsesObject, eg { '400': { description: 'some failure' }}
     * @param failures The failures that might be returned by a route
     * @returns The open api responses for those failures
     */
    _transformFailures(failures) {
        const failuresResponsesSchema = {};
        for (let response of failures) {
            failuresResponsesSchema[response.code.toString()] = { description: response.failure };
        }
        return failuresResponsesSchema;
    }
}
exports.OpenApiGenerator = OpenApiGenerator;
