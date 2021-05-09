/// <reference path="lexer.ts"/>
/// <reference path="syntaxType.ts"/>
/// <reference path="syntaxFacts.ts"/>
/// <reference path="literalExpressionSyntax.ts"/>
/// <reference path="binaryExpressionSyntax.ts"/>
/// <reference path="parenthesizedExpressionSyntax.ts"/>

class Parser{
    private _tokens: SyntaxToken[] = [];
    private _position: number = 0;
    private _diagnostics: string[] = [];
    public constructor (text: string){

        const lexer = new Lexer(text);
        let token: SyntaxToken = new SyntaxToken(SyntaxType.WhitespaceToken, 0, "", null);
        while(token.type !== SyntaxType.EndOfFileToken){
            token = lexer.nextToken();

            if(token.type !== SyntaxType.WhitespaceToken && token.type !== SyntaxType.BadToken){
                this._tokens.push(token);
            }
        }
        this._diagnostics.push(...lexer.diagnostics);
    }

    private peek (offset: number): SyntaxToken{
        const index = this._position + offset;
        if(index >= this._tokens.length){
            return this._tokens[this._tokens.length -1];
        }
        return this._tokens[index];
    }

    private get current (): SyntaxToken{
        return this.peek(0);
    }

    private nextToken (): SyntaxToken{
        const current = this.current;
        this._position++;
        return current;
    }

    private matchToken (type: SyntaxType): SyntaxToken{
        if(this.current.type === type){
            return this.nextToken();
        }
        this._diagnostics.push(`ERROR: Unexpected token <${this.current.type}> expected <${type}>`);
        return new SyntaxToken(type, this.current.position, "", null);
    }

    public parse (): SyntaxTree{
        const expression = this.parseExpression();
        const endOfFileToken = this.matchToken(SyntaxType.EndOfFileToken);
        return new SyntaxTree(this._diagnostics, expression, endOfFileToken);
    }

    private parseExpression (parentPrecedence: number = 0): ExpressionSyntax{
        let left: ExpressionSyntax;
        const unaryOperatorPrecedence = SyntaxFacts.getUnaryOperatorPrecedence(this.current.type);
        if(unaryOperatorPrecedence !== 0 || unaryOperatorPrecedence > parentPrecedence){
            const operatorToken = this.nextToken();
            const operand = this.parsePrimaryExpression();
            left = new UnaryExpressionSyntax(operatorToken, operand);
        }
        else{
            left = this.parsePrimaryExpression();
        }

        while(true){
            const precedence = SyntaxFacts.getBinaryOperatorPrecedence(this.current.type);
            if(precedence === 0 || precedence < parentPrecedence){
                break;
            }

            const operatorToken = this.nextToken();
            const right = this.parseExpression(precedence);
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        }
        return left;
    }

    private parsePrimaryExpression (): ExpressionSyntax{
        if(this.current.type === SyntaxType.OpenParenthesisToken){
            const left = this.nextToken();
            const expression = this.parseExpression();
            const right = this.matchToken(SyntaxType.CloseParenthesisToken);
            return new ParenthesizedExpressionSyntax(left, expression, right);
        }
        const numberToken = this.matchToken(SyntaxType.NumberToken);
        return new LiteralExpressionSyntax(numberToken);
    }

    get diagnostics (): string[]{
        return this._diagnostics;
    }

}