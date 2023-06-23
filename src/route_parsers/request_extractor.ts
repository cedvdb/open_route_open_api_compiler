import { createGenerator } from 'ts-json-schema-generator';
import ts from 'typescript';


import { JSONSchema7 } from 'json-schema';


/** Extractor for an user defined request  */
export class RequestExtractor {

  constructor(
    private _tsconfig?: string,
  ) { }


  /** extract body and query */
  extractRequestSchema(route: ts.ClassDeclaration): JSONSchema7 {
    const requestIdentifier = this._findRequestIdentifier(route);
    const sourceFileName = requestIdentifier.getSourceFile().fileName;
    const requestType = requestIdentifier.escapedText.toString();
    return this._buildRequestJsonSchema(requestType, sourceFileName);
  }

  /** find the request identifier by looking at the heritage clause.
   * 
   * Example :
   * ```ts
   * class MyRoute extends Route<MyRequest, MyResponseBody>
   * ```
   * will find the identifier for MyRequest by looking at the 
   * generic type arguments.
   */
  private _findRequestIdentifier(route: ts.ClassDeclaration): ts.Identifier {
    const extended = route.heritageClauses?.at(0);
    if (!extended) {
      throw new Error(`A route must have Route in its ancestors`);
    }
    // verify generic
    const expWithTypeArguments = extended.types.at(0);
    if (!expWithTypeArguments || !ts.isExpressionWithTypeArguments(expWithTypeArguments)) {
      throw new Error(`No generic parameter found`);
    }
    // extract generic, assuming the first one is the Request like on Route<Request, Response>
    // this is a false assumption as it's possible that it's not the case. However for a proof
    // of concept this is fine.
    const request = expWithTypeArguments.typeArguments?.at(0);
    if (request && ts.isTypeReferenceNode(request) && ts.isIdentifier(request.typeName)) {
      return request.typeName;
    }
    throw new Error(`request identifier not found`);
  }

  /** build a json schema from the response type, using ts-json-schema-generator library */
  private _buildRequestJsonSchema(requestType: string, sourceFileName: string): JSONSchema7 {
    const generator = createGenerator({
      path: sourceFileName,
      type: requestType,
      expose: 'none',
      discriminatorType: 'open-api',
      additionalProperties: false,
      tsconfig: this._tsconfig,
    });
    const schema = generator.createSchema(requestType);
    const requestDefinition = (schema?.definitions || {})[requestType] as JSONSchema7;
    if (!requestDefinition) {
      throw new Error(`no definition found for ${requestType} in schema`);
    }
    return requestDefinition;
  }

}