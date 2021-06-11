///<reference path="syntax/unaryExpressionSyntax.ts" />
///<reference path="binding/boundUnaryExpression.ts" />
namespace Idealang{
    export class Evaluator {
        private readonly _root: BoundStatement;
        private readonly _variables: VariablesMap;

        private _lastValue: all;
        constructor (root: BoundStatement, variables: VariablesMap) {
            this._root = root;
            this._variables = variables;
        }

        public evaluate (): all{
            this.evaluateStatement(this._root);
            return this._lastValue;
        }

        private evaluateStatement (node: BoundStatement): void{
            switch(node.kind){
                case BoundNodeKind.BlockStatement:
                    this.evaluateBlockStatement(node as BoundBlockStatement);
                    break;
                case BoundNodeKind.VariableDeclaration:
                    this.evaluateVariableDeclaration(node as BoundVariableDeclaration);
                    break;
                case BoundNodeKind.ExpressionStatement:
                    this.evaluateExpressionStatement(node as BoundExpressionStatement);
                    break;
                default:
                    throw new Error(`Unexpected node ${node.kind}`);
            }
        }

        private evaluateBlockStatement (statement: BoundBlockStatement){
            for (let i = 0; i < statement.statements.length; i++) {
                this.evaluateStatement(statement.statements[i]);
            }
        }

        public evaluateVariableDeclaration (node: BoundVariableDeclaration){
            const value = this.evaluateExpression(node.initializer);
            this._variables.set(node.variable, value);
            this._lastValue = value;
        }

        private evaluateExpressionStatement (statement: BoundExpressionStatement){
            this._lastValue = this.evaluateExpression(statement.expression);
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
            const key = getMapKey(this._variables, (key) => key.name === node.variable.name) || node.variable;
            this._variables.set(key, value);
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
                case BoundBinaryOperatorKind.Less:
                    return left < right;
                case BoundBinaryOperatorKind.LessOrEquals:
                    return left <= right;
                case BoundBinaryOperatorKind.Greater:
                    return left > right;
                case BoundBinaryOperatorKind.GreaterOrEquals:
                    return left >= right;
                default:
                    throw new Error(`Unexpected binary operator ${node.operator.kind}`);
            }
        }
    }
}
