"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteFinder = void 0;
const typescript_1 = __importDefault(require("typescript"));
class RouteFinder {
    _checker;
    constructor(_checker) {
        this._checker = _checker;
    }
    /** finds classes that extend Route */
    findRoutes(nodes) {
        return nodes.filter((node) => this._hasRouteAncestor(node));
    }
    _hasRouteAncestor(node) {
        const heritageClauses = node.heritageClauses || [];
        for (let heritage of heritageClauses) {
            // heritage has child nodes of [extends, Type]
            const extended = heritage.types.at(0);
            // check that we are inheriting from a class using generics
            if (extended != undefined && typescript_1.default.isExpressionWithTypeArguments(extended) && typescript_1.default.isIdentifier(extended.expression)) {
                const isRoute = extended.expression.escapedText == 'Route' || false;
                if (isRoute) {
                    return true;
                }
                // check ancestors
                // get the symbol for the extended class
                let symbol = this._checker.getSymbolAtLocation(extended.expression);
                const superDeclaration = symbol?.declarations?.at(0);
                if (superDeclaration && typescript_1.default.isClassDeclaration(superDeclaration)) {
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
exports.RouteFinder = RouteFinder;
