namespace Idealang{
    export class BoundWhileStatement extends BoundStatement {
        private _condition: BoundExpression;
        private _body: BoundStatement;
        constructor (condition: BoundExpression, body: BoundStatement) {
            super();
            this._condition = condition;
            this._body = body;
            this._kind = BoundNodeKind.WhileStatement;
        }

        public get condition (){return this._condition;}
        public get body (){return this._body;}
    }
}