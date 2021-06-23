namespace Idealang{
    export class CallExpressionSyntax extends ExpressionSyntax {
        private _identifier: SyntaxToken;
        private _left: SyntaxToken;
        private _callArguments: SeparatedSyntaxList;
        private _right: SyntaxToken;
        constructor (identifier: SyntaxToken, left: SyntaxToken, callArguments: SeparatedSyntaxList, right: SyntaxToken) {
            super();
            this._identifier = identifier;
            this._left = left;
            this._callArguments = callArguments;
            this._right = right;
            this._kind = SyntaxKind.CallExpression;
        }

        public get identifier (){return this._identifier;}
        public get left (){return this._left;}
        public get callArguments (){return this._callArguments;}
        public get right (){return this._right;}


        public getChildren (){
            return [this._identifier, this._left, this._right];
        }
    }
}