namespace Idealang{
    export class TextLine {
        private _sourceText: SourceText;
        private _start: number;
        private _length: number;
        private _lengthIncludingLineBreak: number;
        constructor (sourceText: SourceText, start: number, length: number, lengthIncludingLineBreak: number) {
            this._sourceText = sourceText;
            this._start = start;
            this._length = length;
            this._lengthIncludingLineBreak = lengthIncludingLineBreak;
        }

        public get sourceText (){return this._sourceText;}
        public get start (){return this._start;}
        public get length (){return this._length;}
        public get end (){return this._start + this._length;}
        public get lengthIncludingLineBreak (){return this._lengthIncludingLineBreak;}
        public get span (){return new TextSpan(this._start, this._length);}
        public get spanIncludingLineBreak (){return new TextSpan(this._start, this._lengthIncludingLineBreak);}
    }
}