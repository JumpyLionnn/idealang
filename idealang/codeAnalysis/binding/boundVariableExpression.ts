namespace Idealang{
    export class BoundVariableExpression extends BoundExpression {
        private _variable: VariableSymbol;
        constructor (variable: VariableSymbol) {
            super();
            this._variable = variable;
            this.kind = BoundNodeKind.VariableExpression;
            this.type = variable.type;
        }

        public get variable (): VariableSymbol{return this._variable;}
    }
}