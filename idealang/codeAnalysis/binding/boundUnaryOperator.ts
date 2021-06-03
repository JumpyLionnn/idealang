///<reference path="boundUnaryOperatorKind.ts"/>
///<reference path="../syntax/syntaxKind.ts"/>

namespace Idealang{
    export class BoundUnaryOperator {
        public syntaxKind: SyntaxKind;
        public kind: BoundUnaryOperatorKind;
        public operandType: Type;
        public resultType: Type;
        private constructor (syntaxKind: SyntaxKind, kind: BoundUnaryOperatorKind, operandType: Type, resultType?: Type) {
            this.syntaxKind = syntaxKind;
            this.kind = kind;
            this.operandType = operandType;
            this.resultType = resultType || operandType;
        }

        private static _operators: BoundUnaryOperator[] = [
            new BoundUnaryOperator(SyntaxKind.BangToken, BoundUnaryOperatorKind.LogicalNegation, Type.boolean),
            new BoundUnaryOperator(SyntaxKind.PlusToken, BoundUnaryOperatorKind.Identity, Type.int),
            new BoundUnaryOperator(SyntaxKind.MinusToken, BoundUnaryOperatorKind.Negation, Type.int),
        ];

        public static bind (syntaxKind: SyntaxKind, operandType: Type): BoundUnaryOperator | null{
            for(let i = 0; i < this._operators.length; i++){
                if(this._operators[i].syntaxKind === syntaxKind && this._operators[i].operandType === operandType){
                    return this._operators[i];
                }
            }
            return null;
        }
    }
}
