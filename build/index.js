"use strict";
class SyntaxToken {
    constructor(type, position, text, value) {
        this.value = "";
        this.type = type;
        this.position = position;
        this.text = text;
        if (value) {
            this.value = value;
        }
    }
}
class Lexer {
    constructor(text) {
        this._position = 0;
        this._diagnostics = [];
        this._text = text;
    }
    get currentChar() {
        if (this._position === this._text.length) {
            return "\0";
        }
        return this._text.charAt(this._position);
    }
    next() {
        this._position++;
    }
    nextToken() {
        if (this._position >= this._text.length) {
            return new SyntaxToken(SyntaxType.EndOfFileToken, this._position, "\0", null);
        }
        if (/[0-9]/.test(this.currentChar)) {
            const start = this._position;
            while (/[0-9]/.test(this.currentChar)) {
                this.next();
            }
            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxType.NumberToken, start, text, parseInt(text));
        }
        if (/\s/.test(this.currentChar)) {
            const start = this._position;
            while (/\s/.test(this.currentChar)) {
                this.next();
            }
            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxType.WhitespaceToken, start, text, null);
        }
        if (this.currentChar === "+") {
            return new SyntaxToken(SyntaxType.PlusToken, this._position++, "+", null);
        }
        else if (this.currentChar === "-") {
            return new SyntaxToken(SyntaxType.MinusToken, this._position++, "-", null);
        }
        else if (this.currentChar === "*") {
            return new SyntaxToken(SyntaxType.StarToken, this._position++, "*", null);
        }
        else if (this.currentChar === "/") {
            return new SyntaxToken(SyntaxType.SlashToken, this._position++, "/", null);
        }
        else if (this.currentChar === "(") {
            return new SyntaxToken(SyntaxType.OpenParenthesisToken, this._position++, "(", null);
        }
        else if (this.currentChar === ")") {
            return new SyntaxToken(SyntaxType.CloseParenthesisToken, this._position++, ")", null);
        }
        this._diagnostics.push(`ERROR: bad character in input: '${this.currentChar}'`);
        return new SyntaxToken(SyntaxType.BadToken, this._position++, this._text.charAt(this._position - 1), null);
    }
    get diagnostics() {
        return this._diagnostics;
    }
}
var SyntaxType;
(function (SyntaxType) {
    SyntaxType["BadToken"] = "BadToken";
    SyntaxType["EndOfFileToken"] = "EndOfFileToken";
    SyntaxType["WhitespaceToken"] = "WhitespaceToken";
    SyntaxType["NumberToken"] = "NumberToken";
    SyntaxType["PlusToken"] = "PlusToken";
    SyntaxType["MinusToken"] = "MinusToken";
    SyntaxType["StarToken"] = "StarToken";
    SyntaxType["SlashToken"] = "SlashToken";
    SyntaxType["OpenParenthesisToken"] = "OpenParenthesisToken";
    SyntaxType["CloseParenthesisToken"] = "CloseParenthesisToken";
    SyntaxType["LiteralExpression"] = "LiteralExpression";
    SyntaxType["BinaryExpression"] = "BinaryExpression";
    SyntaxType["UnaryExpression"] = "UnaryExpression";
    SyntaxType["ParenthesizedExpression"] = "ParenthesizedExpression";
})(SyntaxType || (SyntaxType = {}));
class SyntaxFacts {
    constructor() { }
    static getBinaryOperatorPrecedence(type) {
        switch (type) {
            case SyntaxType.StarToken:
            case SyntaxType.SlashToken:
                return 2;
            case SyntaxType.PlusToken:
            case SyntaxType.MinusToken:
                return 1;
            default:
                return 0;
        }
    }
    static getUnaryOperatorPrecedence(type) {
        switch (type) {
            case SyntaxType.PlusToken:
            case SyntaxType.MinusToken:
                return 1;
            default:
                return 0;
        }
    }
}
class SyntaxNode {
    constructor() {
        this.type = SyntaxType.WhitespaceToken;
    }
}
class ExpressionSyntax extends SyntaxNode {
}
class LiteralExpressionSyntax extends ExpressionSyntax {
    constructor(literalToken) {
        super();
        this.literalToken = literalToken;
        this.type = SyntaxType.LiteralExpression;
    }
}
class BinaryExpressionSyntax extends ExpressionSyntax {
    constructor(left, operationToken, right) {
        super();
        this.left = left;
        this.operatorToken = operationToken;
        this.right = right;
        this.type = SyntaxType.BinaryExpression;
    }
}
class ParenthesizedExpressionSyntax extends ExpressionSyntax {
    constructor(openParenthesisToken, expression, closeParenthesisToken) {
        super();
        this.openParenthesisToken = openParenthesisToken;
        this.expression = expression;
        this.closeParenthesisToken = closeParenthesisToken;
        this.type = SyntaxType.ParenthesizedExpression;
    }
}
class Parser {
    constructor(text) {
        this._tokens = [];
        this._position = 0;
        this._diagnostics = [];
        const lexer = new Lexer(text);
        let token = new SyntaxToken(SyntaxType.WhitespaceToken, 0, "", null);
        while (token.type !== SyntaxType.EndOfFileToken) {
            token = lexer.nextToken();
            if (token.type !== SyntaxType.WhitespaceToken && token.type !== SyntaxType.BadToken) {
                this._tokens.push(token);
            }
        }
        this._diagnostics.push(...lexer.diagnostics);
    }
    peek(offset) {
        const index = this._position + offset;
        if (index >= this._tokens.length) {
            return this._tokens[this._tokens.length - 1];
        }
        return this._tokens[index];
    }
    get current() {
        return this.peek(0);
    }
    nextToken() {
        const current = this.current;
        this._position++;
        return current;
    }
    matchToken(type) {
        if (this.current.type === type) {
            return this.nextToken();
        }
        this._diagnostics.push(`ERROR: Unexpected token <${this.current.type}> expected <${type}>`);
        return new SyntaxToken(type, this.current.position, "", null);
    }
    parse() {
        const expression = this.parseExpression();
        const endOfFileToken = this.matchToken(SyntaxType.EndOfFileToken);
        return new SyntaxTree(this._diagnostics, expression, endOfFileToken);
    }
    parseExpression(parentPrecedence = 0) {
        let left;
        const unaryOperatorPrecedence = SyntaxFacts.getUnaryOperatorPrecedence(this.current.type);
        if (unaryOperatorPrecedence !== 0 || unaryOperatorPrecedence > parentPrecedence) {
            const operatorToken = this.nextToken();
            const operand = this.parsePrimaryExpression();
            left = new UnaryExpressionSyntax(operatorToken, operand);
        }
        else {
            left = this.parsePrimaryExpression();
        }
        while (true) {
            const precedence = SyntaxFacts.getBinaryOperatorPrecedence(this.current.type);
            if (precedence === 0 || precedence < parentPrecedence) {
                break;
            }
            const operatorToken = this.nextToken();
            const right = this.parseExpression(precedence);
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        }
        return left;
    }
    parsePrimaryExpression() {
        if (this.current.type === SyntaxType.OpenParenthesisToken) {
            const left = this.nextToken();
            const expression = this.parseExpression();
            const right = this.matchToken(SyntaxType.CloseParenthesisToken);
            return new ParenthesizedExpressionSyntax(left, expression, right);
        }
        const numberToken = this.matchToken(SyntaxType.NumberToken);
        return new LiteralExpressionSyntax(numberToken);
    }
    get diagnostics() {
        return this._diagnostics;
    }
}
class SyntaxTree {
    constructor(diagnostics, root, endOfFileToken) {
        this.root = root;
        this.endOfFileToken = endOfFileToken;
        this.diagnostics = diagnostics;
    }
    static parse(text) {
        const parser = new Parser(text);
        return parser.parse();
    }
}
class UnaryExpressionSyntax extends ExpressionSyntax {
    constructor(operationToken, operand) {
        super();
        this.operatorToken = operationToken;
        this.operand = operand;
        this.type = SyntaxType.UnaryExpression;
    }
}
class Evaluator {
    constructor(root) {
        this._root = root;
    }
    evaluate() {
        return this.evaluateExpression(this._root);
    }
    evaluateExpression(node) {
        if (node instanceof LiteralExpressionSyntax) {
            return node.literalToken.value;
        }
        if (node instanceof UnaryExpressionSyntax) {
            const operand = this.evaluateExpression(node.operand);
            if (node.operatorToken.type === SyntaxType.PlusToken) {
                return operand;
            }
            else if (node.operatorToken.type === SyntaxType.MinusToken) {
                return -operand;
            }
            throw new Error(`Unexpected unary operator ${node.operatorToken.type}`);
        }
        if (node instanceof BinaryExpressionSyntax) {
            const left = this.evaluateExpression(node.left);
            const right = this.evaluateExpression(node.right);
            if (node.operatorToken.type === SyntaxType.PlusToken) {
                return left + right;
            }
            else if (node.operatorToken.type === SyntaxType.MinusToken) {
                return left - right;
            }
            else if (node.operatorToken.type === SyntaxType.StarToken) {
                return left * right;
            }
            else if (node.operatorToken.type === SyntaxType.SlashToken) {
                return left / right;
            }
            else {
                throw new Error(`Unexpected binary operator ${node.operatorToken.type}`);
            }
        }
        if (node instanceof ParenthesizedExpressionSyntax) {
            return this.evaluateExpression(node.expression);
        }
        throw new Error(`Unexpected node ${node.type}`);
    }
}
const fs = require("fs");
const code = fs.readFileSync("./input.txt").toString();
const syntaxTree = SyntaxTree.parse(code);
if (syntaxTree.diagnostics.length > 0) {
    for (let i = 0; i < syntaxTree.diagnostics.length; i++) {
        console.error(syntaxTree.diagnostics[i]);
    }
}
else {
    const evaluator = new Evaluator(syntaxTree.root);
    const result = evaluator.evaluate();
    console.log(result);
}
