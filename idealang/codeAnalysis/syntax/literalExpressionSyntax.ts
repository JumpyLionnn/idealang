/// <reference path="expressionSyntax.ts"/>
class LiteralExpressionSyntax extends ExpressionSyntax {
    public literalToken: SyntaxToken;
    public value: all;
    constructor (literalToken: SyntaxToken, value?: all){
        super();
        this.literalToken = literalToken;
        if(value !== undefined){
            this.value = value;
        }
        else{
            this.value = literalToken.value;
        }
        this.kind = SyntaxKind.LiteralExpression;
    }
}
