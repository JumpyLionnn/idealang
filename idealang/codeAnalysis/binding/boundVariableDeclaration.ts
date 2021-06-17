namespace Idealang{
    export class BoundVariableDeclaration extends BoundStatement {
        private _variable: VariableSymbol;
        private _initializer: BoundExpression;
        constructor (variable: VariableSymbol, initializer: BoundExpression) {
            super();
            this._variable = variable;
            this._initializer = initializer;
            this._kind = BoundNodeKind.VariableDeclaration;
        }

        public get variable (){return this._variable;}
        public get initializer (){return this._initializer;}

        public getChildren (){
            return [this._initializer];
        }
    }
}