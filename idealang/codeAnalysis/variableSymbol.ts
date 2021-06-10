
namespace Idealang{
    export class VariableSymbol{
        private _name: string;
        private _isReadOnly: boolean;
        private _type: Type;
        constructor (name: string, isReadOnly: boolean, type: Type){
            this._name = name;
            this._isReadOnly = isReadOnly;
            this._type = type;
        }
        public get name (): string{return this._name;}
        public get isReadOnly (): boolean{return this._isReadOnly;}
        public get type (): Type{return this._type;}
    }
}
