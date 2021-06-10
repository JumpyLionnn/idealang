/// <reference path="./statementSyntax.ts" />
namespace Idealang{
    export class ExpressionStatementSyntax extends StatementSyntax {
        private _expression: ExpressionSyntax;
        private _semicolonToken: SyntaxToken;
        constructor (expression: ExpressionSyntax, semicolonToken: SyntaxToken) {
            super();
            this._expression = expression;
            this._semicolonToken = semicolonToken;
            this._kind = SyntaxKind.ExpressionStatement;
        }

        public get expression (){return this._expression;}
        public get semicolonToken (){return this._semicolonToken;}

        public getChildren (){
            return [this._expression, this._semicolonToken];
        }
    }
}