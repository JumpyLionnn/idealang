///<reference path="../binding/boundTreeRewriter.ts" />
namespace Idealang {
    export class Lowerer extends BoundTreeRewriter {
        private constructor () {
            super();
        }

        public static lower (statement: BoundStatement): BoundStatement {
            const lowerer = new Lowerer();
            return lowerer.rewriteStatement(statement);
        }

        protected rewriteForStatement (node: BoundForStatement): BoundStatement {
            const variableDeclaration = new BoundVariableDeclaration(node.variable, node.lowerBound);
            const variableExpression = new BoundVariableExpression(node.variable);
            const condition = new BoundBinaryExpression(
                variableExpression,
                BoundBinaryOperator.bind(SyntaxKind.LessOrEqualsToken, Type.int, Type.int) as BoundBinaryOperator,
                node.upperBound
            );
            const increment = new BoundExpressionStatement(
                new BoundAssignmentExpression(
                    node.variable,
                    new BoundBinaryExpression(
                        variableExpression,
                        BoundBinaryOperator.bind(SyntaxKind.PlusToken, Type.int, Type.int) as BoundBinaryOperator,
                        new BoundLiteralExpression(1)
                    )
                )
            );

            const whileBody = new BoundBlockStatement([node.body, increment]);
            const whileStatement = new BoundWhileStatement(condition, whileBody);
            const result = new BoundBlockStatement([variableDeclaration, whileStatement]);
            return this.rewriteStatement(result);
        }
    }
}