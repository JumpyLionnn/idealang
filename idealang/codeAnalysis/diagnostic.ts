namespace Idealang{
    export class Diagnostic {
        private _span: TextSpan;
        private _message: string;
        constructor (span: TextSpan, message: string) {
            this._span = span;
            this._message = message;
        }

        public get span (): TextSpan{return this._span;}
        public get message (): string{return this._message;}

        public toString (): string{
            return this._message;
        }
    }
}
