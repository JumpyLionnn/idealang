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

        public writeTo (builder: TextBuilder){
            SyntaxNode.prettyPrint(builder, this);
        }

        private static prettyPrint (builder: TextBuilder, node: SyntaxNode | SyntaxToken, indent: string = "", isLast: boolean = true){
            const marker = isLast ? "└──" : "├──";
            builder.write(indent);
            builder.write(marker);
            builder.color = node instanceof SyntaxToken ? ConsoleColor.FgBlue : ConsoleColor.FgCyan;
            builder.write(node.kind);

            if(node instanceof SyntaxToken && node.value !== null){
                builder.write(" ");
                builder.write(node.value);
            }
            builder.writeLine();

            builder.color = ConsoleColor.default;

            indent += isLast ? "    " : "│   ";

            if(node instanceof SyntaxNode){
                const children = node.getChildren();
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    this.prettyPrint(builder, child, indent, i === children.length - 1);
                }
            }
        }
    }
}