import ts from 'typescript';
export declare class RouteFinder {
    private _checker;
    constructor(_checker: ts.TypeChecker);
    /** finds classes that extend Route */
    findRoutes(nodes: ts.ClassDeclaration[]): ts.ClassDeclaration[];
    private _hasRouteAncestor;
}
