import ts from 'typescript';
import { FailureResponse } from 'open_route';
/**
 * Analyze a route.handle method to return all failures that are returned by the method.
 */
export declare class FailuresExtractor {
    private _checker;
    constructor(_checker: ts.TypeChecker);
    /**
     * Analyze a route.handle method to return all failures that are returned by the method.
     * @param routeNode
     * @returns FailureResponse[]
     */
    extractFailuresSchema(routeNode: ts.ClassDeclaration): FailureResponse[];
    /** finds the handle method by looking at the node member which are method declaration with text 'handle' */
    private _findHandleMethod;
    /** analyzes the handle method to find the failures that are returned */
    private _findReturnedFailures;
    /** walk parts of the statement tree to get to the return statements */
    private _findReturnStatements;
    /** return new statements in return
     * case 1: return new X();
     * case 2: return a == true ? new X() : new Y();
     */
    private _findNewStatements;
}
