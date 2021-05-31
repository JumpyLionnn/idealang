const lexerTokens: (SyntaxKind | string)[][] = [
    //[SyntaxKind.WhitespaceToken, " "],
    //[SyntaxKind.WhitespaceToken, "  "],
    //[SyntaxKind.WhitespaceToken, "\r"],
    //[SyntaxKind.WhitespaceToken, "\n"],
    //[SyntaxKind.WhitespaceToken, "\r\n"],

    [SyntaxKind.NumberToken, "1"],
    [SyntaxKind.NumberToken, "123"],

    [SyntaxKind.PlusToken, "+"],
    [SyntaxKind.MinusToken, "-"],
    [SyntaxKind.StarToken, "*"],
    [SyntaxKind.SlashToken , "/"],
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


const lexerSeperatorsTokens: (SyntaxKind | string)[][] = [
    [SyntaxKind.WhitespaceToken, " "],
    [SyntaxKind.WhitespaceToken, "  "],
    [SyntaxKind.WhitespaceToken, "\r"],
    [SyntaxKind.WhitespaceToken, "\n"],
    [SyntaxKind.WhitespaceToken, "\r\n"]
];