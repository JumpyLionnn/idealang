/// <reference path="../main.ts" />


Tests.describe("pairs lexer token test", (assert) => {
    for(let i = 0; i < lexerTokens.length; i++){
        const t1Kind = lexerTokens[i][0] as SyntaxKind;
        const t1Text = lexerTokens[i][1];
        for (let j = 0; j < lexerTokens.length; j++) {
            const t2Kind = lexerTokens[j][0] as SyntaxKind;
            const t2Text = lexerTokens[j][1];
            if(!requiresSeperator(t1Kind, t2Kind)){
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

function requiresSeperator (t1Kind: SyntaxKind, t2Kind: SyntaxKind): boolean {
    const t1IsKeyword = t1Kind.endsWith("Keyword");
    const t2IsKeyword = t2Kind.endsWith("Keyword");
    if(t1Kind === SyntaxKind.IdentifierToken && t2Kind === SyntaxKind.IdentifierToken){
        return true;
    }

    if(t1IsKeyword && t2IsKeyword){
        return true;
    }

    if(t1IsKeyword && t2Kind === SyntaxKind.IdentifierToken){
        return true;
    }

    if(t1Kind === SyntaxKind.IdentifierToken && t2IsKeyword){
        return true;
    }

    if(t1Kind === SyntaxKind.NumberToken && t2Kind === SyntaxKind.NumberToken){
        return true;
    }

    if(t1Kind === SyntaxKind.BangToken && t2Kind === SyntaxKind.EqualsToken){
        return true;
    }

    if(t1Kind === SyntaxKind.BangToken && t2Kind === SyntaxKind.EqualsEqualsToken){
        return true;
    }

    if(t1Kind === SyntaxKind.EqualsToken && t2Kind === SyntaxKind.EqualsToken){
        return true;
    }

    if(t1Kind === SyntaxKind.EqualsToken && t2Kind === SyntaxKind.EqualsEqualsToken){
        return true;
    }

    return false;
}
