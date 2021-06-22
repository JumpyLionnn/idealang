
namespace Idealang{
    export type all = number | boolean | string;

    export enum Type{
        Error = "?",
        int = "int",
        float = "float",
        bool = "bool",
        string = "string",
        char = "char"
    }

    export namespace Type {
        export function getType (data: all): Type{
            switch (typeof data) {
                case "number":
                    if(data % 1 === 0){
                        return Type.int;
                    }
                    else{
                        return Type.float;
                    }
                case "boolean":
                    return Type.bool;
                case "string":
                    return Type.string;
                default:
                    throw new Error("Unknown Type.");
            }
        }


    }


    export type VariablesMap = Map<VariableSymbol, all | null>;
}

