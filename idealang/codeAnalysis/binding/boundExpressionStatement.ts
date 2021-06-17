///<reference path="./boundStatement.ts" />
namespace Idealang{
    export class BoundExpressionStatement extends BoundStatement {
        private _expression: BoundExpression;
        constructor (expression: BoundExpression) {
            super();
            this._expression = expression;
            this._kind = BoundNodeKind.ExpressionStatement;
        }

        public get expression (){return this._expression;}

        public getChildren (){
            return [this._expression];
        }
    }
}