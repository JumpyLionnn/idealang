/// <reference path="./syntaxToken.ts" />
namespace Idealang{
    export class Lexer{
        private _text: SourceText;
        private readonly _diagnostics: DiagnosticBag = new DiagnosticBag();

        private _position: number = 0;

        private _start: number = 0;
        private _kind: SyntaxKind;
        private _value: all | null;
        public constructor (text: SourceText){
            this._text = text;
        }

        private get current (): string{
            return this.peek(0);
        }

        private get lookAhead (): string{
            return this.peek(1);
        }

        private get lookBehind (): string{
            return this.peek(-1);
        }

        private peek (offset: number){
            const index = this._position + offset;
            if(index >= this._text.length || index < 0){
                return "\0";
            }
            return this._text.charAt(index);
        }

        public nextToken (): SyntaxToken {
            this._start = this._position;
            this._kind = SyntaxKind.BadToken;
            this._value = null;
            switch (this.current) {
                case "\0":
                    this._kind = SyntaxKind.EndOfFileToken;
                    break;
                case "+":
                    this._kind = SyntaxKind.PlusToken;
                    this._position++;
                    break;
                case "-":
                    this._kind = SyntaxKind.MinusToken;
                    this._position++;
                    break;
                case "*":
                    this._kind = SyntaxKind.StarToken;
                    this._position++;
                    break;
                case "/":
                    this._kind = SyntaxKind.SlashToken;
                    this._position++;
                    break;
                case "(":
                    this._kind = SyntaxKind.OpenParenthesisToken;
                    this._position++;
                    break;
                case ")":
                    this._kind = SyntaxKind.CloseParenthesisToken;
                    this._position++;
                    break;
                case "{":
                    this._kind = SyntaxKind.OpenBraceToken;
                    this._position++;
                    break;
                case "}":
                    this._kind = SyntaxKind.CloseBraceToken;
                    this._position++;
                    break;
                case ";":
                    this._kind = SyntaxKind.SemicolonToken;
                    this._position++;
                    break;
                case "&":
                    if(this.lookAhead === "&"){
                        this._position += 2;
                        this._kind = SyntaxKind.AmpersandAmpersandToken;
                    }
                    break;
                case "|":
                    if(this.lookAhead === "|"){
                        this._kind = SyntaxKind.PipePipeToken;
                        this._position += 2;
                    }
                    break;
                case "=":
                    this._position++;
                    if(this.current !== "="){
                        this._kind = SyntaxKind.EqualsToken;
                    }
                    else{
                        this._kind = SyntaxKind.EqualsEqualsToken;
                        this._position++;
                    }
                    break;
                case "!":
                    this._position++;
                    if((this.current as string) !== "="){
                        this._kind = SyntaxKind.BangToken;
                    }
                    else{
                        this._kind = SyntaxKind.BangEqualsToken;
                        this._position++;
                    }
                    break;
                case "<":
                    this._position++;
                    if((this.current as string) !== "="){
                        this._kind = SyntaxKind.LessToken;
                    }
                    else{
                        this._kind = SyntaxKind.LessOrEqualsToken;
                        this._position++;
                    }
                    break;
                case ">":
                    this._position++;
                    if((this.current as string) !== "="){
                        this._kind = SyntaxKind.GreaterToken;
                    }
                    else{
                        this._kind = SyntaxKind.GreaterOrEqualsToken;
                        this._position++;
                    }
                    break;
                case "\"":
                    this.readStringToken();
                    break;
                case "0": case "1": case "2": case "3": case "4":
                case "5": case "6": case "7": case "8": case "9":
                    this.readNumberToken();
                    break;
                case " ":
                case "\t":
                case "\n":
                case "\r":
                    this.readWhiteSpaceToken();
                    break;
                default:
                    if(/[a-zA-Z]/.test(this.current)){
                        this.readIdentifierOrKeywordToken();
                    }
                    else if(/\s/.test(this.current)){
                        this.readWhiteSpaceToken();
                    }
                    else{
                        this._diagnostics.reportBadCharacter(this._position, this.current);
                        this._position++;
                    }
                    break;
            }
            let text = SyntaxFacts.getText(this._kind);
            if(text === null){
                text = this._text.toString(this._start, this._position - this._start);
            }
            return new SyntaxToken(this._kind, this._start, text, this._value);
        }

        private readStringToken (): void{
            this._position++;
            let string = "";
            let done = false;
            while(!done){
                switch (this.current) {
                    case "\0":
                    case "\n":
                    case "\r":
                        const span = new TextSpan(this._start, 1);
                        this._diagnostics.reportUnterminatedString(span);
                        done = true;
                        break;
                    case "\"":
                        if (this.lookBehind === "\\"){
                            string = string.substring(0, string.length - 1) +  this.current;
                            this._position++;
                        }
                        else{
                            this._position++;
                            done = true;
                        }
                        break;
                    default:
                        string += this.current;
                        this._position++;
                        break;
                }
            }

            this._kind = SyntaxKind.StringToken;
            this._value = string;
        }

        private readNumberToken (){
            while(/[0-9]/.test(this.current)){
                this._position++;
            }
            const text = this._text.toString(this._start, this._position - this._start);
            const int = parseInt(text);
            if(int > 2147483648 || int < -2147483648){
                this._diagnostics.reportInvalidNumber(new TextSpan(this._start, this._start - this._position), text, TypeSymbol.int);
            }
            this._value = int;
            this._kind = SyntaxKind.NumberToken;
        }

        private readWhiteSpaceToken (){
            while(/\s/.test(this.current)){
                this._position++;
            }
            this._kind = SyntaxKind.WhitespaceToken;
        }

        private readIdentifierOrKeywordToken (){
            while(/[a-zA-Z]/.test(this.current)){
                this._position++;
            }
            const text = this._text.toString(this._start, this._position - this._start);
            this._kind = SyntaxFacts.getKeywordKind(text);
        }

        get diagnostics (): DiagnosticBag{
            return this._diagnostics;
        }
    }
}
