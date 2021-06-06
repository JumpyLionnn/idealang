/*
Tests.describe("parser tests", (assert) => {
    const operators = Idealang.SyntaxFacts.getBinaryOperatorsKinds();
    for (let i = 0; i < operators.length; i++) {
        const operator1 = operators[i];
        const operator1Precedence = Idealang.SyntaxFacts.getBinaryOperatorPrecedence(operator1);
        for (let j = 0; j < operators.length; j++) {
            const operator2 = operators[j];
            const operator2Precedence = Idealang.SyntaxFacts.getBinaryOperatorPrecedence(operator2);

            const text = `a ${Idealang.SyntaxFacts.getText(operator1)} b ${Idealang.SyntaxFacts.getText(operator2)} c`;
            const expression = Idealang.SyntaxTree.parse(text).root;

            if(operator1Precedence > operator2Precedence){
                const asserting = new Asserting(expression);
                asserting.assertNode(assert, Idealang.SyntaxKind.BinaryExpression);
            }
            else{

            }
        }
    }
});


function flatten (node: Idealang.SyntaxNode){
    const stack = [node];
    const resultStack = [];

    while(stack.length > 0){
        const singleNode = stack.pop();
        resultStack.push(singleNode);
        const childNodes = singleNode?.getChildren().reverse();
        if(childNodes !== undefined){
            for (let i = 0; i < childNodes.length; i++) {
                stack.push(childNodes[i]);
            }
        }
    }
}

class Asserting {
    public readonly nodes: Idealang.SyntaxNode[];
    constructor (node: Idealang.SyntaxNode) {
        this.nodes = this.flatten(node);
    }

    private flatten (node: Idealang.SyntaxNode){
        const stack = [node];
        const resultStack: Idealang.SyntaxNode[] = [];

        while(stack.length > 0){
            const singleNode = stack.pop();
            resultStack.push(singleNode as Idealang.SyntaxNode);
            const childNodes = singleNode?.getChildren().reverse();
            if(childNodes !== undefined){
                for (let i = 0; i < childNodes.length; i++) {
                    stack.push(childNodes[i]);
                }
            }
        }
        return resultStack;
    }

    public assertToken (assert: TestDescription, kind: Idealang.SyntaxKind, text: string){
        for (let i = 0; i < this.nodes.length; i++) {
            const token = this.nodes[i];
            assert.isType(Idealang.SyntaxToken, token);
            assert.equal(kind, token.kind);
            //assert.equal(text, token.text);
        }
    }

    public assertNode (assert: TestDescription, kind: Idealang.SyntaxKind){
        for (let i = 0; i < this.nodes.length; i++) {
            const token = this.nodes[i];
            assert.isNotType(Idealang.SyntaxToken, token);
            assert.equal(kind, token.kind);
            //assert.equal(text, token.text);
        }
    }
}
*/