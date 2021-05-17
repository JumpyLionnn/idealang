function getMapKey (map: VariablesMap, checker: (variable: VariableSymbol) => boolean){
    for(const [key, value] of map){
        if(checker(key)){
            return key;
        }
    }
}