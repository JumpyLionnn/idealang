namespace Idealang{
    export abstract class SyntaxNode{
        protected _kind: SyntaxKind = SyntaxKind.WhitespaceToken;
        public get kind (){return this._kind;}

        public get span (){
            const children = this.getChildren();
            const first = children[0].span as TextSpan;
            const last = children[children.length -1].span as TextSpan;
            return TextSpan.fromBounds(first.start, last.end);
        }

        public abstract getChildren (): (SyntaxNode | SyntaxToken)[];
    }
}