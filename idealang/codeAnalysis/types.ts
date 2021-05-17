

type all = number | boolean;

enum Type{
    int = "int",
    float = "float",
    boolean = "boolean",
}

namespace Type {
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
            return Type.boolean;
        }
        else{
            throw new Error("Unknown Type.");
        }
    }


}


type VariablesMap = Map<VariableSymbol, all | null>;