namespace Idealang {
    export abstract class BoundTreeRewriter {
        public rewriteStatement (node: BoundStatement): BoundStatement {
            switch (node.kind) {
                case BoundNodeKind.BlockStatement:
                    return this.rewriteBlockStatement(node as BoundBlockStatement);
                case BoundNodeKind.VariableDeclaration:
                    return this.rewriteVariableDeclaration(node as BoundVariableDeclaration);
                case BoundNodeKind.IfStatement:
                    return this.rewriteIfStatement(node as BoundIfStatement);
                case BoundNodeKind.WhileStatement:
                    return this.rewriteWhileStatement(node as BoundWhileStatement);
                case BoundNodeKind.ForStatement:
                    return this.rewriteForStatement(node as BoundForStatement);

                case BoundNodeKind.LabelStatement:
                    return this.rewriteLabelStatement(node as BoundLabelStatement);
                case BoundNodeKind.GoToStatement:
                    return this.rewriteGoToStatement(node as BoundGoToStatement);
                case BoundNodeKind.ConditionalGoToStatement:
                    return this.rewriteConditionalGoToStatement(node as BoundConditionalGoToStatement);

                case BoundNodeKind.ExpressionStatement:
                    return this.rewriteExpressionStatement(node as BoundExpressionStatement);
                default:
                    throw new Error(`Unexpected node king ${node.kind}`);
            }
        }

        protected rewriteBlockStatement (node: BoundBlockStatement): BoundStatement {
            let statements: BoundStatement[] | null = null;
            for (let i = 0; i < node.statements.length; i++) {
                const oldStatement = node.statements[i];
                const newStatement = this.rewriteStatement(oldStatement);
                if(newStatement !== oldStatement){
                    if(statements === null){
                        statements = [];
                        for (let j = 0; j < i; j++) {
                            statements.push(node.statements[j]);
                        }
                    }
                }
                if(statements !== null){
                    statements.push(newStatement);
                }
            }
            if(statements === null){
                return node;
            }
            return new BoundBlockStatement(statements as BoundStatement[]);
        }

        protected rewriteVariableDeclaration (node: BoundVariableDeclaration): BoundStatement {
            const initializer = this.rewriteExpression(node.initializer);
            if(node.initializer === initializer){
                return node;
            }
            return new BoundVariableDeclaration(node.variable, initializer);
        }

        protected rewriteIfStatement (node: BoundIfStatement): BoundStatement {
            const condition = this.rewriteExpression(node.condition);
            const body = this.rewriteStatement(node.thenStatement);
            const elseStatement = node.elseStatement === null ? null : this.rewriteStatement(node.elseStatement);
            if(condition === node.condition && body === node.thenStatement && elseStatement === node.elseStatement){
                return node;
            }
            return new BoundIfStatement(condition, body, elseStatement);
        }

        protected rewriteWhileStatement (node: BoundWhileStatement): BoundStatement {
            const condition = this.rewriteExpression(node.condition);
            const body = this.rewriteStatement(node.body);
            if(condition === node.condition && body === node.body){
                return node;
            }
            return new BoundWhileStatement(condition, body);
        }

        protected rewriteForStatement (node: BoundForStatement): BoundStatement {
            const lowerBound = this.rewriteExpression(node.lowerBound);
            const upperBound = this.rewriteExpression(node.upperBound);
            const body = this.rewriteStatement(node.body);
            if(lowerBound === node.lowerBound && upperBound === node.upperBound && body === node.body){
                return node;
            }
            return new BoundForStatement(node.variable, lowerBound, upperBound, body);
        }

        protected rewriteLabelStatement (node: BoundLabelStatement): BoundStatement {
            return node;
        }

        protected rewriteGoToStatement (node: BoundGoToStatement): BoundStatement {
            return node;
        }

        protected rewriteConditionalGoToStatement (node: BoundConditionalGoToStatement): BoundStatement {
            const condition = this.rewriteExpression(node.condition);
            if(node.condition === condition){
                return node;
            }
            return new BoundConditionalGoToStatement(node.label, condition, node.jumpIfTrue);
        }

        protected rewriteExpressionStatement (node: BoundExpressionStatement): BoundStatement {
            const expression = this.rewriteExpression(node.expression);
            if(node.expression === expression){
                return node;
            }
            return new BoundExpressionStatement(expression);
        }

        public rewriteExpression (node: BoundExpression): BoundExpression {
            switch (node.kind) {
                case BoundNodeKind.ErrorExpression:
                    return this.rewriteErrorExpression(node as BoundErrorExpression);
                case BoundNodeKind.LiteralExpression:
                    return this.rewriteLiteralExpression(node as BoundLiteralExpression);
                case BoundNodeKind.VariableExpression:
                    return this.rewriteVariableExpression(node as BoundVariableExpression);
                case BoundNodeKind.AssignmentExpression:
                    return this.rewriteAssignmentExpression(node as BoundAssignmentExpression);
                case BoundNodeKind.UnaryExpression:
                    return this.rewriteUnaryExpression(node as BoundUnaryExpression);
                case BoundNodeKind.BinaryExpression:
                    return this.rewriteBinaryExpression(node as BoundBinaryExpression);
                case BoundNodeKind.CallExpression:
                    return this.rewriteCallExpression(node as BoundCallExpression);
                case BoundNodeKind.ConversionExpression:
                    return this.rewriteConversionExpression(node as BoundConversionExpression);
                default:
                    throw new Error(`Unexpected node king ${node.kind}`);
            }
        }

        protected rewriteErrorExpression (node: BoundErrorExpression): BoundExpression{
            return node;
        }

        protected rewriteLiteralExpression (node: BoundLiteralExpression): BoundExpression{
            return node;
        }

        protected rewriteVariableExpression (node: BoundVariableExpression): BoundExpression{
            return node;
        }

        protected rewriteAssignmentExpression (node: BoundAssignmentExpression): BoundExpression{
            const expression = this.rewriteExpression(node.expression);
            if(node.expression === expression){
                return node;
            }
            return new BoundAssignmentExpression(node.variable, expression);
        }

        protected rewriteUnaryExpression (node: BoundUnaryExpression): BoundExpression{
            const operand = this.rewriteExpression(node.operand);
            if(node.operand === operand){
                return node;
            }
            return new BoundUnaryExpression(node.operator, operand);
        }

        protected rewriteBinaryExpression (node: BoundBinaryExpression): BoundExpression{
            const left = this.rewriteExpression(node.left);
            const right = this.rewriteExpression(node.right);
            if(left === node.left && right === node.right){
                return node;
            }
            return new BoundBinaryExpression(left, node.operator, right);
        }

        protected rewriteCallExpression (node: BoundCallExpression): BoundExpression {
            let callArguments: BoundExpression[] | null = null;
            for (let i = 0; i < node.callArguments.length; i++) {
                const oldExpression = node.callArguments[i];
                const newExpression = this.rewriteExpression(oldExpression);
                if(newExpression !== oldExpression){
                    if(callArguments === null){
                        callArguments = [];
                        for (let j = 0; j < i; j++) {
                            callArguments.push(node.callArguments[j]);
                        }
                    }
                }
                if(callArguments !== null){
                    callArguments.push(newExpression);
                }
            }
            if(callArguments === null){
                return node;
            }
            return new BoundCallExpression(node.func, callArguments);
        }

        protected rewriteConversionExpression (node: BoundConversionExpression){
            const expression = this.rewriteExpression(node.expression);
            if(node.expression === expression){
                return node;
            }
            return new BoundConversionExpression(node.type, expression);
        }
    }
}