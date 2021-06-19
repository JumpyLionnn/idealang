///<reference path="../binding/boundTreeRewriter.ts" />
namespace Idealang {
    export class Lowerer extends BoundTreeRewriter {
        private _labelCount: number;
        private constructor () {
            super();
        }

        private generateLabel (): LabelSymbol {
            const name = `label${++this._labelCount}`;
            return new LabelSymbol(name);
        }

        public static lower (statement: BoundStatement): BoundBlockStatement {
            const lowerer = new Lowerer();
            const result = lowerer.rewriteStatement(statement);
            return this.flatten(result);
        }

        private static flatten (statement: BoundStatement): BoundBlockStatement {
            const statementsResult: BoundStatement[] = [];
            const statements: BoundStatement[] = [statement];

            while (statements.length > 0) {
                const current = statements.pop();
                if(current instanceof BoundBlockStatement){
                    const blockStatements = current.statements.reverse();
                    for (let i = 0; i < blockStatements.length; i++) {
                        const newStatement = blockStatements[i];
                        statements.push(newStatement);
                    }
                }
                else{
                    statementsResult.push(current as BoundStatement);
                }
            }

            return new BoundBlockStatement(statementsResult);
        }

        protected rewriteIfStatement (node: BoundIfStatement): BoundStatement{
            if(node.elseStatement === null){
                const endLabel = this.generateLabel();
                const gotoFalse = new BoundConditionalGoToStatement(endLabel, node.condition, false);
                const endLabelStatement = new BoundLabelStatement(endLabel);
                const result = new BoundBlockStatement([gotoFalse, node.thenStatement, endLabelStatement]);
                return this.rewriteStatement(result);
            }
            else{
                const elseLabel = this.generateLabel();
                const endLabel = this.generateLabel();

                const gotoFalse = new BoundConditionalGoToStatement(elseLabel, node.condition, false);
                const gotoEndStatement = new BoundGoToStatement(endLabel);
                const elseLabelStatement = new BoundLabelStatement(elseLabel);
                const endLabelStatement = new BoundLabelStatement(endLabel);

                const result = new BoundBlockStatement([
                    gotoFalse,
                    node.thenStatement,
                    gotoEndStatement,
                    elseLabelStatement,
                    node.elseStatement,
                    endLabelStatement
                ]);
                return this.rewriteStatement(result);

            }
        }

        protected rewriteWhileStatement (node: BoundWhileStatement): BoundStatement {
            const continueLabel = this.generateLabel();
            const checkLabel = this.generateLabel();
            const endLabel = this.generateLabel();
            const gotoCheck = new BoundGoToStatement(checkLabel);
            const continueLabelStatement = new BoundLabelStatement(continueLabel);
            const checkLabelStatement =  new BoundLabelStatement(checkLabel);
            const gotoTrue = new BoundConditionalGoToStatement(continueLabel, node.condition, true);
            const endLabelStatement =  new BoundLabelStatement(endLabel);
            const result = new BoundBlockStatement([
                gotoCheck,
                continueLabelStatement,
                node.body,
                checkLabelStatement,
                gotoTrue,
                endLabelStatement
            ]);
            return this.rewriteStatement(result);
        }

        protected rewriteForStatement (node: BoundForStatement): BoundStatement {
            const variableDeclaration = new BoundVariableDeclaration(node.variable, node.lowerBound);
            const variableExpression = new BoundVariableExpression(node.variable);
            const upperBoundSymbol = new VariableSymbol("upperBound", true, Type.int);
            const upperBoundDeclaration = new BoundVariableDeclaration(upperBoundSymbol, node.upperBound);
            const condition = new BoundBinaryExpression(
                variableExpression,
                BoundBinaryOperator.bind(SyntaxKind.LessOrEqualsToken, Type.int, Type.int) as BoundBinaryOperator,
                new BoundVariableExpression(upperBoundSymbol)
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
            const result = new BoundBlockStatement([variableDeclaration, upperBoundDeclaration, whileStatement]);
            return this.rewriteStatement(result);
        }
    }
}