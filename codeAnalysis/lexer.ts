/// <reference path="./syntaxToken.ts" />

class Lexer{
    private _text: string;
    private _position: number = 0;
    private _diagnostics: string[] = [];
    public constructor (text: string){
        this._text = text;
    }

    private get currentChar (): string{
        if(this._position === this._text.length){
            return "\0";
        }
        return this._text.charAt(this._position);
    }

    private next (): void{
        this._position++;
    }

    public nextToken (): SyntaxToken {
        if(this._position >= this._text.length){
            return new SyntaxToken(SyntaxType.EndOfFileToken, this._position, "\0", null);
        }

        if(/[0-9]/.test(this.currentChar)){
            const start: number = this._position;
            while(/[0-9]/.test(this.currentChar)){
                this.next();
            }

            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxType.NumberToken, start, text, parseInt(text));
        }
        if(/\s/.test(this.currentChar)){
            const start: number = this._position;
            while(/\s/.test(this.currentChar)){
                this.next();
            }

            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxType.WhitespaceToken, start, text, null);
        }

        if(this.currentChar === "+"){
            return new SyntaxToken(SyntaxType.PlusToken, this._position++, "+", null);
        }
        else if(this.currentChar === "-"){
            return new SyntaxToken(SyntaxType.MinusToken, this._position++, "-", null);
        }
        else if(this.currentChar === "*"){
            return new SyntaxToken(SyntaxType.StarToken, this._position++, "*", null);
        }
        else if(this.currentChar === "/"){
            return new SyntaxToken(SyntaxType.SlashToken, this._position++, "/", null);
        }
        else if(this.currentChar === "("){
            return new SyntaxToken(SyntaxType.OpenParenthesisToken, this._position++, "(", null);
        }
        else if(this.currentChar === ")"){
            return new SyntaxToken(SyntaxType.CloseParenthesisToken, this._position++, ")", null);
        }

        this._diagnostics.push(`ERROR: bad character in input: '${this.currentChar}'`);
        return new SyntaxToken(SyntaxType.BadToken, this._position++, this._text.charAt(this._position - 1), null);
    }

    get diagnostics (): string[]{
        return this._diagnostics;
    }
}