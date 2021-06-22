///<reference path="boundBinaryOperatorKind.ts"/>
///<reference path="../syntax/syntaxKind.ts"/>
///<reference path="../symbols/typeSymbol.ts"/>
namespace Idealang{
    export class BoundBinaryOperator {
        private _syntaxKind: SyntaxKind;
        private _kind: BoundBinaryOperatorKind;
        private _leftType: TypeSymbol;
        private _rightType: TypeSymbol;
        private _resultType: TypeSymbol;
        private constructor (syntaxKind: SyntaxKind, kind: BoundBinaryOperatorKind, leftType: TypeSymbol, rightType?: TypeSymbol, resultType?: TypeSymbol) {
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
            new BoundBinaryOperator(SyntaxKind.PlusToken, BoundBinaryOperatorKind.Addition, TypeSymbol.int),
            new BoundBinaryOperator(SyntaxKind.MinusToken, BoundBinaryOperatorKind.Substruction, TypeSymbol.int),
            new BoundBinaryOperator(SyntaxKind.StarToken, BoundBinaryOperatorKind.Multiplication, TypeSymbol.int),
            new BoundBinaryOperator(SyntaxKind.SlashToken, BoundBinaryOperatorKind.Division, TypeSymbol.int),

            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, TypeSymbol.int, TypeSymbol.int, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, TypeSymbol.int, TypeSymbol.int, TypeSymbol.bool),

            new BoundBinaryOperator(SyntaxKind.LessToken, BoundBinaryOperatorKind.Less, TypeSymbol.int, TypeSymbol.int, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.LessOrEqualsToken, BoundBinaryOperatorKind.LessOrEquals, TypeSymbol.int, TypeSymbol.int, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.GreaterToken, BoundBinaryOperatorKind.Greater, TypeSymbol.int, TypeSymbol.int, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.GreaterOrEqualsToken, BoundBinaryOperatorKind.GreaterOrEquals, TypeSymbol.int, TypeSymbol.int, TypeSymbol.bool),

            new BoundBinaryOperator(SyntaxKind.PlusToken, BoundBinaryOperatorKind.Addition, TypeSymbol.string),

            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, TypeSymbol.string, TypeSymbol.string, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, TypeSymbol.string, TypeSymbol.string, TypeSymbol.bool),

            new BoundBinaryOperator(SyntaxKind.AmpersandAmpersandToken, BoundBinaryOperatorKind.LogicalAnd, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.PipePipeToken, BoundBinaryOperatorKind.LogicalOr, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, TypeSymbol.bool),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, TypeSymbol.bool),
        ];

        public static bind (syntaxKind: SyntaxKind, leftType: TypeSymbol, rightType: TypeSymbol): BoundBinaryOperator | null{
            for(let i = 0; i < this._operators.length; i++){
                if(this._operators[i].syntaxKind === syntaxKind && this._operators[i].leftType === leftType && this._operators[i].rightType === rightType){
                    return this._operators[i];
                }
            }
            return null;
        }
    }
}
