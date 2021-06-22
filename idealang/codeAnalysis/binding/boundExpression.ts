///<reference path="boundNode.ts" />
namespace Idealang{
    export abstract class BoundExpression extends BoundNode{
        protected _type: TypeSymbol;
        public get type (){return this._type;}
    }
}
