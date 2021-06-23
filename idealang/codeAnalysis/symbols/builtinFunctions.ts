///<reference path="parameterSymbol.ts" />
///<reference path="functionSymbol.ts" />
namespace Idealang{
    export class BuiltinFunctions {
        public static readonly print: FunctionSymbol = new FunctionSymbol("print", [new ParameterSymbol("text", TypeSymbol.string)], TypeSymbol.void);
        public static readonly input: FunctionSymbol = new FunctionSymbol("input", [new ParameterSymbol("text", TypeSymbol.string)], TypeSymbol.string);
        public static readonly random: FunctionSymbol = new FunctionSymbol("random", [new ParameterSymbol("max", TypeSymbol.int)], TypeSymbol.int);

        public static getAll (){
            return [this.print, this.input, this.random];
        }
    }
}