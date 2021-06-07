namespace Idealang{
    export class NameExpressionSyntax extends ExpressionSyntax {
        private _identifierToken: SyntaxToken;
        constructor (identifierToken: SyntaxToken) {
            super();
            this._identifierToken = identifierToken;
            this._kind = SyntaxKind.NameExpression;
        }
        public get identifierToken (){return this._identifierToken;}

        public getChildren (){
            return [this._identifierToken];
        }
    }
}
