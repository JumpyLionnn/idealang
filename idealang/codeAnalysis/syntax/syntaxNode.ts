namespace Idealang{
    export abstract class SyntaxNode{
        protected _kind: SyntaxKind = SyntaxKind.WhitespaceToken;
        public get kind (){return this._kind;}

        public abstract getChildren (): (SyntaxNode | SyntaxToken)[];
    }
}