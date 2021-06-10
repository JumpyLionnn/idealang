class AnnotatedText {
    private _text: string;
    private _spans: Idealang.TextSpan[];
    constructor (text: string, spans: Idealang.TextSpan[]) {
        this._text = text;
        this._spans = spans;
    }

    public get text (){return this._text;}
    public get spans (){return this._spans;}

    public static parse (text: string): AnnotatedText{
        text= this.unindent(text);

        let resultText = "";
        const resultSpans: Idealang.TextSpan[] = [];

        const startStack: number[] = [];

        let position = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if(char === "["){
                startStack.push(position);
            }
            else if (char === "]"){
                if(startStack.length === 0){
                    throw new Error("Too many ']' in text");
                }
                else{
                    const start = startStack.pop() as number;
                    const end = position;
                    const span = Idealang.TextSpan.fromBounds(start, end);
                    resultSpans.push(span);
                }
            }
            else{
                position++;
                resultText += char;
            }
        }

        if(startStack.length !== 0){
            throw new Error("Missing ']' in text");
        }

        return new AnnotatedText(resultText, resultSpans);
    }

    private static unindent (text: string): string{
        const lines: string[] = this.unindentLines(text);
        return lines.join("\n");
    }

    public static unindentLines (text: string){
        const lines: string[] = text.split(/[\r\n]/);

        let minIndentation: number = 2147483647;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if(line.trim().length === 0){
                lines[i] = "";
                continue;
            }
            const indentation = line.length - line.trimStart().length;
            minIndentation = Math.min(minIndentation, indentation);
        }

        for (let i = 0; i < lines.length; i++) {
            if(lines[i].length === 0){
                continue;
            }
            lines[i] = lines[i].substring(minIndentation);
        }

        while (lines.length > 0 && lines[0].length === 0) {
            lines.shift();
        }

        while (lines.length > 0 && lines[lines.length - 1].length === 0) {
            lines.pop();
        }

        return lines;
    }
}