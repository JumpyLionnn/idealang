namespace Idealang{
    export class SourceText {
        private readonly _text: string;
        private _lines: TextLine[] = [];
        private constructor (text: string) {
            this._text = text;
            this._lines = SourceText.parseLines(this, text);
        }

        public charAt (index: number) {
            return this._text.charAt(index);
        }

        public get length (){
            return this._text.length;
        }

        public get lines (){return this._lines;}

        public getLineIndex (position: number){
            let lower = 0;
            let upper = this._lines.length - 1;
            while (lower <= upper){
                const index = lower + Math.floor((upper - lower) / 2);
                const start = this._lines[index].start;

                if(position === start){
                    return index;
                }

                if(start < position){
                    lower = index + 1;
                }
                else{
                    upper = index - 1;
                }
            }
            return lower - 1;
        }
        public toString (startOrTextSpan: number | TextSpan = 0, length: number = this._text.length){
            if(startOrTextSpan instanceof TextSpan){
                return this._text.substring(startOrTextSpan.start, startOrTextSpan.end);
            }
            return this._text.substring(startOrTextSpan, startOrTextSpan + length);
        }

        private static parseLines (sourceText: SourceText, text: string){
            const result: TextLine[] = [];
            let position = 0;
            let lineStart = 0;
            while (position < text.length) {
                const lineBreakWidth = this.getLineBreakWidth(text, position);
                if(lineBreakWidth === 0){
                    position++;
                }
                else{
                    this.addLine(result, sourceText, position, lineStart, lineBreakWidth);
                    position += lineBreakWidth;
                    lineStart = position;
                }
            }

            if (position >= lineStart) {
                this.addLine(result, sourceText, position, lineStart, 0);
            }

            return result;
        }

        private static addLine (result: TextLine[], sourceText: SourceText, position: number, lineStart: number, lineBreakWidth: number){
            const lineLength = position - lineStart;
            const line = new TextLine(sourceText, lineStart, lineLength, lineLength + lineBreakWidth);
            result.push(line);
        }

        private static getLineBreakWidth (text: string, position: number): number{
            const char = text[position];
            const lookahead = position >= text.length ? "\0" : text[position + 1];

            if(char === "\r" && lookahead === "\n")
                return 2;
            else if(char === "\r" || lookahead === "\n")
                return 1;
            else
                return 0;
        }

        public static from (text: string): SourceText{
            return new SourceText(text);
        }
    }
}