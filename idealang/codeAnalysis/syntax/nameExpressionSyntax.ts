namespace Idealang{
    export class NameExpressionSyntax extends ExpressionSyntax {
        private _identifierToken: SyntaxToken;
        constructor (identifierToken: SyntaxToken) {
            super();
            this._identifierToken = identifierToken;
            this.kind = SyntaxKind.NameExpression;
        }
        public get identifierToken (): SyntaxToken{
            return this._identifierToken;
        }
    }
}
