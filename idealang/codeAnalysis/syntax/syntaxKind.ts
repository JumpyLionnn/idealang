namespace Idealang{
    export enum SyntaxKind{

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
        EqualsToken = "EqualsToken",
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
        NameExpression = "NameExpression",
        AssignmentExpression = "AssignmentExpression",
        BinaryExpression = "BinaryExpression",
        UnaryExpression = "UnaryExpression",
        ParenthesizedExpression = "ParenthesizedExpression"
    }
}
