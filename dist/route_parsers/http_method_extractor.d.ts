import ts from 'typescript';
import { HttpMethod } from 'open_route';
/** extractor for the method property of a route */
export declare class HttpMethodExtractor {
    /** gets the value of Route.method */
    extractHttpMethod(routeNode: ts.ClassDeclaration): HttpMethod;
    private _isMethodProperty;
}
