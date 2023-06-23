import ts from 'typescript';
/**
 * Extract comment tags from a route node
 */
export declare class CommentTagExtractor {
    private _checker;
    constructor(_checker: ts.TypeChecker);
    /**
     *
     * When a route is defined with jsdoc tags, this extract all the tags defined.
     *
     * Example:
     *
     * Writing the following above a class in a jsdoc comment
     * ```ts
     * @description my route description
     * @consumes application/json
     * ```
     * Will result in { 'description': 'my route description', 'consumes': 'application/json' }
     *
     * @param routeNode An AST node which represents an user defined route
     * @returns an object containing {'tag': 'text'}
     */
    extractJsDocsTags(routeNode: ts.ClassDeclaration): Record<string, string>;
}
