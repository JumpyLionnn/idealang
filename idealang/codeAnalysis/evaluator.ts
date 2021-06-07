///<reference path="syntax/unaryExpressionSyntax.ts" />
///<reference path="binding/boundUnaryExpression.ts" />
namespace Idealang{
    export class Evaluator {
        private readonly _root: BoundExpression;
        private readonly _variables: VariablesMap;
        constructor (root: BoundExpression, variables: VariablesMap) {
            this._root = root;
            this._variables = variables;
        }

        public evaluate (): all{
            return this.evaluateExpression(this._root);
        }

        private evaluateExpression (node: BoundExpression): all{

            switch(node.kind){
                case BoundNodeKind.LiteralExpression:
                    return this.evaluateLiteralExpression(node as BoundLiteralExpression);
                case BoundNodeKind.VariableExpression:
                    return this.evaluateVariableExpression(node as BoundVariableExpression);
                case BoundNodeKind.AssignmentExpression:
                    return this.evaluateAssignmentExpression(node as BoundAssignmentExpression);
                case BoundNodeKind.UnaryExpression:
                    return this.evaluateUnaryExpression(node as BoundUnaryExpression);
                case BoundNodeKind.BinaryExpression:
                    return this.evaluateBinaryExpression(node as BoundBinaryExpression);
                default:
                    throw new Error(`Unexpected node ${node.kind}`);
            }
        }

        private evaluateLiteralExpression (node: BoundLiteralExpression){
            return node.value;
        }

        private evaluateVariableExpression (node: BoundVariableExpression){
            return this._variables.get(node.variable) as all;
        }

        private evaluateAssignmentExpression (node: BoundAssignmentExpression){
            const value = this.evaluateExpression(node.expression);
            this._variables.set(node.variable, value);
            return value;
        }

        private evaluateUnaryExpression (node: BoundUnaryExpression){
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

        private evaluateBinaryExpression (node: BoundBinaryExpression){
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
    }
}
