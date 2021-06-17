namespace Idealang{
    export class BoundVariableExpression extends BoundExpression {
        private _variable: VariableSymbol;
        constructor (variable: VariableSymbol) {
            super();
            this._variable = variable;
            this._kind = BoundNodeKind.VariableExpression;
            this._type = variable.type;
        }

        public get variable (): VariableSymbol{return this._variable;}

        public getChildren (){
            return [];
        }
    }
}