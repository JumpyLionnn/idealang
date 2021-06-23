namespace Idealang{
    export class FunctionSymbol extends Symbol {
        private _parameters: ParameterSymbol[];
        private _type: TypeSymbol;
        constructor (name: string, parameters: ParameterSymbol[], type: TypeSymbol) {
            super(name);
            this._parameters = parameters;
            this._type = type;
            this._kind = SymbolKind.Function;
        }

        public get parameters (){return this._parameters;}
        public get type (){return this._type;}
    }
}