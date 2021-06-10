/// <reference path="./diagnostic.ts" />

namespace Idealang{
    export class DiagnosticBag{
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

        public reportUndefinedName (span: TextSpan, name: string){
            const message = `Variable '${name}' doesn't exist.`;
            this.report(span, message);
        }

        public reportVariableAlreadyDeclared (span: TextSpan, name: string){
            const message = `Variable '${name}' is already declared.`;
            this.report(span, message);
        }

        public reportCannotAssign (span: TextSpan, name: string){
            const message = `Variable '${name}' is read-only and cannot be assigned to.`;
            this.report(span, message);
        }

        public reportCannotConvert (span: TextSpan, fromType: Type, toType: Type){
            const message = `Cannot convert type '${fromType}' to '${toType}'.`;
            this.report(span, message);
        }

        public add (diagnostics: DiagnosticBag){
            this._diagnostics.push(...diagnostics._diagnostics);
        }

        public toArray (): Diagnostic[]{
            return this._diagnostics;
        }
    }
}
