/// <reference path="lexer.ts"/>
/// <reference path="syntaxKind.ts"/>
/// <reference path="syntaxFacts.ts"/>
/// <reference path="literalExpressionSyntax.ts"/>
/// <reference path="binaryExpressionSyntax.ts"/>
/// <reference path="parenthesizedExpressionSyntax.ts"/>
/// <reference path="../diagnosticBag.ts"/>
namespace Idealang{
    export class Parser {
        private _tokens: SyntaxToken[] = [];
        private _position: number = 0;
        private _diagnostics: DiagnosticBag = new DiagnosticBag();
        public constructor (text: string) {

            const lexer = new Lexer(text);
            let token: SyntaxToken = new SyntaxToken(SyntaxKind.WhitespaceToken, 0, "", null);
            while (token.kind !== SyntaxKind.EndOfFileToken) {
                token = lexer.nextToken();

                if (token.kind !== SyntaxKind.WhitespaceToken && token.kind !== SyntaxKind.BadToken) {
                    this._tokens.push(token);
                }
            }
            this._diagnostics.add(lexer.diagnostics);
        }

        private peek (offset: number): SyntaxToken {
            const index = this._position + offset;
            if (index >= this._tokens.length) {
                return this._tokens[this._tokens.length - 1];
            }
            return this._tokens[index];
        }

        private get current (): SyntaxToken {
            return this.peek(0);
        }

        private nextToken (): SyntaxToken {
            const current = this.current;
            this._position++;
            return current;
        }

        private matchToken (kind: SyntaxKind): SyntaxToken {
            if (this.current.kind === kind) {
                return this.nextToken();
            }
            this._diagnostics.reportUnexpectedToken(this.current.span, this.current.kind, kind);
            return new SyntaxToken(kind, this.current.position, "", null);
        }

        public parse (): SyntaxTree {
            const expression = this.parseExpression();
            const endOfFileToken = this.matchToken(SyntaxKind.EndOfFileToken);
            return new SyntaxTree(this._diagnostics.toArray(), expression, endOfFileToken);
        }

        private parseExpression (): ExpressionSyntax {
            return this.parseAssignmentExpression();
        }

        private parseAssignmentExpression (): ExpressionSyntax {
            if (this.peek(0).kind === SyntaxKind.IdentifierToken &&
                this.peek(1).kind === SyntaxKind.EqualsToken) {
                const identifierToken = this.nextToken();
                const operatorToken = this.nextToken();
                // change it to parseBinaryExpression in the future
                const right = this.parseAssignmentExpression();
                return new AssignmentExpressionSyntax(identifierToken, operatorToken, right);
            }

            return this.parseBinaryExpression();
        }

        private parseBinaryExpression (parentPrecedence: number = 0): ExpressionSyntax {
            let left: ExpressionSyntax;
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

        private parsePrimaryExpression (): ExpressionSyntax {
            switch (this.current.kind) {
                case SyntaxKind.OpenParenthesisToken:
                    const left = this.nextToken();
                    // change it to parseBinaryExpression in the future
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

        get diagnostics (): DiagnosticBag {
            return this._diagnostics;
        }
    }
}
