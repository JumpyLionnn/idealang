namespace Idealang{
    export abstract class BoundNode{
        protected _kind: BoundNodeKind;
        public get kind (){return this._kind;}
        public abstract getChildren (): BoundNode[];


        public writeTo (builder: TextBuilder){
            BoundNode.prettyPrint(builder, this);
        }

        private static prettyPrint (builder: TextBuilder, node: BoundNode, indent: string = "", isLast: boolean = true){
            const marker = isLast ? "└──" : "├──";
            builder.write(indent);
            builder.write(marker);
            this.writeNode(builder, node);

            builder.writeLine();

            indent += isLast ? "    " : "│   ";

            const children = node.getChildren();
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                this.prettyPrint(builder, child, indent, i === children.length - 1);
            }
        }

        private static writeNode (builder: TextBuilder, node: BoundNode){
            builder.color = this.getColor(node);
            builder.write(node.kind);
            builder.color = ConsoleColor.default;
        }

        private static getColor (node: BoundNode): ConsoleColor{
            if(node instanceof BoundExpression){
                return ConsoleColor.FgBlue;
            }
            if(node instanceof BoundStatement){
                return ConsoleColor.FgCyan;
            }
            return ConsoleColor.FgYellow;
        }
    }
}