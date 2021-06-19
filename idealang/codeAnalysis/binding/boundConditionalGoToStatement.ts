namespace Idealang{
    export class BoundConditionalGoToStatement extends BoundStatement{
        private _label: LabelSymbol;
        private _condition: BoundExpression;
        private _jumpIfFalse: boolean;
        public constructor (label: LabelSymbol, condition: BoundExpression, jumpIfFalse: boolean){
            super();
            this._label = label;
            this._condition = condition;
            this._jumpIfFalse = jumpIfFalse;
            this._kind = BoundNodeKind.ConditionalGoToStatement;
        }

        public get label (){return this._label;}
        public get condition (){return this._condition;}
        public get jumpIfFalse (){return this._jumpIfFalse;}

        public getChildren (){
            return [];
        }
    }
}