/// <reference path="lexer.ts"/>
/// <reference path="syntaxKind.ts"/>
/// <reference path="syntaxFacts.ts"/>
/// <reference path="literalExpressionSyntax.ts"/>
/// <reference path="binaryExpressionSyntax.ts"/>
/// <reference path="parenthesizedExpressionSyntax.ts"/>
/// <reference path="../diagnosticBag.ts"/>
namespace Idealang{
    export class Parser {
        private readonly _diagnostics: DiagnosticBag = new DiagnosticBag();
        private readonly _text: SourceText;
        private readonly _tokens: SyntaxToken[] = [];
        private _position: number = 0;

        public constructor (text: SourceText) {
            this._text = text;
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

        public get diagnostics (){return this._diagnostics;}

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

        public parseCompilationUnit (): CompilationUnitSyntax {
            const statement = this.parseStatement();
            const endOfFileToken = this.matchToken(SyntaxKind.EndOfFileToken);
            return new CompilationUnitSyntax(statement, endOfFileToken);
        }

        private parseStatement (): StatementSyntax{
            switch(this.current.kind){
                case SyntaxKind.OpenBraceToken:
                    return this.parseBlockStatement();
                case SyntaxKind.LetKeyword:
                case SyntaxKind.VarKeyword:
                    return this.parseVariableDeclaration();
                case SyntaxKind.IfKeyword:
                    return this.parseIfStatement();
                case SyntaxKind.WhileKeyword:
                    return this.parseWhileStatement();
                case SyntaxKind.ForKeyword:
                    return this.parseForStatement();
                default:
                    return this.parseExpressionStatement();
            }
        }

        private parseBlockStatement (): BlockStatementSyntax{
            const statements: StatementSyntax[] = [];
            const openBraceToken = this.matchToken(SyntaxKind.OpenBraceToken);
            let startToken = this.current;
            while(this.current.kind !== SyntaxKind.EndOfFileToken && this.current.kind !== SyntaxKind.CloseBraceToken){
                const statement = this.parseStatement();
                statements.push(statement);

                if(this.current === startToken){
                    this.nextToken();
                }
                startToken = this.current;
            }
            const closeBraceToken = this.matchToken(SyntaxKind.CloseBraceToken);
            return new BlockStatementSyntax(openBraceToken, statements, closeBraceToken);
        }

        private parseVariableDeclaration (): VariableDeclarationSyntax{
            const expected = this.current.kind === SyntaxKind.LetKeyword ? SyntaxKind.LetKeyword : SyntaxKind.VarKeyword;
            const keyword = this.matchToken(expected);
            const identifier = this.matchToken(SyntaxKind.IdentifierToken);
            const equalsToken = this.matchToken(SyntaxKind.EqualsToken);
            const initializer = this.parseExpression();
            const semicolonToken = this.matchToken(SyntaxKind.SemicolonToken);
            return new VariableDeclarationSyntax(keyword, identifier, equalsToken, initializer, semicolonToken);
        }

        private parseIfStatement (): IfStatementSyntax{
            const ifKeyword = this.matchToken(SyntaxKind.IfKeyword);
            const condition = this.parseParenthesizedExpression();
            const thenStatement = this.parseStatement();
            const elseClause = this.parseElseClause();
            return new IfStatementSyntax(ifKeyword, condition, thenStatement, elseClause);
        }

        private parseElseClause (): ElseClauseSyntax | null {
            if(this.current.kind !== SyntaxKind.ElseKeyword){
                return null;
            }
            const elseKeyword = this.nextToken();
            const elseStatement = this.parseStatement();
            return new ElseClauseSyntax(elseKeyword, elseStatement);
        }

        private parseWhileStatement (): WhileStatementSyntax{
            const whileKeyword = this.matchToken(SyntaxKind.WhileKeyword);
            const condition = this.parseParenthesizedExpression();
            const body = this.parseStatement();
            return new WhileStatementSyntax(whileKeyword, condition, body);
        }

        private parseForStatement (): ForStatementSyntax{
            const forKeyword = this.matchToken(SyntaxKind.ForKeyword);
            const identifier = this.matchToken(SyntaxKind.IdentifierToken);
            const equalsToken = this.matchToken(SyntaxKind.EqualsToken);
            const lowerBound = this.parseExpression();
            const toKeyword = this.matchToken(SyntaxKind.ToKeyword);
            const upperBound = this.parseExpression();
            const body = this.parseStatement();
            return new ForStatementSyntax(forKeyword, identifier, equalsToken, lowerBound, toKeyword, upperBound, body);
        }

        private parseExpressionStatement (): ExpressionStatementSyntax{
            const expression = this.parseExpression();
            const semiColonToken = this.matchToken(SyntaxKind.SemicolonToken);
            return new ExpressionStatementSyntax(expression, semiColonToken);
        }

        private parseExpression (): ExpressionSyntax {
            return this.parseAssignmentExpression();
        }

        private parseAssignmentExpression (): ExpressionSyntax {
            if (this.peek(0).kind === SyntaxKind.IdentifierToken &&
                this.peek(1).kind === SyntaxKind.EqualsToken) {
                const identifierToken = this.nextToken();
                const operatorToken = this.nextToken();
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
                    return this.parseParenthesizedExpression();
                case SyntaxKind.TrueKeyword:
                case SyntaxKind.FalseKeyword:
                    return this.parseBooleanLiteral();
                case SyntaxKind.NumberToken:
                    return this.parseNumberLiteral();
                case SyntaxKind.StringToken:
                    return this.parseStringLiteral();
                default:
                    return this.parseNameExpression();
            }
        }

        private parseParenthesizedExpression (){
            const left = this.matchToken(SyntaxKind.OpenParenthesisToken);
            const expression = this.parseAssignmentExpression();
            const right = this.matchToken(SyntaxKind.CloseParenthesisToken);
            return new ParenthesizedExpressionSyntax(left, expression, right);
        }

        private parseNumberLiteral (){
            const numberToken = this.matchToken(SyntaxKind.NumberToken);
            return new LiteralExpressionSyntax(numberToken);
        }

        private parseStringLiteral (){
            const stringToken = this.matchToken(SyntaxKind.StringToken);
            return new LiteralExpressionSyntax(stringToken);
        }

        private parseBooleanLiteral (){
            const isTrue = this.current.kind === SyntaxKind.TrueKeyword;
            const keywordToken = isTrue ? this.matchToken(SyntaxKind.TrueKeyword) : this.matchToken(SyntaxKind.FalseKeyword);
            return new LiteralExpressionSyntax(keywordToken, isTrue);
        }

        private parseNameExpression (){
            const identifierToken = this.matchToken(SyntaxKind.IdentifierToken);
            return new NameExpressionSyntax(identifierToken);
        }
    }
}
