import ts from 'typescript';
import { ClassFinder } from './ast/class_finder';
import { RouteFinder } from './ast/route_finder';

import deepMerge from 'deepmerge';
import { OpenAPIObject, PathsObject } from 'openapi3-ts/oas31';
import { OpenApiGenerator } from './open_api/open_api_generator';
import { CommentTagExtractor } from './route_parsers/comment_extractor';
import { FailuresExtractor } from './route_parsers/failure_responses_extractor';
import { HttpMethodExtractor } from './route_parsers/http_method_extractor';
import { HttpPathExtractor } from './route_parsers/http_path_extractor';
import { OkResponseBodyExtractor } from './route_parsers/ok_response_body_extractor';
import { RequestExtractor } from './route_parsers/request_extractor';


export type OpenApiBaseDocument = Omit<OpenAPIObject, 'openapi'>;


/**
 * Compiles the open api document by analyzing the source code for routes.
 * @param mainFilepaths typescript entry point of app 
 * @param baseDocument a base document can be provided which will be merged with 
 * the paths found in the source code.
 * @returns an open api document
 */
export function compileOpenApiDocument(
  mainFilepaths: string[],
  tsconfig?: string,
  baseDocument: OpenApiBaseDocument = { info: { title: 'App', version: '0.0.1' }, },
): OpenAPIObject {
  const paths = compileOpenApiPaths(mainFilepaths, tsconfig);
  return deepMerge({ ...baseDocument, openapi: '3.0.0' }, { paths });
}


export function compileOpenApiPaths(
  mainFilepaths: string[],
  tsconfig?: string,
): PathsObject {
  let program = ts.createProgram(mainFilepaths, {});
  let checker = program.getTypeChecker();
  // get all the extractor needed
  const classExtractor = new ClassFinder(program);
  const routeExtractor = new RouteFinder(checker);
  const requestExtractor = new RequestExtractor(tsconfig);
  const failureExtractor = new FailuresExtractor(checker);
  const okResponseExtractor = new OkResponseBodyExtractor();
  const commentsExtractor = new CommentTagExtractor(checker);
  const pathExtractor = new HttpPathExtractor();
  const methodExtractor = new HttpMethodExtractor();

  const classes = classExtractor.findClasses();
  const routes = routeExtractor.findRoutes(classes);
  let paths = {};
  for (let route of routes) {
    const comments = commentsExtractor.extractJsDocsTags(route);
    const request = requestExtractor.extractRequestSchema(route);
    const path = pathExtractor.extractPath(route);
    const httpMethod = methodExtractor.extractHttpMethod(route);
    const failures = failureExtractor.extractFailuresSchema(route);
    const okResponse = okResponseExtractor.extractOkResponseSchema(route);

    const routePathObject = new OpenApiGenerator().generateForPath({
      path: path,
      method: httpMethod,
      description: comments['description'] || '',
      summary: comments['summary'] || '',
      consumes: comments['consumes'] || 'application/json',
      produces: comments['produces'] || 'application/json',
      request,
      okResponse,
      failures,
    });
    // use deep merge because a single path could be targeted by different routes (using different HttpMethod)
    paths = deepMerge(paths, routePathObject);
  }
  return paths;
}




