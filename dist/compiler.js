"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileOpenApiPaths = exports.compileOpenApiDocument = void 0;
const typescript_1 = __importDefault(require("typescript"));
const class_finder_1 = require("./ast/class_finder");
const route_finder_1 = require("./ast/route_finder");
const deepmerge_1 = __importDefault(require("deepmerge"));
const open_api_generator_1 = require("./open_api/open_api_generator");
const comment_extractor_1 = require("./route_parsers/comment_extractor");
const failure_responses_extractor_1 = require("./route_parsers/failure_responses_extractor");
const http_method_extractor_1 = require("./route_parsers/http_method_extractor");
const http_path_extractor_1 = require("./route_parsers/http_path_extractor");
const ok_response_body_extractor_1 = require("./route_parsers/ok_response_body_extractor");
const request_extractor_1 = require("./route_parsers/request_extractor");
/**
 * Compiles the open api document by analyzing the source code for routes.
 * @param mainFilepaths typescript entry point of app
 * @param baseDocument a base document can be provided which will be merged with
 * the paths found in the source code.
 * @returns an open api document
 */
function compileOpenApiDocument(mainFilepaths, tsconfig, baseDocument = { info: { title: 'App', version: '0.0.1' }, }) {
    const paths = compileOpenApiPaths(mainFilepaths, tsconfig);
    return (0, deepmerge_1.default)({ ...baseDocument, openapi: '3.0.0' }, { paths });
}
exports.compileOpenApiDocument = compileOpenApiDocument;
function compileOpenApiPaths(mainFilepaths, tsconfig) {
    let program = typescript_1.default.createProgram(mainFilepaths, {});
    let checker = program.getTypeChecker();
    // get all the extractor needed
    const classExtractor = new class_finder_1.ClassFinder(program);
    const routeExtractor = new route_finder_1.RouteFinder(checker);
    const requestExtractor = new request_extractor_1.RequestExtractor(tsconfig);
    const failureExtractor = new failure_responses_extractor_1.FailuresExtractor(checker);
    const okResponseExtractor = new ok_response_body_extractor_1.OkResponseBodyExtractor();
    const commentsExtractor = new comment_extractor_1.CommentTagExtractor(checker);
    const pathExtractor = new http_path_extractor_1.HttpPathExtractor();
    const methodExtractor = new http_method_extractor_1.HttpMethodExtractor();
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
        const routePathObject = new open_api_generator_1.OpenApiGenerator().generateForPath({
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
        paths = (0, deepmerge_1.default)(paths, routePathObject);
    }
    return paths;
}
exports.compileOpenApiPaths = compileOpenApiPaths;
