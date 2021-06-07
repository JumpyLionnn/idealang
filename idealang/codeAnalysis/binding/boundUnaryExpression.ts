///<reference path="boundExpression.ts"/>
namespace Idealang{
    export class BoundUnaryExpression extends BoundExpression{
        private _operator: BoundUnaryOperator;
        private _operand: BoundExpression;
        constructor (operator: BoundUnaryOperator, operand: BoundExpression){
            super();
            this._operator = operator;
            this._operand = operand;
            this._type = operator.resultType;
            this._kind = BoundNodeKind.UnaryExpression;
        }

        public get operator (){return this._operator;}
        public get operand (){return this._operand;}
    }
}
