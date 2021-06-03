/// <reference path="./evaluator.ts"/>
/// <reference path="./evaluationResult.ts"/>
namespace Idealang{
    export class Compilation {
        private _syntax: SyntaxTree;
        constructor (syntax: SyntaxTree) {
            this._syntax = syntax;
        }
        public get syntax (): SyntaxTree{return this._syntax;}

        public evaluate (variables: VariablesMap): EvaluationResult{
            const binder = new Binder(variables);
            const boundExpression = binder.bindExpression(this._syntax.root);

            const diagnostics = this._syntax.diagnostics;
            diagnostics.push(...binder.diagnostics.toArray());
            if(diagnostics.length > 0){
                return new EvaluationResult(diagnostics);
            }

            const evaluator = new Evaluator(boundExpression, variables);
            const value = evaluator.evaluate();
            return new EvaluationResult([], value);
        }
    }
}
