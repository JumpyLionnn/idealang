/// <reference path="./statementSyntax.ts" />
namespace Idealang{
    export class BlockStatementSyntax extends StatementSyntax {
        private _openBraceToken: SyntaxToken;
        private _statements: StatementSyntax[];
        private _closeBraceToken: SyntaxToken;
        constructor (openBraceToken: SyntaxToken, statements: StatementSyntax[], closeBraceToken: SyntaxToken) {
            super();
            this._openBraceToken = openBraceToken;
            this._statements = statements;
            this._closeBraceToken = closeBraceToken;
            this._kind = SyntaxKind.BlockStatement;
        }

        public get openBraceToken (){return this._openBraceToken;}
        public get statements (){return this._statements;}
        public get closeBraceToken (){return this._closeBraceToken;}

        public getChildren (){
            return [this._openBraceToken, ...this._statements, this._closeBraceToken];
        }
    }
}