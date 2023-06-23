import ts from 'typescript';
import { HttpPath } from 'open_route';


/** extractor for the path property of a route */
export class HttpPathExtractor {

  /** gets the value of the Route.path property by analyzing the AST */
  extractPath(routeNode: ts.ClassDeclaration): HttpPath {
    const pathDeclaration = routeNode.members.find((member) => this._isPathProperty(member)) as ts.PropertyDeclaration | undefined;
    const initializer = pathDeclaration?.initializer;
    if (initializer && ts.isTemplateExpression(initializer)) {
      throw new Error('template literals are not currently supported for path');
    }
    if (initializer && (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer))) {
      const path = initializer.text
      if (!path || !path.startsWith('/')) {
        throw new Error('invalid path');
      }
      return path as HttpPath;
    }
    throw new Error('path not found');
  }

  private _isPathProperty(node: ts.Node): boolean {
    if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name)) {
      if (node.name.escapedText == 'path') {
        return true;
      }
    }
    return false;
  }
}