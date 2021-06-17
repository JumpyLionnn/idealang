namespace Idealang{
    export class BoundAssignmentExpression extends BoundExpression {
        private _variable: VariableSymbol;
        private _expression: BoundExpression;
        constructor (variable: VariableSymbol, expression: BoundExpression) {
            super();
            this._variable = variable;
            this._expression = expression;
            this._kind = BoundNodeKind.AssignmentExpression;
            this._type = expression.type;
        }

        public get variable (): VariableSymbol{return this._variable;}
        public get expression (): BoundExpression{return this._expression;}

        public getChildren (){
            return [this._expression];
        }
    }
}
