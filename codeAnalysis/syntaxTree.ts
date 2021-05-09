///<reference path="parser.ts" />
class SyntaxTree {
    public root: ExpressionSyntax;
    public endOfFileToken: SyntaxToken;
    public diagnostics: string[];
    constructor (diagnostics: string[], root: ExpressionSyntax, endOfFileToken: SyntaxToken) {
        this.root = root;
        this.endOfFileToken= endOfFileToken;
        this.diagnostics = diagnostics;

    }

    public static parse (text: string): SyntaxTree{
        const parser = new Parser(text);
        return parser.parse();
    }
}