namespace Idealang{
    export class IfStatementSyntax extends StatementSyntax {
        private _ifKeyword: SyntaxToken;
        private _condition: ParenthesizedExpressionSyntax;
        private _thenStatement: StatementSyntax;
        private _elseClause: ElseClauseSyntax | null;
        constructor (ifKeyword: SyntaxToken, condition: ParenthesizedExpressionSyntax, thenStatement: StatementSyntax, elseClause: ElseClauseSyntax | null = null) {
            super();
            this._ifKeyword = ifKeyword;
            this._condition = condition;
            this._thenStatement = thenStatement;
            this._elseClause = elseClause;
            this._kind = SyntaxKind.IfStatement;
        }

        public get ifKeyword (){return this._ifKeyword;}
        public get condition (){return this._condition;}
        public get thenStatement (){return this._thenStatement;}
        public get elseClause (){return this._elseClause;}


        public getChildren () {
            return [this._ifKeyword, this._condition, this._thenStatement];
        }
    }
}