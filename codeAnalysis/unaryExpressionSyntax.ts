class UnaryExpressionSyntax extends ExpressionSyntax {
    public operatorToken: SyntaxToken;
    public operand: ExpressionSyntax;
    constructor (operationToken: SyntaxToken, operand: ExpressionSyntax){
        super();
        this.operatorToken = operationToken;
        this.operand = operand;
        this.type = SyntaxType.UnaryExpression;
    }
}