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
        LessToken = "LessToken",
        LessOrEqualsToken = "LessOrEqualsToken",
        GreaterToken = "GreatToken",
        GreaterOrEqualsToken = "GreatOrEqualsToken",
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
        IfKeyword = "IfKeyword",
        ElseKeyword = "ElseKeyword",
        WhileKeyword = "WhileKeyword",

        // nodes
        CompilationUnit = "CompilationUnit",

        // statements
        BlockStatement = "BlockStatement",
        ExpressionStatement = "ExpressionStatement",
        VariableDeclaration = "VariableDeclaration",
        IfStatement = "IfStatement",
        ElseClause = "ElseClause",
        WhileStatement = "WhileStatement",

        // expressions
        LiteralExpression = "LiteralExpression",
        NameExpression = "NameExpression",
        AssignmentExpression = "AssignmentExpression",
        BinaryExpression = "BinaryExpression",
        UnaryExpression = "UnaryExpression",
        ParenthesizedExpression = "ParenthesizedExpression"
    }
}
