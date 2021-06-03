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

        public get kind (): SyntaxKind{return this._kind;}
        public get text (): string{return this._text;}
        public get position (): number{return this._position;}
        public get value (): all{return this._value;}
        public get span (): TextSpan{return new TextSpan(this._position, this._text.length);}
    }
}
