namespace Idealang{
    export class BoundScope {
        private _variables: Map<string, VariableSymbol> = new Map<string, VariableSymbol>();
        private _functions: Map<string, FunctionSymbol> = new Map<string, FunctionSymbol>();
        private _parent: BoundScope | null;

        constructor (parent: BoundScope | null) {
            this._parent = parent;
        }

        public get parent (){return this._parent;}

        public tryDeclareVariable (variable: VariableSymbol): boolean {
            if(this._variables.has(variable.name)){
                return false;
            }

            this._variables.set(variable.name, variable);
            return true;
        }

        public tryLookupVariable (name: string): VariableSymbol | null {
            const variable = this._variables.get(name);
            if(variable !== undefined){
                return variable;
            }

            if(this._parent === null){
                return null;
            }

            return this._parent.tryLookupVariable(name);
        }

        public getDeclaredVariables (): VariableSymbol[]{
            return Array.from(this._variables.values());
        }


        public tryDeclareFunction (func: FunctionSymbol): boolean {
            if(this._functions.has(func.name)){
                return false;
            }

            this._functions.set(func.name, func);
            return true;
        }

        public tryLookupFunction (name: string): FunctionSymbol | null {
            const func = this._functions.get(name);
            if(func !== undefined){
                return func;
            }

            if(this._parent === null){
                return null;
            }

            return this._parent.tryLookupFunction(name);
        }

        public getDeclaredFunction (): FunctionSymbol[]{
            return Array.from(this._functions.values());
        }
    }
}