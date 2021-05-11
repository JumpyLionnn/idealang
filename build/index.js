"use strict";
class SyntaxToken {
    constructor(kind, position, text, value) {
        this.kind = kind;
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
        return this.peek(0);
    }
    get lookAhead() {
        return this.peek(1);
    }
    peek(offset) {
        const index = this._position + offset;
        if (index === this._text.length) {
            return "\0";
        }
        return this._text.charAt(index);
    }
    next() {
        this._position++;
    }
    nextToken() {
        if (this._position >= this._text.length) {
            return new SyntaxToken(SyntaxKind.EndOfFileToken, this._position, "\0", null);
        }
        if (/[0-9]/.test(this.currentChar)) {
            const start = this._position;
            while (/[0-9]/.test(this.currentChar)) {
                this.next();
            }
            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxKind.NumberToken, start, text, parseInt(text));
        }
        if (/\s/.test(this.currentChar)) {
            const start = this._position;
            while (/\s/.test(this.currentChar)) {
                this.next();
            }
            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxKind.WhitespaceToken, start, text, null);
        }
        if (/[a-zA-Z]/.test(this.currentChar)) {
            const start = this._position;
            while (/[a-zA-Z]/.test(this.currentChar)) {
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
                if (this.lookAhead === "&") {
                    return new SyntaxToken(SyntaxKind.AmpersandAmpersandToken, this._position += 2, "&&", null);
                }
                break;
            case "|":
                if (this.lookAhead === "|") {
                    return new SyntaxToken(SyntaxKind.PipePipeToken, this._position += 2, "||", null);
                }
                break;
            case "=":
                if (this.lookAhead === "=") {
                    return new SyntaxToken(SyntaxKind.EqualsEqualsToken, this._position += 2, "==", null);
                }
                break;
            case "!":
                if (this.lookAhead === "=") {
                    return new SyntaxToken(SyntaxKind.BangEqualsToken, this._position += 2, "!=", null);
                }
                return new SyntaxToken(SyntaxKind.BangToken, this._position++, "!", null);
        }
        this._diagnostics.push(`ERROR: bad character input: '${this.currentChar}'`);
        return new SyntaxToken(SyntaxKind.BadToken, this._position++, this._text.charAt(this._position - 1), null);
    }
    get diagnostics() {
        return this._diagnostics;
    }
}
var SyntaxKind;
(function (SyntaxKind) {
    SyntaxKind["BadToken"] = "BadToken";
    SyntaxKind["EndOfFileToken"] = "EndOfFileToken";
    SyntaxKind["WhitespaceToken"] = "WhitespaceToken";
    SyntaxKind["NumberToken"] = "NumberToken";
    SyntaxKind["PlusToken"] = "PlusToken";
    SyntaxKind["MinusToken"] = "MinusToken";
    SyntaxKind["StarToken"] = "StarToken";
    SyntaxKind["SlashToken"] = "SlashToken";
    SyntaxKind["BangToken"] = "BangToken";
    SyntaxKind["AmpersandAmpersandToken"] = "AmpersandAmpersandToken";
    SyntaxKind["PipePipeToken"] = "PipePipeToken";
    SyntaxKind["EqualsEqualsToken"] = "EqualsEqualsToken";
    SyntaxKind["BangEqualsToken"] = "BangEqualsToken";
    SyntaxKind["OpenParenthesisToken"] = "OpenParenthesisToken";
    SyntaxKind["CloseParenthesisToken"] = "CloseParenthesisToken";
    SyntaxKind["IdentifierToken"] = "IdentifierToken";
    SyntaxKind["FalseKeyword"] = "FalseKeyword";
    SyntaxKind["TrueKeyword"] = "TrueKeyword";
    SyntaxKind["LiteralExpression"] = "LiteralExpression";
    SyntaxKind["BinaryExpression"] = "BinaryExpression";
    SyntaxKind["UnaryExpression"] = "UnaryExpression";
    SyntaxKind["ParenthesizedExpression"] = "ParenthesizedExpression";
})(SyntaxKind || (SyntaxKind = {}));
class SyntaxFacts {
    constructor() { }
    static getUnaryOperatorPrecedence(kind) {
        switch (kind) {
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
            case SyntaxKind.BangToken:
                return 6;
            default:
                return 0;
        }
    }
    static getBinaryOperatorPrecedence(kind) {
        switch (kind) {
            case SyntaxKind.StarToken:
            case SyntaxKind.SlashToken:
                return 5;
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
                return 4;
            case SyntaxKind.EqualsEqualsToken:
            case SyntaxKind.BangEqualsToken:
                return 3;
            case SyntaxKind.AmpersandAmpersandToken:
                return 2;
            case SyntaxKind.PipePipeToken:
                return 1;
            default:
                return 0;
        }
    }
    static getKeywordKind(text) {
        switch (text) {
            case "true":
                return SyntaxKind.TrueKeyword;
            case "false":
                return SyntaxKind.FalseKeyword;
            default:
                return SyntaxKind.IdentifierToken;
        }
    }
}
class SyntaxNode {
    constructor() {
        this.kind = SyntaxKind.WhitespaceToken;
    }
}
class ExpressionSyntax extends SyntaxNode {
}
class LiteralExpressionSyntax extends ExpressionSyntax {
    constructor(literalToken, value) {
        super();
        this.literalToken = literalToken;
        if (value !== undefined) {
            this.value = value;
        }
        else {
            this.value = literalToken.value;
        }
        this.kind = SyntaxKind.LiteralExpression;
    }
}
class BinaryExpressionSyntax extends ExpressionSyntax {
    constructor(left, operationToken, right) {
        super();
        this.left = left;
        this.operatorToken = operationToken;
        this.right = right;
        this.kind = SyntaxKind.BinaryExpression;
    }
}
class ParenthesizedExpressionSyntax extends ExpressionSyntax {
    constructor(openParenthesisToken, expression, closeParenthesisToken) {
        super();
        this.openParenthesisToken = openParenthesisToken;
        this.expression = expression;
        this.closeParenthesisToken = closeParenthesisToken;
        this.kind = SyntaxKind.ParenthesizedExpression;
    }
}
class Parser {
    constructor(text) {
        this._tokens = [];
        this._position = 0;
        this._diagnostics = [];
        const lexer = new Lexer(text);
        let token = new SyntaxToken(SyntaxKind.WhitespaceToken, 0, "", null);
        while (token.kind !== SyntaxKind.EndOfFileToken) {
            token = lexer.nextToken();
            if (token.kind !== SyntaxKind.WhitespaceToken && token.kind !== SyntaxKind.BadToken) {
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
    matchToken(kind) {
        if (this.current.kind === kind) {
            return this.nextToken();
        }
        this._diagnostics.push(`ERROR: Unexpected token <${this.current.kind}> expected <${kind}>`);
        return new SyntaxToken(kind, this.current.position, "", null);
    }
    parse() {
        const expression = this.parseExpression();
        const endOfFileToken = this.matchToken(SyntaxKind.EndOfFileToken);
        return new SyntaxTree(this._diagnostics, expression, endOfFileToken);
    }
    parseExpression(parentPrecedence = 0) {
        let left;
        const unaryOperatorPrecedence = SyntaxFacts.getUnaryOperatorPrecedence(this.current.kind);
        if (unaryOperatorPrecedence !== 0 || unaryOperatorPrecedence > parentPrecedence) {
            const operatorToken = this.nextToken();
            const operand = this.parsePrimaryExpression();
            left = new UnaryExpressionSyntax(operatorToken, operand);
        }
        else {
            left = this.parsePrimaryExpression();
        }
        while (true) {
            const precedence = SyntaxFacts.getBinaryOperatorPrecedence(this.current.kind);
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
        switch (this.current.kind) {
            case SyntaxKind.OpenParenthesisToken:
                const left = this.nextToken();
                const expression = this.parseExpression();
                const right = this.matchToken(SyntaxKind.CloseParenthesisToken);
                return new ParenthesizedExpressionSyntax(left, expression, right);
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
                const keywordToken = this.nextToken();
                const value = keywordToken.kind === SyntaxKind.TrueKeyword;
                return new LiteralExpressionSyntax(keywordToken, value);
            default:
                const numberToken = this.matchToken(SyntaxKind.NumberToken);
                return new LiteralExpressionSyntax(numberToken);
        }
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
        this.kind = SyntaxKind.UnaryExpression;
    }
}
class BoundNode {
}
class BoundExpression extends BoundNode {
}
class BoundUnaryExpression extends BoundExpression {
    constructor(operator, operand) {
        super();
        this.operator = operator;
        this.operand = operand;
        this.type = operator.resultType;
        this.kind = BoundNodeKind.UnaryExpression;
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
        if (node instanceof BoundLiteralExpression) {
            return node.value;
        }
        if (node instanceof BoundUnaryExpression) {
            const operand = this.evaluateExpression(node.operand);
            switch (node.operator.kind) {
                case BoundUnaryOperatorKind.Identity:
                    return operand;
                case BoundUnaryOperatorKind.Negation:
                    return -operand;
                case BoundUnaryOperatorKind.LogicalNegation:
                    return !operand;
                default:
                    throw new Error(`Unexpected unary operator ${node.operator.kind}`);
            }
        }
        if (node instanceof BoundBinaryExpression) {
            const left = this.evaluateExpression(node.left);
            const right = this.evaluateExpression(node.right);
            switch (node.operator.kind) {
                case BoundBinaryOperatorKind.Addition:
                    return left + right;
                case BoundBinaryOperatorKind.Substruction:
                    return left - right;
                case BoundBinaryOperatorKind.Multiplication:
                    return left * right;
                case BoundBinaryOperatorKind.Division:
                    return left / right;
                case BoundBinaryOperatorKind.LogicalAnd:
                    return left && right;
                case BoundBinaryOperatorKind.LogicalOr:
                    return left || right;
                case BoundBinaryOperatorKind.Equals:
                    return left === right;
                case BoundBinaryOperatorKind.NotEquals:
                    return !(left === right);
                default:
                    throw new Error(`Unexpected binary operator ${node.operator.kind}`);
            }
        }
        throw new Error(`Unexpected node ${node.kind}`);
    }
}
var Type;
(function (Type) {
    Type["int"] = "int";
    Type["float"] = "float";
    Type["boolean"] = "boolean";
})(Type || (Type = {}));
(function (Type) {
    function getType(data) {
        if (typeof data === "number") {
            if (data % 1 === 0) {
                return Type.int;
            }
            else {
                return Type.float;
            }
        }
        else if (typeof data === "boolean") {
            return Type.boolean;
        }
        else {
            throw new Error("Unknown Type.");
        }
    }
    Type.getType = getType;
})(Type || (Type = {}));
var BoundNodeKind;
(function (BoundNodeKind) {
    BoundNodeKind["UnaryExpression"] = "UnaryExpression";
    BoundNodeKind["LiteralExpression"] = "LiteralExpression";
    BoundNodeKind["BinaryExpression"] = "BinaryExpression";
})(BoundNodeKind || (BoundNodeKind = {}));
class BoundLiteralExpression extends BoundExpression {
    constructor(value) {
        super();
        this.value = value;
        this.type = Type.getType(this.value);
        this.kind = BoundNodeKind.LiteralExpression;
    }
}
var BoundBinaryOperatorKind;
(function (BoundBinaryOperatorKind) {
    BoundBinaryOperatorKind["Addition"] = "Addition";
    BoundBinaryOperatorKind["Substruction"] = "Substruction";
    BoundBinaryOperatorKind["Multiplication"] = "Multiplication";
    BoundBinaryOperatorKind["Division"] = "Division";
    BoundBinaryOperatorKind["LogicalAnd"] = "LogicalAnd";
    BoundBinaryOperatorKind["LogicalOr"] = "LogicalOr";
    BoundBinaryOperatorKind["Equals"] = "Equals";
    BoundBinaryOperatorKind["NotEquals"] = "NotEquals";
})(BoundBinaryOperatorKind || (BoundBinaryOperatorKind = {}));
class BoundBinaryOperator {
    constructor(syntaxKind, kind, leftType, rightType, resultType) {
        this.syntaxKind = syntaxKind;
        this.kind = kind;
        this.leftType = leftType;
        this.rightType = rightType || leftType;
        this.resultType = resultType || leftType;
    }
    static bind(syntaxKind, leftType, rightType) {
        for (let i = 0; i < this._operators.length; i++) {
            if (this._operators[i].syntaxKind === syntaxKind && this._operators[i].leftType === leftType && this._operators[i].rightType === rightType) {
                return this._operators[i];
            }
        }
        return null;
    }
}
BoundBinaryOperator._operators = [
    new BoundBinaryOperator(SyntaxKind.PlusToken, BoundBinaryOperatorKind.Addition, Type.int),
    new BoundBinaryOperator(SyntaxKind.MinusToken, BoundBinaryOperatorKind.Substruction, Type.int),
    new BoundBinaryOperator(SyntaxKind.StarToken, BoundBinaryOperatorKind.Multiplication, Type.int),
    new BoundBinaryOperator(SyntaxKind.SlashToken, BoundBinaryOperatorKind.Division, Type.int),
    new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, Type.int, Type.int, Type.boolean),
    new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, Type.int, Type.int, Type.boolean),
    new BoundBinaryOperator(SyntaxKind.AmpersandAmpersandToken, BoundBinaryOperatorKind.LogicalAnd, Type.boolean),
    new BoundBinaryOperator(SyntaxKind.PipePipeToken, BoundBinaryOperatorKind.LogicalOr, Type.boolean),
    new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, Type.boolean),
    new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, Type.boolean),
];
class BoundBinaryExpression extends BoundExpression {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.type = operator.resultType;
        this.kind = BoundNodeKind.BinaryExpression;
    }
}
var BoundUnaryOperatorKind;
(function (BoundUnaryOperatorKind) {
    BoundUnaryOperatorKind["Identity"] = "Identity";
    BoundUnaryOperatorKind["Negation"] = "Negation";
    BoundUnaryOperatorKind["LogicalNegation"] = "LogicalNegation";
})(BoundUnaryOperatorKind || (BoundUnaryOperatorKind = {}));
class BoundUnaryOperator {
    constructor(syntaxKind, kind, operandType, resultType) {
        this.syntaxKind = syntaxKind;
        this.kind = kind;
        this.operandType = operandType;
        this.resultType = resultType || operandType;
    }
    static bind(syntaxKind, operandType) {
        for (let i = 0; i < this._operators.length; i++) {
            if (this._operators[i].syntaxKind === syntaxKind && this._operators[i].operandType === operandType) {
                return this._operators[i];
            }
        }
        return null;
    }
}
BoundUnaryOperator._operators = [
    new BoundUnaryOperator(SyntaxKind.BangToken, BoundUnaryOperatorKind.LogicalNegation, Type.boolean),
    new BoundUnaryOperator(SyntaxKind.PlusToken, BoundUnaryOperatorKind.Identity, Type.int),
    new BoundUnaryOperator(SyntaxKind.MinusToken, BoundUnaryOperatorKind.Negation, Type.int),
];
class Binder {
    constructor() {
        this._diagnostics = [];
    }
    get diagnostics() { return this._diagnostics; }
    bindExpression(syntax) {
        switch (syntax.kind) {
            case SyntaxKind.LiteralExpression:
                return this.bindLiteralExpression(syntax);
            case SyntaxKind.UnaryExpression:
                return this.bindUnaryExpression(syntax);
            case SyntaxKind.BinaryExpression:
                return this.bindBinaryExpression(syntax);
            case SyntaxKind.ParenthesizedExpression:
                return this.bindExpression(syntax.expression);
            default:
                throw new Error(`Unexpected syntax ${syntax.kind}`);
        }
    }
    bindLiteralExpression(syntax) {
        let value;
        if (syntax.value !== undefined) {
            value = syntax.value;
        }
        else {
            value = 0;
        }
        return new BoundLiteralExpression(value);
    }
    bindUnaryExpression(syntax) {
        const boundOperand = this.bindExpression(syntax.operand);
        const boundOperator = BoundUnaryOperator.bind(syntax.operatorToken.kind, boundOperand.type);
        if (boundOperator === null) {
            this._diagnostics.push(`Unary operator '${syntax.operatorToken.text}' is not defined for type ${boundOperand.type}.`);
            return boundOperand;
        }
        return new BoundUnaryExpression(boundOperator, boundOperand);
    }
    bindBinaryExpression(syntax) {
        const boundLeft = this.bindExpression(syntax.left);
        const boundRight = this.bindExpression(syntax.right);
        const boundOperator = BoundBinaryOperator.bind(syntax.operatorToken.kind, boundLeft.type, boundRight.type);
        if (boundOperator === null) {
            this._diagnostics.push(`Binary operator '${syntax.operatorToken.text}' is not defined for type ${boundLeft.type} and ${boundRight.type}.`);
            return boundLeft;
        }
        return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
    }
}
const fs = require("fs");
const code = fs.readFileSync("./input.txt").toString();
const syntaxTree = SyntaxTree.parse(code);
const binder = new Binder();
const boundExpression = binder.bindExpression(syntaxTree.root);
const diagnostics = syntaxTree.diagnostics.push(...binder.diagnostics);
if (syntaxTree.diagnostics.length > 0) {
    for (let i = 0; i < syntaxTree.diagnostics.length; i++) {
        console.error(syntaxTree.diagnostics[i]);
    }
}
else {
    const evaluator = new Evaluator(boundExpression);
    const result = evaluator.evaluate();
    console.log(result);
}
