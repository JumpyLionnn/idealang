///<reference path="syntax/unaryExpressionSyntax.ts" />
///<reference path="binding/boundUnaryExpression.ts" />

class Evaluator {
    private readonly _root: BoundExpression;
    private readonly _variables: {[name: string]: all};
    constructor (root: BoundExpression, variables: {[name: string]: all}) {
        this._root = root;
        this._variables = variables;
    }

    public evaluate (): all{
        return this.evaluateExpression(this._root);
    }

    private evaluateExpression (node: BoundExpression): all{

        if(node instanceof BoundLiteralExpression){
            return node.value;
        }

        if(node instanceof BoundVariableExpression){
            const value = this._variables[node.name];
            return value;
        }

        if(node instanceof BoundAssignmentExpression){
            const value = this.evaluateExpression(node.expression);
            this._variables[node.name] = value;
            return value;
        }

        if(node instanceof BoundUnaryExpression){
            const operand = this.evaluateExpression(node.operand);
            switch (node.operator.kind) {
                case BoundUnaryOperatorKind.Identity:
                    return operand as number;
                case BoundUnaryOperatorKind.Negation:
                    return -operand as number;
                case BoundUnaryOperatorKind.LogicalNegation:
                    return !operand as boolean;
                default:
                    throw new Error(`Unexpected unary operator ${node.operator.kind}`);
            }
        }

        if(node instanceof BoundBinaryExpression){
            const left = this.evaluateExpression(node.left);
            const right = this.evaluateExpression(node.right);
            switch (node.operator.kind) {
                case BoundBinaryOperatorKind.Addition:
                    return (left as number) + (right as number);
                case BoundBinaryOperatorKind.Substruction:
                    return (left as number) - (right as number);
                case BoundBinaryOperatorKind.Multiplication:
                    return (left as number) * (right as number);
                case BoundBinaryOperatorKind.Division:
                    return (left as number) / (right as number);
                case BoundBinaryOperatorKind.LogicalAnd:
                    return (left as boolean) && (right as boolean);
                case BoundBinaryOperatorKind.LogicalOr:
                    return (left as boolean) || (right as boolean);
                case BoundBinaryOperatorKind.Equals:
                    return left === right;
                case BoundBinaryOperatorKind.NotEquals:
                    return !(left === right);
                default:
                    throw new Error(`Unexpected binary operator ${node.operator.kind}`);
            }
        }
        throw new Error(`Unexpected node ${node.kind}`);
    }
}