namespace Idealang{
    export class TextSpan {
        private _start: number;
        private _length: number;
        constructor (start: number, length: number) {
            this._start = start;
            this._length = length;
        }

        public get start (): number{return this._start;}
        public get length (): number{return this._length;}
        public get end (): number{return this._length + this._start;}

        public static fromBounds (start: number, end: number){
            return new TextSpan(start, end - start);
        }

        public toString (): string{
            return `${this.start}..${this.end}`;
        }
    }
}
