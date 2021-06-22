namespace Idealang{
    export abstract class Symbol {
        private _name: string;
        protected _kind: SymbolKind;
        constructor (name: string) {
            this._name = name;
        }

        public get name (){return this._name;}
        public get kind (){return this._kind;}

        public toString (){
            return this._name;
        }
    }
}