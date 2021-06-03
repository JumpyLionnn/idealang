/// <reference path="../main.ts" />

const lexerTokens: (Idealang.SyntaxKind | string)[][] = [

    [Idealang.SyntaxKind.NumberToken, "1"],
    [Idealang.SyntaxKind.NumberToken, "123"],

    [Idealang.SyntaxKind.PlusToken, "+"],
    [Idealang.SyntaxKind.MinusToken, "-"],
    [Idealang.SyntaxKind.StarToken, "*"],
    [Idealang.SyntaxKind.SlashToken , "/"],
    [Idealang.SyntaxKind.BangToken, "!"],
    [Idealang.SyntaxKind.EqualsToken, "="],
    [Idealang.SyntaxKind.AmpersandAmpersandToken, "&&"],
    [Idealang.SyntaxKind.PipePipeToken, "||"],
    [Idealang.SyntaxKind.EqualsEqualsToken, "=="],
    [Idealang.SyntaxKind.BangEqualsToken, "!="],
    [Idealang.SyntaxKind.OpenParenthesisToken, "("],
    [Idealang.SyntaxKind.CloseParenthesisToken, ")"],

    [Idealang.SyntaxKind.IdentifierToken, "a"],
    [Idealang.SyntaxKind.IdentifierToken, "abc"],

    [Idealang.SyntaxKind.FalseKeyword, "false"],
    [Idealang.SyntaxKind.TrueKeyword, "true"]
];


const lexerSeperatorsTokens: (Idealang.SyntaxKind | string)[][] = [
    [Idealang.SyntaxKind.WhitespaceToken, " "],
    [Idealang.SyntaxKind.WhitespaceToken, "  "],
    [Idealang.SyntaxKind.WhitespaceToken, "\r"],
    [Idealang.SyntaxKind.WhitespaceToken, "\n"],
    [Idealang.SyntaxKind.WhitespaceToken, "\r\n"]
];


Tests.describe("seperated pairs lexer token test", (assert) => {
    for(let i = 0; i < lexerTokens.length; i++){
        const t1Kind = lexerTokens[i][0] as Idealang.SyntaxKind;
        const t1Text = lexerTokens[i][1];
        for (let j = 0; j < lexerTokens.length; j++) {
            const t2Kind = lexerTokens[j][0] as Idealang.SyntaxKind;
            const t2Text = lexerTokens[j][1];
            if(!requiresSeperator(t1Kind, t2Kind)){
                for(let k = 0; k < lexerSeperatorsTokens.length; k++){
                    const seperatorKind = lexerSeperatorsTokens[k][0];
                    const seperatorText = lexerSeperatorsTokens[k][1];

                    const tokens = Idealang.SyntaxTree.parseTokens(t1Text + seperatorText + t2Text);

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
    for(let i = 0; i < tokens.length; i++){
        const token = Idealang.SyntaxTree.parseTokens(tokens[i][1])[0];
        assert.equal(tokens[i][0], token.kind);
        assert.equal(tokens[i][1], token.text);
    }
});

/// <reference path="../main.ts" />


Tests.describe("pairs lexer token test", (assert) => {
    for(let i = 0; i < lexerTokens.length; i++){
        const t1Kind = lexerTokens[i][0] as Idealang.SyntaxKind;
        const t1Text = lexerTokens[i][1];
        for (let j = 0; j < lexerTokens.length; j++) {
            const t2Kind = lexerTokens[j][0] as Idealang.SyntaxKind;
            const t2Text = lexerTokens[j][1];
            if(!requiresSeperator(t1Kind, t2Kind)){
                const tokens = Idealang.SyntaxTree.parseTokens(t1Text + t2Text);

                assert.equal(2, tokens.length);

                assert.equal(t1Kind, tokens[0].kind);
                assert.equal(t1Text, tokens[0].text);

                assert.equal(t2Kind, tokens[1].kind);
                assert.equal(t2Text, tokens[1].text);
            }
        }
    }
});

function requiresSeperator (t1Kind: Idealang.SyntaxKind, t2Kind: Idealang.SyntaxKind): boolean {
    const t1IsKeyword = t1Kind.endsWith("Keyword");
    const t2IsKeyword = t2Kind.endsWith("Keyword");
    if(t1Kind === Idealang.SyntaxKind.IdentifierToken && t2Kind === Idealang.SyntaxKind.IdentifierToken){
        return true;
    }

    if(t1IsKeyword && t2IsKeyword){
        return true;
    }

    if(t1IsKeyword && t2Kind === Idealang.SyntaxKind.IdentifierToken){
        return true;
    }

    if(t1Kind === Idealang.SyntaxKind.IdentifierToken && t2IsKeyword){
        return true;
    }

    if(t1Kind === Idealang.SyntaxKind.NumberToken && t2Kind === Idealang.SyntaxKind.NumberToken){
        return true;
    }

    if(t1Kind === Idealang.SyntaxKind.BangToken && t2Kind === Idealang.SyntaxKind.EqualsToken){
        return true;
    }

    if(t1Kind === Idealang.SyntaxKind.BangToken && t2Kind === Idealang.SyntaxKind.EqualsEqualsToken){
        return true;
    }

    if(t1Kind === Idealang.SyntaxKind.EqualsToken && t2Kind === Idealang.SyntaxKind.EqualsToken){
        return true;
    }

    if(t1Kind === Idealang.SyntaxKind.EqualsToken && t2Kind === Idealang.SyntaxKind.EqualsEqualsToken){
        return true;
    }

    return false;
}

