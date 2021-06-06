namespace Idealang{
    export abstract class SyntaxNode{
        public kind: SyntaxKind = SyntaxKind.WhitespaceToken;

        public abstract getChildren (): SyntaxNode[];
    }
}