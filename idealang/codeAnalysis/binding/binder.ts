///<reference path="../types.ts"/>
/// <reference path="boundLiteralExpression.ts"/>
/// <reference path="boundBinaryOperator.ts"/>
/// <reference path="boundBinaryExpression.ts"/>
/// <reference path="boundUnaryOperator.ts"/>

class Binder {
    private readonly _diagnostics: DiagnosticBag = new DiagnosticBag();
    private readonly _variables:  VariablesMap;

    constructor (variables: VariablesMap){
        this._variables = variables;
    }

    public get diagnostics (): DiagnosticBag{return this._diagnostics;}

    public bindExpression (syntax: ExpressionSyntax): BoundExpression{
        switch (syntax.kind) {
            case SyntaxKind.ParenthesizedExpression:
                return this.bindParenthesizedExpression(syntax as ParenthesizedExpressionSyntax);
            case SyntaxKind.LiteralExpression:
                return this.bindLiteralExpression(syntax as LiteralExpressionSyntax);
            case SyntaxKind.NameExpression:
                return this.bindNameExpression(syntax as NameExpressionSyntax);
            case SyntaxKind.AssignmentExpression:
                return this.bindAssignmentExpression(syntax as AssignmentExpressionSyntax);
            case SyntaxKind.UnaryExpression:
                return this.bindUnaryExpression(syntax as UnaryExpressionSyntax);
            case SyntaxKind.BinaryExpression:
                return this.bindBinaryExpression(syntax as BinaryExpressionSyntax);
            default:
                throw new Error(`Unexpected syntax ${syntax.kind}`);
        }
    }

    private bindParenthesizedExpression (syntax: ParenthesizedExpressionSyntax): BoundExpression{
        return this.bindExpression(syntax.expression);
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

    private bindNameExpression (syntax: NameExpressionSyntax): BoundExpression{
        const name = syntax.identifierToken.text;
        const variable = getMapKey(this._variables, (v) => v.name === name);
        if(!variable){
            this._diagnostics.reportUndefinedName(syntax.identifierToken.span, name);
            return new BoundLiteralExpression(0);
        }
        return new BoundVariableExpression(variable);
    }

    private bindAssignmentExpression (syntax: AssignmentExpressionSyntax): BoundExpression{
        const name = syntax.identifierToken.text;
        const boundExpression = this.bindExpression(syntax.expression);

        const existingVariable = getMapKey(this._variables, (v) => v.name === name);
        if(existingVariable){
            this._variables.delete(existingVariable);
        }

        const variable = new VariableSymbol(name, boundExpression.type);
        this._variables.set(variable, null);

        return new BoundAssignmentExpression(variable, boundExpression);
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