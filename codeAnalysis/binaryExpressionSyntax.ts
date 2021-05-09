/// <reference path="expressionSyntax.ts"/>

class BinaryExpressionSyntax extends ExpressionSyntax {
    public left: ExpressionSyntax;
    public operatorToken: SyntaxToken;
    public right: ExpressionSyntax;
    constructor (left: ExpressionSyntax, operationToken: SyntaxToken, right: ExpressionSyntax){
        super();
        this.left = left;
        this.operatorToken = operationToken;
        this.right = right;
        this.type = SyntaxType.BinaryExpression;
    }
}