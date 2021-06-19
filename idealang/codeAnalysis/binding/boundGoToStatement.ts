namespace Idealang{
    export class BoundGoToStatement extends BoundStatement{
        private _label: LabelSymbol;
        public constructor (label: LabelSymbol){
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