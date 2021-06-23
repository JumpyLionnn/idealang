namespace Idealang{
    export class BoundConversionExpression extends BoundExpression{
        private _expression: BoundExpression;
        public constructor (type: TypeSymbol, expression: BoundExpression){
            super();
            this._expression = expression;
            this._kind = BoundNodeKind.ConversionExpression;
            this._type = type;
        }

        public get expression (){return this._expression;}

        public getChildren (){
            return [];
        }
    }
}