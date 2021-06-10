
Tests.describe("binary expressions tests", (assert) => {
    const operators = Idealang.SyntaxFacts.getBinaryOperatorsKinds();
    for (let i = 0; i < operators.length; i++) {
        const operator1 = operators[i];
        const operator1Text = Idealang.SyntaxFacts.getText(operator1) as string;
        const operator1Precedence = Idealang.SyntaxFacts.getBinaryOperatorPrecedence(operator1);
        for (let j = 0; j < operators.length; j++) {
            const operator2 = operators[j];
            const operator2Text = Idealang.SyntaxFacts.getText(operator2) as string;
            const operator2Precedence = Idealang.SyntaxFacts.getBinaryOperatorPrecedence(operator2);

            const text = `a ${operator1Text} b ${operator2Text} c;`;
            const expression = parseExpression(text);

            const asserting = new Asserting(expression);
            if(operator1Precedence > operator2Precedence){
                asserting.assertNode(assert, Idealang.SyntaxKind.ExpressionStatement);
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
                asserting.assertNode(assert, Idealang.SyntaxKind.ExpressionStatement);
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
        }
    }
});


Tests.describe("unary expressions tests", (assert) => {
    const unaryOperators = Idealang.SyntaxFacts.getUnaryOperatorsKinds();
    const binaryOperators = Idealang.SyntaxFacts.getBinaryOperatorsKinds();
    for (let i = 0; i < unaryOperators.length; i++) {
        const unaryOperator = unaryOperators[i];
        const unaryOperatorText = Idealang.SyntaxFacts.getText(unaryOperator) as string;
        const unaryOperatorPrecedence = Idealang.SyntaxFacts.getUnaryOperatorPrecedence(unaryOperator);
        for (let j = 0; j < binaryOperators.length; j++) {
            const binaryOperator = binaryOperators[j];
            const binaryOperatorText = Idealang.SyntaxFacts.getText(binaryOperator) as string;
            const binaryOperatorPrecedence = Idealang.SyntaxFacts.getBinaryOperatorPrecedence(binaryOperator);

            const text = `${unaryOperatorText} a ${binaryOperatorText} b;`;
            const expression = parseExpression(text);
            const asserting = new Asserting(expression);
            if(unaryOperatorPrecedence >= binaryOperatorPrecedence){
                asserting.assertNode(assert, Idealang.SyntaxKind.ExpressionStatement);
                asserting.assertNode(assert, Idealang.SyntaxKind.BinaryExpression);
                asserting.assertNode(assert, Idealang.SyntaxKind.UnaryExpression);
                asserting.assertToken(assert, unaryOperator, unaryOperatorText);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "a");
                asserting.assertToken(assert, binaryOperator, binaryOperatorText);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "b");
            }
            else{
                asserting.assertNode(assert, Idealang.SyntaxKind.ExpressionStatement);
                asserting.assertNode(assert, Idealang.SyntaxKind.UnaryExpression);
                asserting.assertToken(assert, unaryOperator, unaryOperatorText);
                asserting.assertNode(assert, Idealang.SyntaxKind.BinaryExpression);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "a");
                asserting.assertToken(assert, binaryOperator, binaryOperatorText);
                asserting.assertNode(assert, Idealang.SyntaxKind.NameExpression);
                asserting.assertToken(assert, Idealang.SyntaxKind.IdentifierToken, "b");
            }
        }
    }
});



function parseExpression (text: string) {
    return Idealang.SyntaxTree.parse(text).root.statement;
}

