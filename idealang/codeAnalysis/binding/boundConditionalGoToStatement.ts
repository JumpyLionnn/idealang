namespace Idealang{
    export class BoundConditionalGoToStatement extends BoundStatement{
        private _label: BoundLabel;
        private _condition: BoundExpression;
        private _jumpIfTrue: boolean;
        public constructor (label: BoundLabel, condition: BoundExpression, jumpIfTrue: boolean){
            super();
            this._label = label;
            this._condition = condition;
            this._jumpIfTrue = jumpIfTrue;
            this._kind = BoundNodeKind.ConditionalGoToStatement;
        }

        public get label (){return this._label;}
        public get condition (){return this._condition;}
        public get jumpIfTrue (){return this._jumpIfTrue;}

        public getChildren (){
            return [];
        }
    }
}