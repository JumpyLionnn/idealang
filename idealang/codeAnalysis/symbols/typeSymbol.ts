///<reference path="symbol.ts"/>
///<reference path="symbolKind.ts"/>
namespace Idealang{
    export class TypeSymbol extends Symbol {
        public static readonly Error = new  TypeSymbol("?");
        public static readonly int = new  TypeSymbol("int");
        public static readonly float = new  TypeSymbol("float");
        public static readonly bool = new  TypeSymbol("bool");
        public static readonly string = new  TypeSymbol("string");
        public static readonly char = new  TypeSymbol("char");
        private constructor (name: string) {
            super(name);
            this._kind = SymbolKind.Type;
        }


        public static getType (data: all): TypeSymbol{
            switch (typeof data) {
                case "number":
                    if(data % 1 === 0){
                        return TypeSymbol.int;
                    }
                    else{
                        return TypeSymbol.float;
                    }
                case "boolean":
                    return TypeSymbol.bool;
                case "string":
                    return TypeSymbol.string;
                default:
                    throw new Error("Unknown Type.");
            }
        }
    }
}