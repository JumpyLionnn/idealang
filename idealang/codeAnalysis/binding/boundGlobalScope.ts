namespace Idealang{
    export class BoundGlobalScope {
        private _previous: BoundGlobalScope | null;
        private _diagnostics: Diagnostic[];
        private _variables: VariableSymbol[];
        private _statement: BoundStatement;
        constructor (previous: BoundGlobalScope| null, diagnostics: Diagnostic[], variables: VariableSymbol[], statement: BoundStatement) {
            this._previous = previous;
            this._diagnostics = diagnostics;
            this._variables = variables;
            this._statement = statement;
        }

        public get previous (){return this._previous;}
        public get diagnostics (){return this._diagnostics;}
        public get variables (){return this._variables;}
        public get statement (){return this._statement;}
    }
}