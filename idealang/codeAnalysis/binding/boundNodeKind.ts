namespace Idealang{
    export enum BoundNodeKind{

        // expressions
        LiteralExpression = "LiteralExpression",
        VariableExpression = "VariableExpression",
        AssignmentExpression = "AssignmentExpression",
        UnaryExpression = "UnaryExpression",
        BinaryExpression = "BinaryExpression",
        ErrorExpression = "ErrorExpression",


        // statements
        BlockStatement = "BlockStatement",
        ExpressionStatement = "ExpressionStatement",
        VariableDeclaration = "VariableDeclaration",
        IfStatement = "IfStatement",
        WhileStatement = "WhileStatement",
        ForStatement = "ForStatement",
        GoToStatement = "GoToStatement",
        ConditionalGoToStatement = "ConditionalGoToStatement",
        LabelStatement = "LabelStatement",
    }
}
