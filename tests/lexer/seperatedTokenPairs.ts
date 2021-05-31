/// <reference path="../main.ts" />


Tests.describe("seperated pairs lexer token test", (assert) => {
    for(let i = 0; i < lexerTokens.length; i++){
        const t1Kind = lexerTokens[i][0] as SyntaxKind;
        const t1Text = lexerTokens[i][1];
        for (let j = 0; j < lexerTokens.length; j++) {
            const t2Kind = lexerTokens[j][0] as SyntaxKind;
            const t2Text = lexerTokens[j][1];
            if(!requiresSeperator(t1Kind, t2Kind)){
                for(let k = 0; k < lexerSeperatorsTokens.length; k++){
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