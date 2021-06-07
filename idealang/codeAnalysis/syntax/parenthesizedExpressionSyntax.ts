///<reference path="expressionSyntax.ts" />
namespace Idealang{
    export class ParenthesizedExpressionSyntax extends ExpressionSyntax {
        private _openParenthesisToken: SyntaxToken;
        private _expression: ExpressionSyntax;
        private _closeParenthesisToken: SyntaxToken;
        constructor (openParenthesisToken: SyntaxToken, expression: ExpressionSyntax, closeParenthesisToken: SyntaxToken){
            super();
            this._openParenthesisToken = openParenthesisToken;
            this._expression = expression;
            this._closeParenthesisToken = closeParenthesisToken;
            this._kind = SyntaxKind.ParenthesizedExpression;
        }

        public get openParenthesisToken (){return this._openParenthesisToken;}
        public get expression (){return this._expression;}
        public get closeParenthesisToken (){return this._closeParenthesisToken;}

        public getChildren (){
            return [this._openParenthesisToken, this._expression, this._closeParenthesisToken];
        }
    }
}

