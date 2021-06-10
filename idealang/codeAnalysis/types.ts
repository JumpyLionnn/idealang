
namespace Idealang{
    export type all = number | boolean;

    export enum Type{
        int = "int",
        float = "float",
        bool = "bool",
    }

    export namespace Type {
        export function getType (data: all): Type{
            if(typeof data === "number"){
                if(data % 1 === 0){
                    return Type.int;
                }
                else{
                    return Type.float;
                }
            }
            else if(typeof data === "boolean"){
                return Type.bool;
            }
            else{
                throw new Error("Unknown Type.");
            }
        }


    }


    export type VariablesMap = Map<VariableSymbol, all | null>;
}

