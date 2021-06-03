

Tests.describe("syntax facts tests", (assert) => {
    const values = Object.keys(Idealang.SyntaxKind) as Idealang.SyntaxKind[];
    for (let i = 0; i < values.length; i++) {
        const kind = values[i];
        const text = Idealang.SyntaxFacts.getText(kind);
        if(text === null){
            return;
        }
        const tokens = Idealang.SyntaxTree.parseTokens(text);
        const token = tokens[0];
        assert.equal(kind, token.kind);
        assert.equal(text, token.text);
    }
});