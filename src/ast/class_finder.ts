import ts from 'typescript';


export class ClassFinder {

  constructor(private program: ts.Program) { }

  /** extracts classes declaration which are not abstract */
  findClasses(): ts.ClassDeclaration[] {
    const classes: ts.ClassDeclaration[] = [];
    return this._findChildren(this.program)
      .filter(ts.isClassDeclaration)
      .filter((node) => !this._isAbstract(node));
  }

  private _findChildren(program: ts.Program) {
    const children: ts.Node[] = [];
    const sources = program.getSourceFiles()
      .filter((file) => !file.isDeclarationFile);

    for (let source of sources) {
      source.forEachChild((node) => {
        children.push(node);
      });
    }
    return children;
  }

  private _isAbstract(node: ts.ClassDeclaration) {
    const modifiers = node.modifiers;
    return modifiers?.some((modifier) => modifier.kind == ts.SyntaxKind.AbstractKeyword) || false;
  }
}