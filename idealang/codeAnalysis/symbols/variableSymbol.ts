/// <reference path="symbol.ts"/>
namespace Idealang{
    export class VariableSymbol extends Symbol{
        private _isReadOnly: boolean;
        private _type: TypeSymbol;
        constructor (name: string, isReadOnly: boolean, type: TypeSymbol){
            super(name);
            this._isReadOnly = isReadOnly;
            this._type = type;
            this._kind = SymbolKind.Variable;
        }
        public get isReadOnly (): boolean{return this._isReadOnly;}
        public get type (): TypeSymbol{return this._type;}
    }
}
