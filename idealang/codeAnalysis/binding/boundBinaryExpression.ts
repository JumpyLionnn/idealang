///<reference path="boundExpression.ts"/>
namespace Idealang{
    export class BoundBinaryExpression extends BoundExpression{
        public left: BoundExpression;
        public operator: BoundBinaryOperator;
        public right: BoundExpression;
        constructor (left: BoundExpression, operator: BoundBinaryOperator, right: BoundExpression){
            super();
            this.left = left;
            this.operator = operator;
            this.right = right;
            this.type = operator.resultType;
            this.kind = BoundNodeKind.BinaryExpression;
        }
    }
}
