///<reference path="../types.ts"/>
/// <reference path="boundLiteralExpression.ts"/>
/// <reference path="boundBinaryOperator.ts"/>
/// <reference path="boundBinaryExpression.ts"/>
/// <reference path="boundUnaryOperator.ts"/>


class Binder {
    private readonly _diagnostics: DiagnosticBag = new DiagnosticBag();

    public get diagnostics (): DiagnosticBag{return this._diagnostics;}

    public bindExpression (syntax: ExpressionSyntax): BoundExpression{
        switch (syntax.kind) {
            case SyntaxKind.LiteralExpression:
                return this.bindLiteralExpression(syntax as LiteralExpressionSyntax);
            case SyntaxKind.UnaryExpression:
                return this.bindUnaryExpression(syntax as UnaryExpressionSyntax);
            case SyntaxKind.BinaryExpression:
                return this.bindBinaryExpression(syntax as BinaryExpressionSyntax);
            case SyntaxKind.ParenthesizedExpression:
                return this.bindExpression((syntax as ParenthesizedExpressionSyntax).expression);
            default:
                throw new Error(`Unexpected syntax ${syntax.kind}`);
        }
    }

    private bindLiteralExpression (syntax: LiteralExpressionSyntax): BoundExpression{
        let value: all;
        if(syntax.value !== undefined){
            value = syntax.value;
        }
        else{
            value = 0;
        }
        return new BoundLiteralExpression(value);

    }
    private bindUnaryExpression (syntax: UnaryExpressionSyntax): BoundExpression{
        const boundOperand = this.bindExpression(syntax.operand);
        const boundOperator = BoundUnaryOperator.bind(syntax.operatorToken.kind, boundOperand.type);
        if(boundOperator === null){
            this._diagnostics.reportUndefinedUnaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundOperand.type);
            return boundOperand;
        }
        return new BoundUnaryExpression(boundOperator, boundOperand);
    }
    private bindBinaryExpression (syntax: BinaryExpressionSyntax): BoundExpression{
        const boundLeft = this.bindExpression(syntax.left);
        const boundRight = this.bindExpression(syntax.right);
        const boundOperator = BoundBinaryOperator.bind(syntax.operatorToken.kind, boundLeft.type, boundRight.type);

        if(boundOperator === null){
            this._diagnostics.reportUndefinedBinaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundLeft.type, boundRight.type);
            return boundLeft;
        }

        return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
    }
}