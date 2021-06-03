
namespace Idealang{
    export class VariableSymbol{
        private _name: string;
        private _type: Type;
        constructor (name: string, type: Type){
            this._name = name;
            this._type = type;
        }
        public get name (): string{return this._name;}
        public get type (): Type{return this._type;}
    }
}
