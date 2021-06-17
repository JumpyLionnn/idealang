///<reference path="boundExpression.ts"/>
namespace Idealang{
    export class BoundBinaryExpression extends BoundExpression{
        private _left: BoundExpression;
        private _operator: BoundBinaryOperator;
        private _right: BoundExpression;
        constructor (left: BoundExpression, operator: BoundBinaryOperator, right: BoundExpression){
            super();
            this._left = left;
            this._operator = operator;
            this._right = right;
            this._type = operator.resultType;
            this._kind = BoundNodeKind.BinaryExpression;
        }

        public get left (){return this._left;}
        public get operator (){return this._operator;}
        public get right (){return this._right;}

        public getChildren (){
            return [this._left, this._right];
        }
    }
}
