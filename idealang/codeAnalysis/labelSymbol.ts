namespace Idealang{
    export class LabelSymbol{
        private _name: string;
        constructor (name: string){
            this._name = name;
        }
        public get name (): string{return this._name;}

        public toString (): string{return this._name;}
    }
}