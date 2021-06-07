
Tests.describe("parser tests", (assert) => {
    const operators = Idealang.SyntaxFacts.getBinaryOperatorsKinds();
    const i =0;
    const j = 0;
    //for (let i = 0; i < operators.length; i++) {
        const operator1 = operators[i];
        const operator1Text = Idealang.SyntaxFacts.getText(operator1) as string;
        const operator1Precedence = Idealang.SyntaxFacts.getBinaryOperatorPrecedence(operator1);
        //for (let j = 0; j < operators.length; j++) {
            const operator2 = operators[j];
            const operator2Text = Idealang.SyntaxFacts.getText(operator2) as string;
            const operator2Precedence = Idealang.SyntaxFacts.getBinaryOperatorPrecedence(operator2);

            const text = `a ${operator1Text} b ${operator2Text} c`;
            const expression = Idealang.SyntaxTree.parse(text).root;

            const asserting = new Asserting(expression);
            if(operator1Precedence > operator2Precedence){
                asserting.assertNode(assert, Idealang.SyntaxKind.BinaryExpression);
                asserting.assertNode(assert, Idealang.SyntaxKind.BinaryExpression);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "a");
                asserting.assertToken(assert, operator1, operator1Text);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "b");
                asserting.assertToken(assert, operator2, operator2Text);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "c");
            }
            else{
                asserting.assertNode(assert, Idealang.SyntaxKind.BinaryExpression);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "a");
                asserting.assertToken(assert, operator1, operator1Text);
                asserting.assertNode(assert, Idealang.SyntaxKind.BinaryExpression);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "b");
                asserting.assertToken(assert, operator2, operator2Text);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "c");
            }
        //}
    //}
});


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
        assert.equal(kind, token.kind);

        this._index++;
    }
}
