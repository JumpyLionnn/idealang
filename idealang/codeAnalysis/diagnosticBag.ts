/// <reference path="./diagnostic.ts" />

class DiagnosticBag{
    private _diagnostics: Diagnostic[] = [];

    private report (span: TextSpan, message: string){
        this._diagnostics.push(new Diagnostic(span, message));
    }

    public reportInvalidNumber (span: TextSpan, text: string, type: Type){
        const message = `The number ${text} isn't a valid ${type}.`;
        this.report(span, message);
    }

    public reportBadCharacter (position: number, character: string){
        const message = `Bad character input: '${character}'.`;
        this.report(new TextSpan(position, 1), message);
    }

    public reportUnexpectedToken (span: TextSpan, actualKind: SyntaxKind, expectedKind: SyntaxKind){
        const message = `Unexpected token <${actualKind}> expected <${expectedKind}>.`;
        this.report(span, message);
    }

    public reportUndefinedUnaryOperator (span: TextSpan, operatorText: string, operandType: Type){
        const message = `Unary operator '${operatorText}' is not defined for type ${operandType}.`;
        this.report(span, message);
    }

    public reportUndefinedBinaryOperator (span: TextSpan, operatorText: string, leftType: Type, rightType: Type){
        const message = `Binary operator '${operatorText}' is not defined for type ${leftType} and ${rightType}.`;
        this.report(span, message);
    }

    public add (diagnostics: DiagnosticBag){
        this._diagnostics.push(...diagnostics._diagnostics);
    }

    public toArray (): Diagnostic[]{
        return this._diagnostics;
    }
}