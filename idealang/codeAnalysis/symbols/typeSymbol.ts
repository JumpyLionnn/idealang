namespace Idealang{
    export class TypeSymbol extends Symbol {
        private constructor (name: string) {
            super(name);
            this._kind = SymbolKind.Type;
        }
    }
}