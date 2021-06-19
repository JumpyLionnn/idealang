namespace Idealang{
    export class BoundLabelStatement extends BoundStatement{
        private _label: LabelSymbol;
        public constructor (label: LabelSymbol){
            super();
            this._label = label;
            this._kind = BoundNodeKind.LabelStatement;
        }

        public get label (){return this._label;}

        public getChildren (){
            return [];
        }
    }
}