import ts from 'typescript';
import { FailureResponse } from 'open_route';


/**
 * Analyze a route.handle method to return all failures that are returned by the method.
 */
export class FailuresExtractor {

  // match FailureResponse(4xx, "..."), or FailureResponse(4xx, '...')

  constructor(
    private _checker: ts.TypeChecker
  ) { }

  /**
   * Analyze a route.handle method to return all failures that are returned by the method.
   * @param routeNode 
   * @returns FailureResponse[]
   */
  extractFailuresSchema(routeNode: ts.ClassDeclaration): FailureResponse[] {
    const handleMethod = this._findHandleMethod(routeNode);
    if (handleMethod) {
      return this._findReturnedFailures(handleMethod);
    }
    return [];
  }

  /** finds the handle method by looking at the node member which are method declaration with text 'handle' */
  private _findHandleMethod(node: ts.ClassDeclaration): ts.MethodDeclaration | undefined {
    return node.members.find((member) => {
      if (ts.isMethodDeclaration(member) && ts.isIdentifier(member.name)) {
        if (member.name.escapedText == 'handle') {
          return member;
        }
      }
    }) as ts.MethodDeclaration | undefined;
  }

  /** analyzes the handle method to find the failures that are returned */
  private _findReturnedFailures(method: ts.MethodDeclaration): FailureResponse[] {
    if (!method.body) {
      return [];
    }
    const returnStatements = this._findReturnStatements(method.body.statements);
    // find the new X, since we want "new FailureResponse.."" 
    const newStatementsInReturn = this._findNewStatements(returnStatements);

    // keep only the return statement that return new FailureResponse
    const failures = newStatementsInReturn
      .filter((exp) => {
        return ts.isIdentifier(exp.expression) && exp.expression.escapedText == FailureResponse.name;
      })
      // map statement to failure
      .map((exp) => {
        // FailureResponse requires two arguments
        if (!exp.arguments || exp.arguments.length < 2) return undefined;
        const statusCodeArg = exp.arguments.at(0);
        const failureArg = exp.arguments.at(1);
        let code = 400;
        let failure = '';
        if (statusCodeArg && ts.isNumericLiteral(statusCodeArg)) {
          code = Number.parseInt(statusCodeArg.text);
        }
        // allows "string literal" or `template literal without substitution`
        if (failureArg && (ts.isStringLiteral(failureArg) || ts.isNoSubstitutionTemplateLiteral(failureArg))) {
          failure = failureArg.text;
        }
        return new FailureResponse(code, failure);
      })
      // remove undefined we introduced above
      .filter((failure) => !!failure) as FailureResponse[];

    return failures;
  }

  /** walk parts of the statement tree to get to the return statements */
  private _findReturnStatements(statements: ts.NodeArray<ts.Statement> | ts.Statement[]): ts.ReturnStatement[] {
    const returnStatements = [];

    for (let statement of statements) {
      if (ts.isReturnStatement(statement)) {
        returnStatements.push(statement);
      } else if (ts.isBlock(statement)) {
        returnStatements.push(...this._findReturnStatements(statement.statements));
      } else if (ts.isTryStatement(statement)) {
        returnStatements.push(...this._findReturnStatements(statement.tryBlock.statements));
        returnStatements.push(...this._findReturnStatements(statement.catchClause?.block.statements || []));
        returnStatements.push(...this._findReturnStatements(statement.finallyBlock?.statements || []));
      } else if (ts.isIfStatement(statement)) {
        returnStatements.push(...this._findReturnStatements([statement.thenStatement]));
        if (statement.elseStatement) {
          returnStatements.push(...this._findReturnStatements([statement.elseStatement]));
        }
      }
    }
    return returnStatements;
  }

  /** return new statements in return
   * case 1: return new X();
   * case 2: return a == true ? new X() : new Y();
   */
  private _findNewStatements(returnStatements: ts.ReturnStatement[]) {
    const newStatements = [];
    for (let statement of returnStatements) {
      const expression = statement.expression;
      if (!expression) {
        continue;
      }
      if (ts.isNewExpression(expression)) {
        newStatements.push(expression);
      } else if (ts.isConditionalExpression(expression)) {
        if (ts.isNewExpression(expression.whenTrue)) {
          newStatements.push(expression.whenTrue);
        }
        if (ts.isNewExpression(expression.whenFalse)) {
          newStatements.push(expression.whenFalse);
        }
      }
    }
    return newStatements;
  }

}