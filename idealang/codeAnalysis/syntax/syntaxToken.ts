
namespace Idealang{
    export class SyntaxToken extends SyntaxNode{
        private _text: string;
        private _position: number;
        private _value: all | null;
        constructor (kind: SyntaxKind, position: number, text: string, value: all | null){
            super();
            this._kind = kind;
            this._position = position;
            this._text = text;
            this._value = value;
        }

        public get text (){return this._text;}
        public get position (){return this._position;}
        public get value (){return this._value;}
        public get span (){return new TextSpan(this._position, this._text.length);}

        public getChildren (){
            return [];
        }
    }
}
