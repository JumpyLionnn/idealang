enum SyntaxKind{

    // tokens
    BadToken = "BadToken",
    EndOfFileToken = "EndOfFileToken",
    WhitespaceToken = "WhitespaceToken",
    NumberToken = "NumberToken",
    PlusToken = "PlusToken",
    MinusToken = "MinusToken",
    StarToken = "StarToken",
    SlashToken = "SlashToken",
    BangToken = "BangToken",
    AmpersandAmpersandToken = "AmpersandAmpersandToken",
    PipePipeToken = "PipePipeToken",
    EqualsEqualsToken = "EqualsEqualsToken",
    BangEqualsToken = "BangEqualsToken",
    OpenParenthesisToken = "OpenParenthesisToken",
    CloseParenthesisToken = "CloseParenthesisToken",
    IdentifierToken = "IdentifierToken",

    // keywords
    FalseKeyword = "FalseKeyword",
    TrueKeyword = "TrueKeyword",

    // expressions
    LiteralExpression = "LiteralExpression",
    BinaryExpression = "BinaryExpression",
    UnaryExpression = "UnaryExpression",
    ParenthesizedExpression = "ParenthesizedExpression"
}