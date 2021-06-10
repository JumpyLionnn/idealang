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
        OpenBraceToken = "OpenBraceToken",
        CloseBraceToken = "CloseBraceToken",
        SemicolonToken = "SemicolonToken",
        IdentifierToken = "IdentifierToken",

        // keywords
        FalseKeyword = "FalseKeyword",
        TrueKeyword = "TrueKeyword",
        VarKeyword = "VarKeyword",
        LetKeyword = "LetKeyword",

        // nodes
        CompilationUnit = "CompilationUnit",

        // statements
        BlockStatement = "BlockStatement",
        ExpressionStatement = "ExpressionStatement",
        VariableDeclaration = "VariableDeclaration",

        // expressions
        LiteralExpression = "LiteralExpression",
        NameExpression = "NameExpression",
        AssignmentExpression = "AssignmentExpression",
        BinaryExpression = "BinaryExpression",
        UnaryExpression = "UnaryExpression",
        ParenthesizedExpression = "ParenthesizedExpression"
    }
}
