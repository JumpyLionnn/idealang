/// <reference path="variableSymbol.ts"/>
namespace Idealang{
    export class ParameterSymbol extends VariableSymbol {
        constructor (name: string, type: TypeSymbol) {
            super(name, true, type);
            this._kind = SymbolKind.Parameter;
        }
    }
}