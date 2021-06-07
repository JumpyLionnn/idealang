namespace Idealang{
    export abstract class SyntaxNode{
        protected _kind: SyntaxKind = SyntaxKind.WhitespaceToken;
        public get kind (){return this._kind;}

        public get span (){
            const first = this.getChildren()[0].span as TextSpan;
            const last = this.getChildren()[-1].span as TextSpan;
            return TextSpan.fromBounds(first.start, last.end);
        }

        public abstract getChildren (): (SyntaxNode | SyntaxToken)[];
    }
}