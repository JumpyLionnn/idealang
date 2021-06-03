///<reference path="boundBinaryOperatorKind.ts"/>
///<reference path="../syntax/syntaxKind.ts"/>
namespace Idealang{
    export class BoundBinaryOperator {
        public syntaxKind: SyntaxKind;
        public kind: BoundBinaryOperatorKind;
        public leftType: Type;
        public rightType: Type;
        public resultType: Type;
        private constructor (syntaxKind: SyntaxKind, kind: BoundBinaryOperatorKind, leftType: Type, rightType?: Type, resultType?: Type) {
            this.syntaxKind = syntaxKind;
            this.kind = kind;
            this.leftType = leftType;
            this.rightType = rightType || leftType;
            this.resultType = resultType || leftType;
        }

        private static _operators: BoundBinaryOperator[] = [
            new BoundBinaryOperator(SyntaxKind.PlusToken, BoundBinaryOperatorKind.Addition, Type.int),
            new BoundBinaryOperator(SyntaxKind.MinusToken, BoundBinaryOperatorKind.Substruction, Type.int),
            new BoundBinaryOperator(SyntaxKind.StarToken, BoundBinaryOperatorKind.Multiplication, Type.int),
            new BoundBinaryOperator(SyntaxKind.SlashToken, BoundBinaryOperatorKind.Division, Type.int),

            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, Type.int, Type.int, Type.boolean),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, Type.int, Type.int, Type.boolean),

            new BoundBinaryOperator(SyntaxKind.AmpersandAmpersandToken, BoundBinaryOperatorKind.LogicalAnd, Type.boolean),
            new BoundBinaryOperator(SyntaxKind.PipePipeToken, BoundBinaryOperatorKind.LogicalOr, Type.boolean),
            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, Type.boolean),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, Type.boolean),
        ];

        public static bind (syntaxKind: SyntaxKind, leftType: Type, rightType: Type): BoundBinaryOperator | null{
            for(let i = 0; i < this._operators.length; i++){
                if(this._operators[i].syntaxKind === syntaxKind && this._operators[i].leftType === leftType && this._operators[i].rightType === rightType){
                    return this._operators[i];
                }
            }
            return null;
        }
    }
}
