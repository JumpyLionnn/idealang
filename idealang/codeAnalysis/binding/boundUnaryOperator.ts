///<reference path="boundUnaryOperatorKind.ts"/>
///<reference path="../syntax/syntaxKind.ts"/>
///<reference path="../symbols/typeSymbol.ts"/>

namespace Idealang{
    export class BoundUnaryOperator {
        private _syntaxKind: SyntaxKind;
        private _kind: BoundUnaryOperatorKind;
        private _operandType: TypeSymbol;
        private _resultType: TypeSymbol;
        private constructor (syntaxKind: SyntaxKind, kind: BoundUnaryOperatorKind, operandType: TypeSymbol, resultType?: TypeSymbol) {
            this._syntaxKind = syntaxKind;
            this._kind = kind;
            this._operandType = operandType;
            this._resultType = resultType || operandType;
        }

        public get syntaxKind (){return this._syntaxKind;}
        public get kind (){return this._kind;}
        public get operandType (){return this._operandType;}
        public get resultType (){return this._resultType;}

        private static _operators: BoundUnaryOperator[] = [
            new BoundUnaryOperator(SyntaxKind.BangToken, BoundUnaryOperatorKind.LogicalNegation, TypeSymbol.bool),
            new BoundUnaryOperator(SyntaxKind.PlusToken, BoundUnaryOperatorKind.Identity, TypeSymbol.int),
            new BoundUnaryOperator(SyntaxKind.MinusToken, BoundUnaryOperatorKind.Negation, TypeSymbol.int),
        ];

        public static bind (syntaxKind: SyntaxKind, operandType: TypeSymbol): BoundUnaryOperator | null{
            for(let i = 0; i < this._operators.length; i++){
                if(this._operators[i].syntaxKind === syntaxKind && this._operators[i].operandType === operandType){
                    return this._operators[i];
                }
            }
            return null;
        }
    }
}
