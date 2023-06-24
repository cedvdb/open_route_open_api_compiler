import ts from 'typescript';
import { HttpPath } from 'open_route';
/** extractor for the path property of a route */
export declare class HttpPathExtractor {
    /** gets the value of the Route.path property by analyzing the AST */
    extractPath(routeNode: ts.ClassDeclaration): HttpPath;
    private _isPathProperty;
}
