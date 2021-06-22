namespace Idealang{
    export class BoundGoToStatement extends BoundStatement{
        private _label: BoundLabel;
        public constructor (label: BoundLabel){
            super();
            this._label = label;
            this._kind = BoundNodeKind.GoToStatement;
        }

        public get label (){return this._label;}

        public getChildren (){
            return [];
        }
    }
}