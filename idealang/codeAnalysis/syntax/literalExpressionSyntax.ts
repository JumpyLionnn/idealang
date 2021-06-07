/// <reference path="expressionSyntax.ts"/>
namespace Idealang{
    export class LiteralExpressionSyntax extends ExpressionSyntax {
        private _literalToken: SyntaxToken;
        private _value: all;
        constructor (literalToken: SyntaxToken, value?: all){
            super();
            this._literalToken = literalToken;
            this._value = value !== undefined ? value : literalToken.value;
            this._kind = SyntaxKind.LiteralExpression;
        }

        public get literalToken (){return this._literalToken;}
        public get value (){return this._value;}

        public getChildren (){
            return [this._literalToken];
        }
    }
}
