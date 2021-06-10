
class Asserting {
    public readonly nodes: (Idealang.SyntaxNode | Idealang.SyntaxToken)[];
    private _index: number = 0;
    constructor (node: Idealang.SyntaxNode) {
        this.nodes = this.flatten(node);
    }

    private flatten (node: Idealang.SyntaxNode){
        const stack: (Idealang.SyntaxNode | Idealang.SyntaxToken)[] = [node];
        const resultStack: (Idealang.SyntaxNode | Idealang.SyntaxToken)[] = [];

        while(stack.length > 0){
            const singleNode = stack.pop() as Idealang.SyntaxNode | Idealang.SyntaxToken;
            resultStack.push(singleNode);

            if(singleNode instanceof Idealang.SyntaxToken)
                continue;

            const childNodes = singleNode.getChildren().reverse();
            for (let i = 0; i < childNodes.length; i++) {
                stack.push(childNodes[i]);
            }
        }
        return resultStack;
    }

    public assertToken (assert: TestDescription, kind: Idealang.SyntaxKind, text: string){
        const token = this.nodes[this._index];
        if(assert.isType(Idealang.SyntaxToken, token)){
            assert.equal(text, (token as Idealang.SyntaxToken).text);
            assert.equal(kind, token.kind);
        }

        this._index++;
    }

    public assertNode (assert: TestDescription, kind: Idealang.SyntaxKind){
        const token = this.nodes[this._index];
        assert.isNotType(Idealang.SyntaxToken, token);
        if(token === undefined)
            return;
        assert.equal(kind, token.kind);

        this._index++;
    }
}
