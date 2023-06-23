"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailuresExtractor = void 0;
const typescript_1 = __importDefault(require("typescript"));
const open_route_1 = require("open_route");
/**
 * Analyze a route.handle method to return all failures that are returned by the method.
 */
class FailuresExtractor {
    _checker;
    // match FailureResponse(4xx, "..."), or FailureResponse(4xx, '...')
    constructor(_checker) {
        this._checker = _checker;
    }
    /**
     * Analyze a route.handle method to return all failures that are returned by the method.
     * @param routeNode
     * @returns FailureResponse[]
     */
    extractFailuresSchema(routeNode) {
        const handleMethod = this._findHandleMethod(routeNode);
        if (handleMethod) {
            return this._findReturnedFailures(handleMethod);
        }
        return [];
    }
    /** finds the handle method by looking at the node member which are method declaration with text 'handle' */
    _findHandleMethod(node) {
        return node.members.find((member) => {
            if (typescript_1.default.isMethodDeclaration(member) && typescript_1.default.isIdentifier(member.name)) {
                if (member.name.escapedText == 'handle') {
                    return member;
                }
            }
        });
    }
    /** analyzes the handle method to find the failures that are returned */
    _findReturnedFailures(method) {
        if (!method.body) {
            return [];
        }
        const returnStatements = this._findReturnStatements(method.body.statements);
        // find the new X, since we want "new FailureResponse.."" 
        const newStatementsInReturn = this._findNewStatements(returnStatements);
        // keep only the return statement that return new FailureResponse
        const failures = newStatementsInReturn
            .filter((exp) => {
            return typescript_1.default.isIdentifier(exp.expression) && exp.expression.escapedText == open_route_1.FailureResponse.name;
        })
            // map statement to failure
            .map((exp) => {
            // FailureResponse requires two arguments
            if (!exp.arguments || exp.arguments.length < 2)
                return undefined;
            const statusCodeArg = exp.arguments.at(0);
            const failureArg = exp.arguments.at(1);
            let code = 400;
            let failure = '';
            if (statusCodeArg && typescript_1.default.isNumericLiteral(statusCodeArg)) {
                code = Number.parseInt(statusCodeArg.text);
            }
            // allows "string literal" or `template literal without substitution`
            if (failureArg && (typescript_1.default.isStringLiteral(failureArg) || typescript_1.default.isNoSubstitutionTemplateLiteral(failureArg))) {
                failure = failureArg.text;
            }
            return new open_route_1.FailureResponse(code, failure);
        })
            // remove undefined we introduced above
            .filter((failure) => !!failure);
        return failures;
    }
    /** walk parts of the statement tree to get to the return statements */
    _findReturnStatements(statements) {
        const returnStatements = [];
        for (let statement of statements) {
            if (typescript_1.default.isReturnStatement(statement)) {
                returnStatements.push(statement);
            }
            else if (typescript_1.default.isBlock(statement)) {
                returnStatements.push(...this._findReturnStatements(statement.statements));
            }
            else if (typescript_1.default.isTryStatement(statement)) {
                returnStatements.push(...this._findReturnStatements(statement.tryBlock.statements));
                returnStatements.push(...this._findReturnStatements(statement.catchClause?.block.statements || []));
                returnStatements.push(...this._findReturnStatements(statement.finallyBlock?.statements || []));
            }
            else if (typescript_1.default.isIfStatement(statement)) {
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
    _findNewStatements(returnStatements) {
        const newStatements = [];
        for (let statement of returnStatements) {
            const expression = statement.expression;
            if (!expression) {
                continue;
            }
            if (typescript_1.default.isNewExpression(expression)) {
                newStatements.push(expression);
            }
            else if (typescript_1.default.isConditionalExpression(expression)) {
                if (typescript_1.default.isNewExpression(expression.whenTrue)) {
                    newStatements.push(expression.whenTrue);
                }
                if (typescript_1.default.isNewExpression(expression.whenFalse)) {
                    newStatements.push(expression.whenFalse);
                }
            }
        }
        return newStatements;
    }
}
exports.FailuresExtractor = FailuresExtractor;
