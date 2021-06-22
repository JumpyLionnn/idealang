namespace Idealang{
    export class BoundErrorExpression extends BoundExpression {
        constructor () {
            super();
            this._kind = BoundNodeKind.ErrorExpression;
            this._type = Type.Error;
        }

        public getChildren (){
            return [];
        }
    }
}