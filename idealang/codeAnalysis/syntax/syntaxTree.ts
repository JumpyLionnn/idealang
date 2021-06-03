///<reference path="parser.ts" />
namespace Idealang{
    export class SyntaxTree {
        public _root: ExpressionSyntax;
        public _endOfFileToken: SyntaxToken;
        public _diagnostics: Diagnostic[];
        constructor (diagnostics: Diagnostic[], root: ExpressionSyntax, endOfFileToken: SyntaxToken) {
            this._root = root;
            this._endOfFileToken= endOfFileToken;
            this._diagnostics = diagnostics;

        }

        public get root (): ExpressionSyntax{return this._root;}
        public get endOfFileToken (): SyntaxToken{return this._endOfFileToken;}
        public get diagnostics (): Diagnostic[]{return this._diagnostics;}

        public static parse (text: string): SyntaxTree{
            const parser = new Parser(text);
            return parser.parse();
        }

        public static parseTokens (text: string): SyntaxToken[]{
            const lexer = new Lexer(text);
            const tokens: SyntaxToken[] = [];
            while(true){
                const token = lexer.nextToken();
                if(token.kind === SyntaxKind.EndOfFileToken){
                    break;
                }
                tokens.push(token);
            }
            return tokens;
        }
    }
}
