namespace Idealang{
    export class SyntaxFacts {
        private constructor () {}

        public static getUnaryOperatorPrecedence (kind: SyntaxKind): number{
            switch (kind) {
                case SyntaxKind.PlusToken:
                case SyntaxKind.MinusToken:
                case SyntaxKind.BangToken:
                    return 6;
                default:
                    return 0;
            }
        }

        public static getBinaryOperatorPrecedence (kind: SyntaxKind): number{
            switch (kind) {
                case SyntaxKind.StarToken:
                case SyntaxKind.SlashToken:
                    return 5;

                case SyntaxKind.PlusToken:
                case SyntaxKind.MinusToken:
                    return 4;

                case SyntaxKind.EqualsEqualsToken:
                case SyntaxKind.BangEqualsToken:
                    return 3;

                case SyntaxKind.AmpersandAmpersandToken:
                    return 2;

                case SyntaxKind.PipePipeToken:
                    return 1;

                default:
                    return 0;
            }
        }

        public static getKeywordKind (text: string): SyntaxKind{
            switch (text) {
                case "true":
                    return SyntaxKind.TrueKeyword;
                case "false":
                    return SyntaxKind.FalseKeyword;
                case "var":
                    return SyntaxKind.VarKeyword;
                case "let":
                    return SyntaxKind.LetKeyword;
                default:
                    return SyntaxKind.IdentifierToken;
            }
        }

        public static getUnaryOperatorsKinds (){
            const kinds = Object.keys(SyntaxKind) as SyntaxKind[];
            const unaryOperators = [];
            for (let i = 0; i < kinds.length; i++) {
                const kind = kinds[i];
                if(this.getUnaryOperatorPrecedence(kind) > 0){
                    unaryOperators.push(kind);
                }
            }
            return unaryOperators;
        }

        public static getBinaryOperatorsKinds (){
            const kinds = Object.keys(SyntaxKind) as SyntaxKind[];
            const bianryOperators = [];
            for (let i = 0; i < kinds.length; i++) {
                const kind = kinds[i];
                if(this.getBinaryOperatorPrecedence(kind) > 0){
                    bianryOperators.push(kind);
                }
            }
            return bianryOperators;
        }

        public static getText (kind: SyntaxKind){
            switch (kind) {
                case SyntaxKind.PlusToken:
                    return "+";
                case SyntaxKind.MinusToken:
                    return "-";
                case SyntaxKind.StarToken:
                    return "*";
                case SyntaxKind.SlashToken:
                    return "/";
                case SyntaxKind.BangToken:
                    return "!";
                case SyntaxKind.EqualsToken:
                    return "=";
                case SyntaxKind.AmpersandAmpersandToken:
                    return "&&";
                case SyntaxKind.PipePipeToken:
                    return "||";
                case SyntaxKind.EqualsEqualsToken:
                    return "==";
                case SyntaxKind.BangEqualsToken:
                    return "!=";
                case SyntaxKind.OpenParenthesisToken:
                    return "(";
                case SyntaxKind.CloseParenthesisToken:
                    return ")";
                case SyntaxKind.OpenBraceToken:
                    return "{";
                case SyntaxKind.CloseBraceToken:
                    return "}";
                case SyntaxKind.SemicolonToken:
                    return ";";
                case SyntaxKind.FalseKeyword:
                    return "false";
                case SyntaxKind.TrueKeyword:
                    return "true";
                case SyntaxKind.VarKeyword:
                    return "var";
                case SyntaxKind.LetKeyword:
                    return "let";
                default:
                    return null;
            }
        }
    }
}
