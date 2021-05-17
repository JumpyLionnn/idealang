class BoundVariableExpression extends BoundExpression {
    private _name: string;
    constructor (name: string, type: Type) {
        super();
        this._name = name;
        this.kind = BoundNodeKind.VariableExpression;
        this.type = type;
    }

    public get name (): string{return this._name;}
}