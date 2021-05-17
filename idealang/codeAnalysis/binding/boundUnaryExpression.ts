///<reference path="boundExpression.ts"/>
class BoundUnaryExpression extends BoundExpression{
    public operator: BoundUnaryOperator;
    public operand: BoundExpression;
    constructor (operator: BoundUnaryOperator, operand: BoundExpression){
        super();
        this.operator = operator;
        this.operand = operand;
        this.type = operator.resultType;
        this.kind = BoundNodeKind.UnaryExpression;
    }
}