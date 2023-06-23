import ts from 'typescript';


export class RouteFinder {

  constructor(
    private _checker: ts.TypeChecker
  ) { }

  /** finds classes that extend Route */
  findRoutes(nodes: ts.ClassDeclaration[]) {
    return nodes.filter((node) => this._hasRouteAncestor(node));
  }

  private _hasRouteAncestor(node: ts.ClassDeclaration): boolean {
    const heritageClauses = node.heritageClauses || [];
    for (let heritage of heritageClauses) {
      // heritage has child nodes of [extends, Type]
      const extended = heritage.types.at(0);
      // check that we are inheriting from a class using generics
      if (extended != undefined && ts.isExpressionWithTypeArguments(extended) && ts.isIdentifier(extended.expression)) {
        const isRoute = extended.expression.escapedText == 'Route' || false;
        if (isRoute) { return true; }
        // check ancestors
        // get the symbol for the extended class
        let symbol = this._checker.getSymbolAtLocation(extended.expression);
        const superDeclaration = symbol?.declarations?.at(0);
        if (superDeclaration && ts.isClassDeclaration(superDeclaration)) {
          const isAncestorRoute = this._hasRouteAncestor(superDeclaration);
          if (isAncestorRoute) {
            return true;
          }
        }
      }
    }
    return false;
  }
}