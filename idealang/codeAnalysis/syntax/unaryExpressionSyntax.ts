/// <reference path="./expressionSyntax.ts"/>

namespace Idealang{
    export class UnaryExpressionSyntax extends ExpressionSyntax {
        private _operatorToken: SyntaxToken;
        private _operand: ExpressionSyntax;
        constructor (operatorToken: SyntaxToken, operand: ExpressionSyntax){
            super();
            this._operatorToken = operatorToken;
            this._operand = operand;
            this._kind = SyntaxKind.UnaryExpression;
        }

        public get operatorToken (){return this._operatorToken;}
        public get operand (){return this._operand;}

        public getChildren (){
            return [this._operatorToken, this._operand];
        }
    }
}
