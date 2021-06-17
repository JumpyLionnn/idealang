namespace Idealang{
    export abstract class BoundNode{
        protected _kind: BoundNodeKind;
        public get kind (){return this._kind;}
        public abstract getChildren (): BoundNode[];
    }
}