import ts from 'typescript';
import { HttpMethod } from 'open_route';


/** extractor for the method property of a route */
export class HttpMethodExtractor {

  /** gets the value of Route.method */
  extractHttpMethod(routeNode: ts.ClassDeclaration) {
    const methodDeclaration = routeNode.members.find((member) => this._isMethodProperty(member)) as ts.PropertyDeclaration | undefined;
    const initializer = methodDeclaration?.initializer;
    // verify that we are using HttpMethod.get, HttpMethod.post, ...
    if (initializer && ts.isPropertyAccessExpression(initializer)) {
      const method = initializer.name.escapedText.toString();
      return method as HttpMethod;
    }
    throw new Error('http method not found');
  }

  private _isMethodProperty(node: ts.Node): boolean {
    if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name)) {
      if (node.name.escapedText == 'method') {
        return true;
      }
    }
    return false;
  }
}