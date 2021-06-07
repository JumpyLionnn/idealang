///<reference path="../textSpan.ts" />

namespace Idealang{
    export class SyntaxToken{
        private _kind: SyntaxKind;
        private _text: string;
        private _position: number;
        private _value: all;
        constructor (kind: SyntaxKind, position: number, text: string, value: all | null){
            this._kind = kind;
            this._position = position;
            this._text = text;
            if(value){
                this._value = value;
            }
        }

        public get kind (){return this._kind;}
        public get text (){return this._text;}
        public get position (){return this._position;}
        public get value (){return this._value;}
        public get span (){return new TextSpan(this._position, this._text.length);}
    }
}
