import { OpenAPIObject, PathsObject } from 'openapi3-ts/oas31';
export type OpenApiBaseDocument = Omit<OpenAPIObject, 'openapi'>;
/**
 * Compiles the open api document by analyzing the source code for routes.
 * @param mainFilepaths typescript entry point of app
 * @param baseDocument a base document can be provided which will be merged with
 * the paths found in the source code.
 * @returns an open api document
 */
export declare function compileOpenApiDocument(mainFilepaths: string[], tsconfig?: string, baseDocument?: OpenApiBaseDocument): OpenAPIObject;
export declare function compileOpenApiPaths(mainFilepaths: string[], tsconfig?: string): PathsObject;
