/// <reference path="../main.ts" />


Tests.describe("single lexer token test", (assert) => {
    const tokens = [];
    tokens.push(...lexerTokens);
    tokens.push(...lexerSeperatorsTokens);
    for(let i = 0; i < tokens.length; i++){
        const token = SyntaxTree.parseTokens(tokens[i][1])[0];
        assert.equal(tokens[i][0], token.kind);
        assert.equal(tokens[i][1], token.text);
    }
});
