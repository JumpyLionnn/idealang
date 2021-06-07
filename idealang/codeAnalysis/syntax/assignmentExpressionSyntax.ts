namespace Idealang{
    export class AssignmentExpressionSyntax extends ExpressionSyntax {
        private _identifierToken: SyntaxToken;
        private _equalsToken: SyntaxToken;
        private _expression: ExpressionSyntax;
        constructor (identifierToken: SyntaxToken, equalsToken: SyntaxToken, expression: ExpressionSyntax) {
            super();
            this._identifierToken = identifierToken;
            this._equalsToken = equalsToken;
            this._expression = expression;
            this._kind = SyntaxKind.AssignmentExpression;
        }

        public get identifierToken (){return this._identifierToken;}

        public get equalsToken (){return this._equalsToken;}

        public get expression (){return this._expression;}

        public getChildren (){
            return [this._identifierToken, this._equalsToken, this._expression];
        }
    }
}
