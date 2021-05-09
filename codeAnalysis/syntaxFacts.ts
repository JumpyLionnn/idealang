class SyntaxFacts {
    private constructor () {}

    public static getBinaryOperatorPrecedence (type: SyntaxType): number{
        switch (type) {
            case SyntaxType.StarToken:
            case SyntaxType.SlashToken:
                return 2;
            case SyntaxType.PlusToken:
            case SyntaxType.MinusToken:
                return 1;
            default:
                return 0;
        }
    }

    public static getUnaryOperatorPrecedence (type: SyntaxType): number{
        switch (type) {
            case SyntaxType.PlusToken:
            case SyntaxType.MinusToken:
                return 1;
            default:
                return 0;
        }
    }
}