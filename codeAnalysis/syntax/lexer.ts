/// <reference path="./syntaxToken.ts" />

class Lexer{
    private _text: string;
    private _position: number = 0;
    private _diagnostics: string[] = [];
    public constructor (text: string){
        this._text = text;
    }

    private get currentChar (): string{
        return this.peek(0);
    }

    private get lookAhead (): string{
        return this.peek(1);
    }

    private peek (offset: number){
        const index = this._position + offset;
        if(index === this._text.length){
            return "\0";
        }
        return this._text.charAt(index);
    }

    private next (): void{
        this._position++;
    }

    public nextToken (): SyntaxToken {
        if(this._position >= this._text.length){
            return new SyntaxToken(SyntaxKind.EndOfFileToken, this._position, "\0", null);
        }

        if(/[0-9]/.test(this.currentChar)){
            const start: number = this._position;
            while(/[0-9]/.test(this.currentChar)){
                this.next();
            }

            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxKind.NumberToken, start, text, parseInt(text));
        }
        if(/\s/.test(this.currentChar)){
            const start: number = this._position;
            while(/\s/.test(this.currentChar)){
                this.next();
            }

            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxKind.WhitespaceToken, start, text, null);
        }

        if(/[a-zA-Z]/.test(this.currentChar)){
            const start: number = this._position;
            while(/[a-zA-Z]/.test(this.currentChar)){
                this.next();
            }

            const text = this._text.substring(start, this._position);
            const kind = SyntaxFacts.getKeywordKind(text);
            return new SyntaxToken(kind, start, text, null);
        }

        switch (this.currentChar) {
            case "+":
                return new SyntaxToken(SyntaxKind.PlusToken, this._position++, "+", null);
            case "-":
                return new SyntaxToken(SyntaxKind.MinusToken, this._position++, "-", null);
            case "*":
                return new SyntaxToken(SyntaxKind.StarToken, this._position++, "*", null);
            case "/":
                return new SyntaxToken(SyntaxKind.SlashToken, this._position++, "/", null);
            case "(":
                return new SyntaxToken(SyntaxKind.OpenParenthesisToken, this._position++, "(", null);
            case ")":
                return new SyntaxToken(SyntaxKind.CloseParenthesisToken, this._position++, ")", null);
            case "&":
                if(this.lookAhead === "&"){
                    return new SyntaxToken(SyntaxKind.AmpersandAmpersandToken, this._position += 2, "&&", null);
                }
                break;
            case "|":
                if(this.lookAhead === "|"){
                    return new SyntaxToken(SyntaxKind.PipePipeToken, this._position += 2, "||", null);
                }
                break;
            case "=":
                if(this.lookAhead === "="){
                    return new SyntaxToken(SyntaxKind.EqualsEqualsToken, this._position += 2, "==", null);
                }
                break;
            case "!":
                if(this.lookAhead === "="){
                    return new SyntaxToken(SyntaxKind.BangEqualsToken, this._position += 2, "!=", null);
                }
                return new SyntaxToken(SyntaxKind.BangToken, this._position++, "!", null);
        }
        this._diagnostics.push(`ERROR: bad character input: '${this.currentChar}'`);
        return new SyntaxToken(SyntaxKind.BadToken, this._position++, this._text.charAt(this._position - 1), null);
    }

    get diagnostics (): string[]{
        return this._diagnostics;
    }
}