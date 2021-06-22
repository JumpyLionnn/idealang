namespace Idealang{
    export class BoundErrorExpression extends BoundExpression {
        constructor () {
            super();
            this._kind = BoundNodeKind.ErrorExpression;
            this._type = TypeSymbol.Error;
        }

        public getChildren (){
            return [];
        }
    }
}