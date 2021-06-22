namespace Idealang{
    export class BoundLabelStatement extends BoundStatement{
        private _label: BoundLabel;
        public constructor (label: BoundLabel){
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