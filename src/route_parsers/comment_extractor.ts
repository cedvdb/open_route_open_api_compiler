import ts from 'typescript';



/**
 * Extract comment tags from a route node
 */
export class CommentTagExtractor {

  constructor(
    private _checker: ts.TypeChecker,
  ) { }

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
  extractJsDocsTags(routeNode: ts.ClassDeclaration): Record<string, string> {
    if (routeNode.name) {
      let symbol = this._checker.getSymbolAtLocation(routeNode.name);
      const tags = symbol?.getJsDocTags()
        .map((tag) => ({ name: tag.name, text: tag.text?.at(0)?.text })) || [];
      const accumulator: Record<string, string> = {};
      for (let tag of tags) {
        accumulator[tag.name] = tag.text || '';
      }
      return accumulator;
    }
    return {};
  }

}