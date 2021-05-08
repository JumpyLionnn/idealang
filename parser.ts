/// <reference path="syntaxNodes.ts"/>

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

    private match (type: SyntaxType): SyntaxToken{
        if(this.current.type === type){
            return this.nextToken();
        }
        this._diagnostics.push(`ERROR: Unexpected token <${this.current.type}> expected <${type}>`);
        return new SyntaxToken(type, this.current.position, "", null);
    }

    public parse (): SyntaxTree{
        const expression = this.parseTerm();
        const endOfFileToken = this.match(SyntaxType.EndOfFileToken);
        return new SyntaxTree(this._diagnostics, expression, endOfFileToken);
    }

    private parseExpression (): ExpressionSyntax{
        return this.parseTerm();
    }

    private parseTerm (): ExpressionSyntax{
        let left = this.parseFactor();

        while (this.current.type === SyntaxType.PlusToken ||  this.current.type === SyntaxType.MinusToken){
            const operatorToken = this.nextToken();
            const right = this.parseFactor();
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        }
        return left;
    }

    private parseFactor (): ExpressionSyntax{
        let left = this.parsePrimaryExpression();

        while (this.current.type === SyntaxType.StarToken ||  this.current.type === SyntaxType.SlashToken){
            const operatorToken = this.nextToken();
            const right = this.parsePrimaryExpression();
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        }
        return left;
    }

    private parsePrimaryExpression (): ExpressionSyntax{
        if(this.current.type === SyntaxType.OpenParenthesisToken){
            const left = this.nextToken();
            const expression = this.parseExpression();
            const right = this.match(SyntaxType.CloseParenthesisToken);
            return new ParenthesizedExpressionSyntax(left, expression, right);
        }
        const numberToken = this.match(SyntaxType.NumberToken);
        return new NumberExpressionSyntax(numberToken);
    }

    get diagnostics (): string[]{
        return this._diagnostics;
    }

}