///<reference path="expressionSyntax.ts" />

class ParenthesizedExpressionSyntax extends ExpressionSyntax {
    public openParenthesisToken: SyntaxToken;
    public expression: ExpressionSyntax;
    public closeParenthesisToken: SyntaxToken;
    constructor (openParenthesisToken: SyntaxToken, expression: ExpressionSyntax, closeParenthesisToken: SyntaxToken){
        super();
        this.openParenthesisToken = openParenthesisToken;
        this.expression = expression;
        this.closeParenthesisToken = closeParenthesisToken;
        this.kind = SyntaxKind.ParenthesizedExpression;
    }
}
