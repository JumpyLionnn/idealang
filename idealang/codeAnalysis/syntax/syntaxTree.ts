///<reference path="parser.ts" />
namespace Idealang{
    export class SyntaxTree {
        private _text: SourceText;
        private _root: CompilationUnitSyntax;
        private _diagnostics: Diagnostic[];
        private constructor (text: SourceText) {
            const parser = new Parser(text);
            const root = parser.parseCompilationUnit();

            this._text = text;
            this._root = root;
            this._diagnostics = parser.diagnostics.toArray();

        }

        public get text (){return this._text;}
        public get root (){return this._root;}
        public get diagnostics (){return this._diagnostics;}

        public static parse (text: string | SourceText): SyntaxTree{
            let sourceText: SourceText;
            if(text instanceof SourceText){
                sourceText = text;
            }
            else{
             sourceText = SourceText.from(text);
            }
            return new SyntaxTree(sourceText);
        }

        public static parseTokens (text: string | SourceText): SyntaxToken[]{
            let sourceText: SourceText;
            if(text instanceof SourceText){
                sourceText = text;
            }
            else{
             sourceText = SourceText.from(text);
            }
            const lexer = new Lexer(sourceText);
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
