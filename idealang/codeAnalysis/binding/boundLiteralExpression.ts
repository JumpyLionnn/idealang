///<reference path="boundExpression.ts"/>
///<reference path="boundNodeKind.ts"/>
namespace Idealang{
    export class BoundLiteralExpression extends BoundExpression{
        public _value: all;
        constructor (value: all){
            super();
            this._value = value;
            this._type = Type.getType(value);
            this._kind = BoundNodeKind.LiteralExpression;
        }

        public get value (){return this._value;}

        public getChildren (){
            return [];
        }
    }
}
