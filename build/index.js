"use strict";
class TextSpan {
    constructor(start, length) {
        this._start = start;
        this._length = length;
    }
    get start() { return this._start; }
    get length() { return this._length; }
    get end() { return this._length + this._start; }
}
class SyntaxToken {
    constructor(kind, position, text, value) {
        this._kind = kind;
        this._position = position;
        this._text = text;
        if (value) {
            this._value = value;
        }
    }
    get kind() { return this._kind; }
    get text() { return this._text; }
    get position() { return this._position; }
    get value() { return this._value; }
    get span() { return new TextSpan(this._position, this._text.length); }
}
class Lexer {
    constructor(text) {
        this._position = 0;
        this._diagnostics = new DiagnosticBag();
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
        const start = this._position;
        if (/[0-9]/.test(this.currentChar)) {
            while (/[0-9]/.test(this.currentChar)) {
                this.next();
            }
            const text = this._text.substring(start, this._position);
            const int = parseInt(text);
            if (int > 2147483648 || int < -2147483648) {
                this._diagnostics.reportInvalidNumber(new TextSpan(start, start - this._position), this._text, Type.int);
            }
            return new SyntaxToken(SyntaxKind.NumberToken, start, text, int);
        }
        if (/\s/.test(this.currentChar)) {
            while (/\s/.test(this.currentChar)) {
                this.next();
            }
            const text = this._text.substring(start, this._position);
            return new SyntaxToken(SyntaxKind.WhitespaceToken, start, text, null);
        }
        if (/[a-zA-Z]/.test(this.currentChar)) {
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
                    this._position += 2;
                    return new SyntaxToken(SyntaxKind.AmpersandAmpersandToken, start, "&&", null);
                }
                break;
            case "|":
                if (this.lookAhead === "|") {
                    this._position += 2;
                    return new SyntaxToken(SyntaxKind.PipePipeToken, start, "||", null);
                }
                break;
            case "=":
                if (this.lookAhead === "=") {
                    this._position += 2;
                    return new SyntaxToken(SyntaxKind.EqualsEqualsToken, start, "==", null);
                }
                else {
                    this._position++;
                    return new SyntaxToken(SyntaxKind.EqualsToken, start, "=", null);
                }
            case "!":
                if (this.lookAhead === "=") {
                    this._position += 2;
                    return new SyntaxToken(SyntaxKind.BangEqualsToken, start, "!=", null);
                }
                this._position++;
                return new SyntaxToken(SyntaxKind.BangToken, start, "!", null);
        }
        this._diagnostics.reportBadCharacter(this._position, this.currentChar);
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
    SyntaxKind["EqualsToken"] = "EqualsToken";
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
    SyntaxKind["NameExpression"] = "NameExpression";
    SyntaxKind["AssignmentExpression"] = "AssignmentExpression";
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
class Diagnostic {
    constructor(span, message) {
        this._span = span;
        this._message = message;
    }
    get span() { return this._span; }
    get message() { return this._message; }
    toString() {
        return this._message;
    }
}
class DiagnosticBag {
    constructor() {
        this._diagnostics = [];
    }
    report(span, message) {
        this._diagnostics.push(new Diagnostic(span, message));
    }
    reportInvalidNumber(span, text, type) {
        const message = `The number ${text} isn't a valid ${type}.`;
        this.report(span, message);
    }
    reportBadCharacter(position, character) {
        const message = `Bad character input: '${character}'.`;
        this.report(new TextSpan(position, 1), message);
    }
    reportUnexpectedToken(span, actualKind, expectedKind) {
        const message = `Unexpected token <${actualKind}> expected <${expectedKind}>.`;
        this.report(span, message);
    }
    reportUndefinedUnaryOperator(span, operatorText, operandType) {
        const message = `Unary operator '${operatorText}' is not defined for type ${operandType}.`;
        this.report(span, message);
    }
    reportUndefinedBinaryOperator(span, operatorText, leftType, rightType) {
        const message = `Binary operator '${operatorText}' is not defined for type ${leftType} and ${rightType}.`;
        this.report(span, message);
    }
    reportUndefinedName(span, name) {
        const message = `Variable '${name}' doesn't exist.`;
        this.report(span, message);
    }
    add(diagnostics) {
        this._diagnostics.push(...diagnostics._diagnostics);
    }
    toArray() {
        return this._diagnostics;
    }
}
class Parser {
    constructor(text) {
        this._tokens = [];
        this._position = 0;
        this._diagnostics = new DiagnosticBag();
        const lexer = new Lexer(text);
        let token = new SyntaxToken(SyntaxKind.WhitespaceToken, 0, "", null);
        while (token.kind !== SyntaxKind.EndOfFileToken) {
            token = lexer.nextToken();
            if (token.kind !== SyntaxKind.WhitespaceToken && token.kind !== SyntaxKind.BadToken) {
                this._tokens.push(token);
            }
        }
        this._diagnostics.add(lexer.diagnostics);
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
        this._diagnostics.reportUnexpectedToken(this.current.span, this.current.kind, kind);
        return new SyntaxToken(kind, this.current.position, "", null);
    }
    parse() {
        const expression = this.parseExpression();
        const endOfFileToken = this.matchToken(SyntaxKind.EndOfFileToken);
        return new SyntaxTree(this._diagnostics.toArray(), expression, endOfFileToken);
    }
    parseExpression() {
        return this.parseAssignmentExpression();
    }
    parseAssignmentExpression() {
        if (this.peek(0).kind === SyntaxKind.IdentifierToken &&
            this.peek(1).kind === SyntaxKind.EqualsToken) {
            const identifierToken = this.nextToken();
            const operatorToken = this.nextToken();
            const right = this.parseAssignmentExpression();
            return new AssignmentExpressionSyntax(identifierToken, operatorToken, right);
        }
        return this.parseBinaryExpression();
    }
    parseBinaryExpression(parentPrecedence = 0) {
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
            const right = this.parseBinaryExpression(precedence);
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        }
        return left;
    }
    parsePrimaryExpression() {
        switch (this.current.kind) {
            case SyntaxKind.OpenParenthesisToken:
                const left = this.nextToken();
                const expression = this.parseAssignmentExpression();
                const right = this.matchToken(SyntaxKind.CloseParenthesisToken);
                return new ParenthesizedExpressionSyntax(left, expression, right);
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
                const keywordToken = this.nextToken();
                const value = keywordToken.kind === SyntaxKind.TrueKeyword;
                return new LiteralExpressionSyntax(keywordToken, value);
            case SyntaxKind.IdentifierToken:
                const identifierToken = this.nextToken();
                return new NameExpressionSyntax(identifierToken);
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
        this._root = root;
        this._endOfFileToken = endOfFileToken;
        this._diagnostics = diagnostics;
    }
    get root() { return this._root; }
    get endOfFileToken() { return this._endOfFileToken; }
    get diagnostics() { return this._diagnostics; }
    static parse(text) {
        const parser = new Parser(text);
        return parser.parse();
    }
    static parseTokens(text) {
        const lexer = new Lexer(text);
        const tokens = [];
        while (true) {
            const token = lexer.nextToken();
            if (token.kind === SyntaxKind.EndOfFileToken) {
                break;
            }
            tokens.push(token);
        }
        return tokens;
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
    constructor(root, variables) {
        this._root = root;
        this._variables = variables;
    }
    evaluate() {
        return this.evaluateExpression(this._root);
    }
    evaluateExpression(node) {
        if (node instanceof BoundLiteralExpression) {
            return node.value;
        }
        if (node instanceof BoundVariableExpression) {
            const value = this._variables.get(node.variable);
            return value;
        }
        if (node instanceof BoundAssignmentExpression) {
            const value = this.evaluateExpression(node.expression);
            this._variables.set(node.variable, value);
            return value;
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
class EvaluationResult {
    constructor(diagnostics, value) {
        this._diagnostics = diagnostics;
        if (value !== undefined) {
            this._value = value;
        }
    }
    get diagnostics() { return this._diagnostics; }
    get value() { return this._value; }
}
class Compilation {
    constructor(syntax) {
        this._syntax = syntax;
    }
    get syntax() { return this._syntax; }
    evaluate(variables) {
        const binder = new Binder(variables);
        const boundExpression = binder.bindExpression(this._syntax.root);
        const diagnostics = this._syntax.diagnostics;
        diagnostics.push(...binder.diagnostics.toArray());
        if (diagnostics.length > 0) {
            return new EvaluationResult(diagnostics);
        }
        const evaluator = new Evaluator(boundExpression, variables);
        const value = evaluator.evaluate();
        return new EvaluationResult([], value);
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
    BoundNodeKind["LiteralExpression"] = "LiteralExpression";
    BoundNodeKind["VariableExpression"] = "VariableExpression";
    BoundNodeKind["AssignmentExpression"] = "AssignmentExpression";
    BoundNodeKind["UnaryExpression"] = "UnaryExpression";
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
    constructor(variables) {
        this._diagnostics = new DiagnosticBag();
        this._variables = variables;
    }
    get diagnostics() { return this._diagnostics; }
    bindExpression(syntax) {
        switch (syntax.kind) {
            case SyntaxKind.ParenthesizedExpression:
                return this.bindParenthesizedExpression(syntax);
            case SyntaxKind.LiteralExpression:
                return this.bindLiteralExpression(syntax);
            case SyntaxKind.NameExpression:
                return this.bindNameExpression(syntax);
            case SyntaxKind.AssignmentExpression:
                return this.bindAssignmentExpression(syntax);
            case SyntaxKind.UnaryExpression:
                return this.bindUnaryExpression(syntax);
            case SyntaxKind.BinaryExpression:
                return this.bindBinaryExpression(syntax);
            default:
                throw new Error(`Unexpected syntax ${syntax.kind}`);
        }
    }
    bindParenthesizedExpression(syntax) {
        return this.bindExpression(syntax.expression);
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
    bindNameExpression(syntax) {
        const name = syntax.identifierToken.text;
        const variable = getMapKey(this._variables, (v) => v.name === name);
        if (!variable) {
            this._diagnostics.reportUndefinedName(syntax.identifierToken.span, name);
            return new BoundLiteralExpression(0);
        }
        return new BoundVariableExpression(variable);
    }
    bindAssignmentExpression(syntax) {
        const name = syntax.identifierToken.text;
        const boundExpression = this.bindExpression(syntax.expression);
        const existingVariable = getMapKey(this._variables, (v) => v.name === name);
        if (existingVariable) {
            this._variables.delete(existingVariable);
        }
        const variable = new VariableSymbol(name, boundExpression.type);
        this._variables.set(variable, null);
        return new BoundAssignmentExpression(variable, boundExpression);
    }
    bindUnaryExpression(syntax) {
        const boundOperand = this.bindExpression(syntax.operand);
        const boundOperator = BoundUnaryOperator.bind(syntax.operatorToken.kind, boundOperand.type);
        if (boundOperator === null) {
            this._diagnostics.reportUndefinedUnaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundOperand.type);
            return boundOperand;
        }
        return new BoundUnaryExpression(boundOperator, boundOperand);
    }
    bindBinaryExpression(syntax) {
        const boundLeft = this.bindExpression(syntax.left);
        const boundRight = this.bindExpression(syntax.right);
        const boundOperator = BoundBinaryOperator.bind(syntax.operatorToken.kind, boundLeft.type, boundRight.type);
        if (boundOperator === null) {
            this._diagnostics.reportUndefinedBinaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundLeft.type, boundRight.type);
            return boundLeft;
        }
        return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
    }
}
class Tests {
    static describe(name, test) {
        this.tests.push({
            "description": new TestDescription(name),
            "executor": test
        });
    }
    static execute() {
        const startTime = Date.now();
        for (let i = 0; i < this.tests.length; i++) {
            const test = this.tests[i];
            test.executor(test.description);
        }
        this.duration = (Date.now() - startTime) / 1000;
    }
    static showResults() {
        let testsNumber = 0;
        let testsPassed = 0;
        let testsFailed = 0;
        let errors = "";
        for (let i = 0; i < this.tests.length; i++) {
            const test = this.tests[i].description;
            testsNumber += test.tests;
            testsPassed += test.passed;
            testsFailed += test.failed;
            for (let j = 0; j < test.faliedMessages.length; j++) {
                errors += test.faliedMessages[j] + "\n";
            }
        }
        console.error("%c" + errors, "color:red;");
        console.log(`Total tests: ${testsNumber} Passed: ${testsPassed} Failed: ${testsFailed}`);
        if (testsFailed > 0) {
            console.error("%cTest Run Failed", "color:red;");
        }
        else {
            console.error("%cTest Run Successful", "color:green;");
        }
        console.log(`Test execution time: ${this.duration}s`);
    }
}
Tests.tests = [];
class TestDescription {
    constructor(name) {
        this._tests = 0;
        this._passed = 0;
        this._failed = 0;
        this._faliedMessages = [];
        this._name = name;
    }
    equal(expectedData, actualData) {
        this._tests++;
        if (actualData === expectedData) {
            this._passed++;
        }
        else {
            this._failed++;
            this._faliedMessages.push(`Failed  ${this._name}
Expected: ${expectedData}
Actual: ${actualData}`);
        }
    }
    get name() {
        return this._name;
    }
    get tests() {
        return this._tests;
    }
    get passed() {
        return this._passed;
    }
    get failed() {
        return this._failed;
    }
    get faliedMessages() {
        return this._faliedMessages;
    }
}
Tests.execute();
setTimeout(() => {
    Tests.execute();
    Tests.showResults();
}, 100);
class VariableSymbol {
    constructor(name, type) {
        this._name = name;
        this._type = type;
    }
    get name() { return this._name; }
    get type() { return this._type; }
}
class BoundAssignmentExpression extends BoundExpression {
    constructor(variable, expression) {
        super();
        this._variable = variable;
        this._expression = expression;
        this.kind = BoundNodeKind.AssignmentExpression;
        this.type = expression.type;
    }
    get variable() { return this._variable; }
    get expression() { return this._expression; }
}
class BoundVariableExpression extends BoundExpression {
    constructor(variable) {
        super();
        this._variable = variable;
        this.kind = BoundNodeKind.VariableExpression;
        this.type = variable.type;
    }
    get variable() { return this._variable; }
}
class AssignmentExpressionSyntax extends ExpressionSyntax {
    constructor(identifierToken, equalsToken, expression) {
        super();
        this._identifierToken = identifierToken;
        this._equalsToken = equalsToken;
        this._expression = expression;
        this.kind = SyntaxKind.AssignmentExpression;
    }
    get identifierToken() {
        return this._identifierToken;
    }
    get equalsToken() {
        return this._equalsToken;
    }
    get expression() {
        return this._expression;
    }
}
class NameExpressionSyntax extends ExpressionSyntax {
    constructor(identifierToken) {
        super();
        this._identifierToken = identifierToken;
        this.kind = SyntaxKind.NameExpression;
    }
    get identifierToken() {
        return this._identifierToken;
    }
}
function getMapKey(map, checker) {
    for (const [key, value] of map) {
        if (checker(key)) {
            return key;
        }
    }
}
const lexerTokens = [
    [SyntaxKind.NumberToken, "1"],
    [SyntaxKind.NumberToken, "123"],
    [SyntaxKind.PlusToken, "+"],
    [SyntaxKind.MinusToken, "-"],
    [SyntaxKind.StarToken, "*"],
    [SyntaxKind.SlashToken, "/"],
    [SyntaxKind.BangToken, "!"],
    [SyntaxKind.EqualsToken, "="],
    [SyntaxKind.AmpersandAmpersandToken, "&&"],
    [SyntaxKind.PipePipeToken, "||"],
    [SyntaxKind.EqualsEqualsToken, "=="],
    [SyntaxKind.BangEqualsToken, "!="],
    [SyntaxKind.OpenParenthesisToken, "("],
    [SyntaxKind.CloseParenthesisToken, ")"],
    [SyntaxKind.IdentifierToken, "a"],
    [SyntaxKind.IdentifierToken, "abc"],
    [SyntaxKind.FalseKeyword, "false"],
    [SyntaxKind.TrueKeyword, "true"]
];
const lexerSeperatorsTokens = [
    [SyntaxKind.WhitespaceToken, " "],
    [SyntaxKind.WhitespaceToken, "  "],
    [SyntaxKind.WhitespaceToken, "\r"],
    [SyntaxKind.WhitespaceToken, "\n"],
    [SyntaxKind.WhitespaceToken, "\r\n"]
];
Tests.describe("seperated pairs lexer token test", (assert) => {
    for (let i = 0; i < lexerTokens.length; i++) {
        const t1Kind = lexerTokens[i][0];
        const t1Text = lexerTokens[i][1];
        for (let j = 0; j < lexerTokens.length; j++) {
            const t2Kind = lexerTokens[j][0];
            const t2Text = lexerTokens[j][1];
            if (!requiresSeperator(t1Kind, t2Kind)) {
                for (let k = 0; k < lexerSeperatorsTokens.length; k++) {
                    const seperatorKind = lexerSeperatorsTokens[k][0];
                    const seperatorText = lexerSeperatorsTokens[k][1];
                    const tokens = SyntaxTree.parseTokens(t1Text + seperatorText + t2Text);
                    assert.equal(3, tokens.length);
                    assert.equal(t1Kind, tokens[0].kind);
                    assert.equal(t1Text, tokens[0].text);
                    assert.equal(seperatorKind, tokens[1].kind);
                    assert.equal(seperatorText, tokens[1].text);
                    assert.equal(t2Kind, tokens[2].kind);
                    assert.equal(t2Text, tokens[2].text);
                }
            }
        }
    }
});
Tests.describe("single lexer token test", (assert) => {
    const tokens = [];
    tokens.push(...lexerTokens);
    tokens.push(...lexerSeperatorsTokens);
    for (let i = 0; i < tokens.length; i++) {
        const token = SyntaxTree.parseTokens(tokens[i][1])[0];
        assert.equal(tokens[i][0], token.kind);
        assert.equal(tokens[i][1], token.text);
    }
});
Tests.describe("pairs lexer token test", (assert) => {
    for (let i = 0; i < lexerTokens.length; i++) {
        const t1Kind = lexerTokens[i][0];
        const t1Text = lexerTokens[i][1];
        for (let j = 0; j < lexerTokens.length; j++) {
            const t2Kind = lexerTokens[j][0];
            const t2Text = lexerTokens[j][1];
            if (!requiresSeperator(t1Kind, t2Kind)) {
                const tokens = SyntaxTree.parseTokens(t1Text + t2Text);
                assert.equal(2, tokens.length);
                assert.equal(t1Kind, tokens[0].kind);
                assert.equal(t1Text, tokens[0].text);
                assert.equal(t2Kind, tokens[1].kind);
                assert.equal(t2Text, tokens[1].text);
            }
        }
    }
});
function requiresSeperator(t1Kind, t2Kind) {
    const t1IsKeyword = t1Kind.endsWith("Keyword");
    const t2IsKeyword = t2Kind.endsWith("Keyword");
    if (t1Kind === SyntaxKind.IdentifierToken && t2Kind === SyntaxKind.IdentifierToken) {
        return true;
    }
    if (t1IsKeyword && t2IsKeyword) {
        return true;
    }
    if (t1IsKeyword && t2Kind === SyntaxKind.IdentifierToken) {
        return true;
    }
    if (t1Kind === SyntaxKind.IdentifierToken && t2IsKeyword) {
        return true;
    }
    if (t1Kind === SyntaxKind.NumberToken && t2Kind === SyntaxKind.NumberToken) {
        return true;
    }
    if (t1Kind === SyntaxKind.BangToken && t2Kind === SyntaxKind.EqualsToken) {
        return true;
    }
    if (t1Kind === SyntaxKind.BangToken && t2Kind === SyntaxKind.EqualsEqualsToken) {
        return true;
    }
    if (t1Kind === SyntaxKind.EqualsToken && t2Kind === SyntaxKind.EqualsToken) {
        return true;
    }
    if (t1Kind === SyntaxKind.EqualsToken && t2Kind === SyntaxKind.EqualsEqualsToken) {
        return true;
    }
    return false;
}
