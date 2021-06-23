namespace Idealang{
    export class BoundErrorExpression extends BoundExpression {
        constructor () {
            super();
            this._kind = BoundNodeKind.ErrorExpression;
            this._type = TypeSymbol.error;
        }

        public getChildren (){
            return [];
        }
    }
}