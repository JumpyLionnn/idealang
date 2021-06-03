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
            this.kind = SyntaxKind.AssignmentExpression;
        }

        public get identifierToken (): SyntaxToken{
            return this._identifierToken;
        }

        public get equalsToken (): SyntaxToken{
            return this._equalsToken;
        }

        public get expression (): ExpressionSyntax{
            return this._expression;
        }
    }
}
