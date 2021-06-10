///<reference path="./boundStatement.ts" />
namespace Idealang{
    export class BoundBlockStatement extends BoundStatement {
        private _statements: BoundStatement[];
        constructor (statements: BoundStatement[]) {
            super();
            this._statements = statements;
            this._kind = BoundNodeKind.BlockStatement;
        }

        public get statements (){return this._statements;}
    }
}