abstract class SyntaxNode{
    public type: SyntaxType = SyntaxType.WhitespaceToken;
}


abstract class ExpressionSyntax extends SyntaxNode {}


class NumberExpressionSyntax extends ExpressionSyntax {
    public numberToken: SyntaxToken;
    constructor (numberToken: SyntaxToken){
        super();
        this.numberToken = numberToken;
        this.type = SyntaxType.NumberToken;
    }
}

class BinaryExpressionSyntax extends ExpressionSyntax {
    public left: ExpressionSyntax;
    public operatorToken: SyntaxToken;
    public right: ExpressionSyntax;
    constructor (left: ExpressionSyntax, operationToken: SyntaxToken, right: ExpressionSyntax){
        super();
        this.left = left;
        this.operatorToken = operationToken;
        this.right = right;
        this.type = SyntaxType.BinaryExpression;
    }
}

class ParenthesizedExpressionSyntax extends ExpressionSyntax {
    public openParenthesisToken: SyntaxToken;
    public expression: ExpressionSyntax;
    public closeParenthesisToken: SyntaxToken;
    constructor (openParenthesisToken: SyntaxToken, expression: ExpressionSyntax, closeParenthesisToken: SyntaxToken){
        super();
        this.openParenthesisToken = openParenthesisToken;
        this.expression = expression;
        this.closeParenthesisToken = closeParenthesisToken;
        this.type = SyntaxType.ParenthesizedExpression;
    }
}


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