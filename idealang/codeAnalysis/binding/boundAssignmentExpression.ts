
class BoundAssignmentExpression extends BoundExpression {
    private _name: string;
    private _expression: BoundExpression;
    constructor (name: string, expression: BoundExpression) {
        super();
        this._name = name;
        this._expression = expression;
        this.kind = BoundNodeKind.AssignmentExpression;
        this.type = expression.type;
    }

    public get name (): string{return this._name;}
    public get expression (): BoundExpression{return this._expression;}
}