///<reference path="boundBinaryOperatorKind.ts"/>
///<reference path="../syntax/syntaxKind.ts"/>
namespace Idealang{
    export class BoundBinaryOperator {
        private _syntaxKind: SyntaxKind;
        private _kind: BoundBinaryOperatorKind;
        private _leftType: Type;
        private _rightType: Type;
        private _resultType: Type;
        private constructor (syntaxKind: SyntaxKind, kind: BoundBinaryOperatorKind, leftType: Type, rightType?: Type, resultType?: Type) {
            this._syntaxKind = syntaxKind;
            this._kind = kind;
            this._leftType = leftType;
            this._rightType = rightType || leftType;
            this._resultType = resultType || leftType;
        }

        public get syntaxKind (){return this._syntaxKind;}
        public get kind (){return this._kind;}
        public get leftType (){return this._leftType;}
        public get rightType (){return this._rightType;}
        public get resultType (){return this._resultType;}


        private static _operators: BoundBinaryOperator[] = [
            new BoundBinaryOperator(SyntaxKind.PlusToken, BoundBinaryOperatorKind.Addition, Type.int),
            new BoundBinaryOperator(SyntaxKind.MinusToken, BoundBinaryOperatorKind.Substruction, Type.int),
            new BoundBinaryOperator(SyntaxKind.StarToken, BoundBinaryOperatorKind.Multiplication, Type.int),
            new BoundBinaryOperator(SyntaxKind.SlashToken, BoundBinaryOperatorKind.Division, Type.int),

            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, Type.int, Type.int, Type.bool),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, Type.int, Type.int, Type.bool),

            new BoundBinaryOperator(SyntaxKind.LessToken, BoundBinaryOperatorKind.Less, Type.int, Type.int, Type.bool),
            new BoundBinaryOperator(SyntaxKind.LessOrEqualsToken, BoundBinaryOperatorKind.LessOrEquals, Type.int, Type.int, Type.bool),
            new BoundBinaryOperator(SyntaxKind.GreaterToken, BoundBinaryOperatorKind.Greater, Type.int, Type.int, Type.bool),
            new BoundBinaryOperator(SyntaxKind.GreaterOrEqualsToken, BoundBinaryOperatorKind.GreaterOrEquals, Type.int, Type.int, Type.bool),

            new BoundBinaryOperator(SyntaxKind.AmpersandAmpersandToken, BoundBinaryOperatorKind.LogicalAnd, Type.bool),
            new BoundBinaryOperator(SyntaxKind.PipePipeToken, BoundBinaryOperatorKind.LogicalOr, Type.bool),
            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, Type.bool),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, Type.bool),
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
