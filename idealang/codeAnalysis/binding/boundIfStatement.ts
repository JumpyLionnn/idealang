namespace Idealang{
    export class BoundIfStatement extends BoundStatement {
        private _condition: BoundExpression;
        private _thenStatement: BoundStatement;
        private _elseStatement: BoundStatement | null;
        constructor (condition: BoundExpression, thenStatement: BoundStatement, elseStatement: BoundStatement | null = null) {
            super();
            this._condition = condition;
            this._thenStatement = thenStatement;
            this._elseStatement = elseStatement;
            this._kind = BoundNodeKind.IfStatement;
        }

        public get condition (){return this._condition;}
        public get thenStatement (){return this._thenStatement;}
        public get elseStatement (){return this._elseStatement;}

        public getChildren (){
            const children = [this._condition, this._thenStatement];
            if(this._elseStatement !== null){
                children.push(this._elseStatement);
            }
            return children;
        }
    }
}