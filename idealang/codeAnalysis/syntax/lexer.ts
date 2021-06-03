/// <reference path="./syntaxToken.ts" />
namespace Idealang{
    export class Lexer{
        private _text: string;
        private _position: number = 0;
        private _diagnostics: DiagnosticBag = new DiagnosticBag();
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
            const start: number = this._position;
            if(/[0-9]/.test(this.currentChar)){
                while(/[0-9]/.test(this.currentChar)){
                    this.next();
                }
                const text = this._text.substring(start, this._position);
                const int = parseInt(text);
                if(int > 2147483648 || int < -2147483648){
                    this._diagnostics.reportInvalidNumber(new TextSpan(start, start - this._position), this._text, Type.int);
                }
                return new SyntaxToken(SyntaxKind.NumberToken, start, text, int);
            }
            if(/\s/.test(this.currentChar)){
                while(/\s/.test(this.currentChar)){
                    this.next();
                }
                const text = this._text.substring(start, this._position);
                return new SyntaxToken(SyntaxKind.WhitespaceToken, start, text, null);
            }

            if(/[a-zA-Z]/.test(this.currentChar)){
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
                        this._position += 2;
                        return new SyntaxToken(SyntaxKind.AmpersandAmpersandToken, start, "&&", null);
                    }
                    break;
                case "|":
                    if(this.lookAhead === "|"){
                        this._position += 2;
                        return new SyntaxToken(SyntaxKind.PipePipeToken, start, "||", null);
                    }
                    break;
                case "=":
                    if(this.lookAhead === "="){
                        this._position += 2;
                        return new SyntaxToken(SyntaxKind.EqualsEqualsToken, start, "==", null);
                    }
                    else{
                        this._position++;
                        return new SyntaxToken(SyntaxKind.EqualsToken, start, "=", null);
                    }
                case "!":
                    if(this.lookAhead === "="){
                        this._position += 2;
                        return new SyntaxToken(SyntaxKind.BangEqualsToken, start, "!=", null);
                    }
                    this._position++;
                    return new SyntaxToken(SyntaxKind.BangToken, start, "!", null);
            }
            this._diagnostics.reportBadCharacter(this._position, this.currentChar);
            return new SyntaxToken(SyntaxKind.BadToken, this._position++, this._text.charAt(this._position - 1), null);
        }

        get diagnostics (): DiagnosticBag{
            return this._diagnostics;
        }
    }
}
