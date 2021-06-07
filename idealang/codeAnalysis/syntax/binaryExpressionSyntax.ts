/// <reference path="expressionSyntax.ts"/>

namespace Idealang{
    export class BinaryExpressionSyntax extends ExpressionSyntax {
        private _left: ExpressionSyntax;
        private _operatorToken: SyntaxToken;
        private _right: ExpressionSyntax;
        constructor (left: ExpressionSyntax, operatorToken: SyntaxToken, right: ExpressionSyntax){
            super();
            this._left = left;
            this._operatorToken = operatorToken;
            this._right = right;
            this._kind = SyntaxKind.BinaryExpression;
        }

        public get left (){return this._left;}
        public get operatorToken (){return this._operatorToken;}
        public get right (){return this._right;}

        public getChildren (){
            return [this._left, this._operatorToken, this._right];
        }
    }
}