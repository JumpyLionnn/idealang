namespace Idealang{
    export class ElseClauseSyntax extends SyntaxNode {
        private _elseKeyword: SyntaxToken;
        private _elseStatement: StatementSyntax;
        constructor (elseKeyword: SyntaxToken, elseStatement: StatementSyntax) {
            super();
            this._elseKeyword = elseKeyword;
            this._elseStatement = elseStatement;
            this._kind = SyntaxKind.ElseClause;
        }

        public get elseKeyword (){return this._elseKeyword;}
        public get elseStatement (){return this._elseStatement;}

        public getChildren (){
            return [this._elseKeyword, this._elseStatement];
        }
    }
}