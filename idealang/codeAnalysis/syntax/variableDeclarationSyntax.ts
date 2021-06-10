namespace Idealang{
    export class VariableDeclarationSyntax extends StatementSyntax {
        private _keyword: SyntaxToken;
        private _identifier: SyntaxToken;
        private _equalsToken: SyntaxToken;
        private _initializer: ExpressionSyntax;
        private _semicolonToken: SyntaxToken;
        constructor (keyword: SyntaxToken, identifier: SyntaxToken, equalsToken: SyntaxToken, initializer: ExpressionSyntax, semicolonToken: SyntaxToken){
            super();
            this._keyword = keyword;
            this._identifier = identifier;
            this._equalsToken = equalsToken;
            this._initializer = initializer;
            this._semicolonToken = semicolonToken;
            this._kind = SyntaxKind.VariableDeclaration;
        }

        public get keyword (){return this._keyword;}
        public get identifier (){return this._identifier;}
        public get equalsToken (){return this._equalsToken;}
        public get initializer (){return this._initializer;}
        public get semicolonToken (){return this._semicolonToken;}

        public getChildren (){
            return [this._keyword, this._identifier, this._equalsToken, this._initializer, this._semicolonToken];
        }
    }
}