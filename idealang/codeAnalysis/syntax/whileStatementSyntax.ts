namespace Idealang{
    export class WhileStatementSyntax extends StatementSyntax {
        private _whileKeyword: SyntaxToken;
        private _condition: ParenthesizedExpressionSyntax;
        private _body: StatementSyntax;
        constructor (whileKeyword: SyntaxToken, condition: ParenthesizedExpressionSyntax, body: StatementSyntax) {
            super();
            this._whileKeyword = whileKeyword;
            this._condition = condition;
            this._body = body;
            this._kind = SyntaxKind.WhileStatement;
        }

        public get whileKeyword (){return this._whileKeyword;}
        public get condition (){return this._condition;}
        public get body (){return this._body;}


        public getChildren (){
            return [this._whileKeyword, this._condition, this._body];
        }
    }
}