/// <reference path="./expressionSyntax.ts"/>

namespace Idealang{
    export class UnaryExpressionSyntax extends ExpressionSyntax {
        public operatorToken: SyntaxToken;
        public operand: ExpressionSyntax;
        constructor (operationToken: SyntaxToken, operand: ExpressionSyntax){
            super();
            this.operatorToken = operationToken;
            this.operand = operand;
            this.kind = SyntaxKind.UnaryExpression;
        }
    }
}
