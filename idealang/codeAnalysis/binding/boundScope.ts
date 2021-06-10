namespace Idealang{
    export class BoundScope {
        private _variables: Map<string, VariableSymbol> = new Map<string, VariableSymbol>();
        private _parent: BoundScope | null;

        constructor (parent: BoundScope | null) {
            this._parent = parent;
        }

        public get parent (){return this._parent;}

        public tryDeclare (variable: VariableSymbol): boolean {
            if(this._variables.has(variable.name)){
                return false;
            }

            this._variables.set(variable.name, variable);
            return true;
        }

        public tryLookup (name: string): VariableSymbol | null {
            const variable = this._variables.get(name);
            if(variable !== undefined){
                return variable;
            }

            if(this._parent === null){
                return null;
            }

            return this._parent.tryLookup(name);
        }

        public getDeclaredVariables (): VariableSymbol[]{
            return Array.from(this._variables.values());
        }
    }
}