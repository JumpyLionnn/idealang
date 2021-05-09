/// <reference path="expressionSyntax.ts"/>
class LiteralExpressionSyntax extends ExpressionSyntax {
    public literalToken: SyntaxToken;
    constructor (literalToken: SyntaxToken){
        super();
        this.literalToken = literalToken;
        this.type = SyntaxType.LiteralExpression;
    }
}
