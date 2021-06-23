namespace Idealang{
    export class BoundCallExpression extends BoundExpression {
        private _func: FunctionSymbol;
        private _callArguments: BoundExpression[];
        constructor (func: FunctionSymbol, callArguments: BoundExpression[]) {
            super();
            this._func = func;
            this._callArguments = callArguments;
            this._type = func.type;
            this._kind = BoundNodeKind.CallExpression;
        }

        public get func (){return this._func;}
        public get callArguments (){return this._callArguments;}

        public getChildren (){
            return [];
        }
    }
}