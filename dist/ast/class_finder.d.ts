import ts from 'typescript';
export declare class ClassFinder {
    private program;
    constructor(program: ts.Program);
    /** extracts classes declaration which are not abstract */
    findClasses(): ts.ClassDeclaration[];
    private _findChildren;
    private _isAbstract;
}
