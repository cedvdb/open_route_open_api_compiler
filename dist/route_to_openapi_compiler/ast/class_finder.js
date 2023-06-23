"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassFinder = void 0;
const typescript_1 = __importDefault(require("typescript"));
class ClassFinder {
    program;
    constructor(program) {
        this.program = program;
    }
    /** extracts classes declaration which are not abstract */
    findClasses() {
        const classes = [];
        return this._findChildren(this.program)
            .filter(typescript_1.default.isClassDeclaration)
            .filter((node) => !this._isAbstract(node));
    }
    _findChildren(program) {
        const children = [];
        const sources = program.getSourceFiles()
            .filter((file) => !file.isDeclarationFile);
        for (let source of sources) {
            source.forEachChild((node) => {
                children.push(node);
            });
        }
        return children;
    }
    _isAbstract(node) {
        const modifiers = node.modifiers;
        return modifiers?.some((modifier) => modifier.kind == typescript_1.default.SyntaxKind.AbstractKeyword) || false;
    }
}
exports.ClassFinder = ClassFinder;
