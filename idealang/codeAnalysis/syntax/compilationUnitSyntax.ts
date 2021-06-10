namespace Idealang{
    export class CompilationUnitSyntax extends SyntaxNode {
        private _statement: StatementSyntax;
        private _endOfFileToken: SyntaxToken;
        constructor (statement: StatementSyntax, endOfFileToken: SyntaxToken) {
            super();
            this._statement = statement;
            this._endOfFileToken = endOfFileToken;
            this._kind = SyntaxKind.CompilationUnit;
        }

        public get statement (){return this._statement;}
        public get endOfFileToken (){return this._endOfFileToken;}

        public getChildren (){
            return [this._statement, this._endOfFileToken];
        }
    }
}