/// <reference path="./evaluator.ts"/>
/// <reference path="./evaluationResult.ts"/>
namespace Idealang{
    export class Compilation {
        private _globalScope: BoundGlobalScope;
        private _syntaxTree: SyntaxTree;

        private _previous: Compilation | null = null;

        public constructor (syntaxTreeOrPrevious: SyntaxTree | Compilation, syntaxTree?: SyntaxTree) {
            if(syntaxTreeOrPrevious instanceof SyntaxTree && syntaxTree === undefined){
                this._syntaxTree = syntaxTreeOrPrevious;
            }
            else if(syntaxTreeOrPrevious instanceof Compilation && syntaxTree !== undefined){
                this._syntaxTree = syntaxTree;
                this._previous = syntaxTreeOrPrevious;
            }
        }
        public get syntax (): SyntaxTree{return this._syntaxTree;}

        public get globalScope (): BoundGlobalScope{
            if(this._globalScope === undefined){
                this._globalScope = Binder.bindGlobalScope(this._previous !== null ? this._previous._globalScope : null, this._syntaxTree.root);
            }
            return this._globalScope;
        }

        public continueWith (syntax: SyntaxTree){
            return new Compilation(this, syntax);
        }

        public evaluate (variables: VariablesMap): EvaluationResult{
            const diagnostics = this._syntaxTree.diagnostics;
            diagnostics.push(...this.globalScope.diagnostics);
            if(diagnostics.length > 0){
                return new EvaluationResult(diagnostics);
            }

            const statement = this.getStatement();
            const evaluator = new Evaluator(statement, variables);
            const value = evaluator.evaluate();
            return new EvaluationResult([], value);
        }
        private getStatement (): BoundBlockStatement {
            return Lowerer.lower(this.globalScope.statement);
        }

        public emitTree (builder: TextBuilder){
            this.globalScope.statement.writeTo(builder);
        }
    }
}
