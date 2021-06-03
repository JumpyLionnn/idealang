///<reference path="boundExpression.ts"/>
///<reference path="boundNodeKind.ts"/>
namespace Idealang{
    export class BoundLiteralExpression extends BoundExpression{
        public value: all;
        constructor (value: all){
            super();
            this.value = value;
            this.type = Type.getType(this.value);
            this.kind = BoundNodeKind.LiteralExpression;
        }
    }
}
