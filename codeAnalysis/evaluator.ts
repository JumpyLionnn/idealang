///<reference path="unaryExpressionSyntax.ts" />

class Evaluator {
    private _root: ExpressionSyntax;
    constructor (root: ExpressionSyntax) {
        this._root = root;
    }

    public evaluate (): number{
        return this.evaluateExpression(this._root);
    }

    private evaluateExpression (node: ExpressionSyntax): number{

        if(node instanceof LiteralExpressionSyntax){
            return node.literalToken.value as number;
        }

        if(node instanceof UnaryExpressionSyntax){
            const operand = this.evaluateExpression(node.operand);
            if(node.operatorToken.type === SyntaxType.PlusToken){
                return operand;
            }
            else if(node.operatorToken.type === SyntaxType.MinusToken){
                return -operand;
            }
            throw new Error(`Unexpected unary operator ${node.operatorToken.type}`);
        }

        if(node instanceof BinaryExpressionSyntax){
            const left = this.evaluateExpression(node.left);
            const right = this.evaluateExpression(node.right);

            if(node.operatorToken.type === SyntaxType.PlusToken){
                return left + right;
            }
            else if(node.operatorToken.type === SyntaxType.MinusToken){
                return left - right;
            }
            else if(node.operatorToken.type === SyntaxType.StarToken){
                return left * right;
            }
            else if(node.operatorToken.type === SyntaxType.SlashToken){
                return left / right;
            }
            else{
                throw new Error(`Unexpected binary operator ${node.operatorToken.type}`);
            }
        }
        if(node instanceof ParenthesizedExpressionSyntax){
            return this.evaluateExpression(node.expression);
        }
        throw new Error(`Unexpected node ${node.type}`);
    }
}