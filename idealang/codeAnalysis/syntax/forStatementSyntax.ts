namespace Idealang{
    export class ForStatementSyntax extends StatementSyntax {
        private _forKeyword: SyntaxToken;
        private _identifier: SyntaxToken;
        private _equalsToken: SyntaxToken;
        private _lowerBound: ExpressionSyntax;
        private _toKeyword: SyntaxToken;
        private _upperBound: ExpressionSyntax;
        private _body: StatementSyntax;
        constructor (forKeyword: SyntaxToken, identifier: SyntaxToken, equalsToken: SyntaxToken, lowerBound: ExpressionSyntax, toKeyword: SyntaxToken, upperBound: ExpressionSyntax, body: StatementSyntax) {
            super();
            this._forKeyword = forKeyword;
            this._identifier = identifier;
            this._equalsToken = equalsToken;
            this._lowerBound = lowerBound;
            this._toKeyword = toKeyword;
            this._upperBound = upperBound;
            this._body = body;
            this._kind = SyntaxKind.ForStatement;
        }


        public get forKeyword () { return this._forKeyword;}
        public get identifier () { return this._identifier;}
        public get equalsToken () { return this._equalsToken;}
        public get lowerBound () { return this._lowerBound;}
        public get toKeyword (){return this._toKeyword;}
        public get upperBound () { return this._upperBound;}
        public get body () { return this._body;}


        public getChildren (){
            return [this._forKeyword, this._identifier, this._equalsToken, this._lowerBound, this._toKeyword, this._upperBound, this._body];
        }
    }
}