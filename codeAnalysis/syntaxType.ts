enum SyntaxType{

    // tokens
    BadToken = "BadToken",
    EndOfFileToken = "EndOfFileToken",
    WhitespaceToken = "WhitespaceToken",
    NumberToken = "NumberToken",
    PlusToken = "PlusToken",
    MinusToken = "MinusToken",
    StarToken = "StarToken",
    SlashToken = "SlashToken",
    OpenParenthesisToken = "OpenParenthesisToken",
    CloseParenthesisToken = "CloseParenthesisToken",

    // expressions
    LiteralExpression = "LiteralExpression",
    BinaryExpression = "BinaryExpression",
    UnaryExpression = "UnaryExpression",
    ParenthesizedExpression = "ParenthesizedExpression"
}