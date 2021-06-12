namespace Idealang{
  export class BoundForStatement extends BoundStatement {
    private _variable: VariableSymbol;
    private _lowerBound: BoundExpression;
    private _upperBound: BoundExpression;
    private _body: BoundStatement;
    constructor (variable: VariableSymbol, lowerBound: BoundExpression, upperBound: BoundExpression, body: BoundStatement) {
      super();
      this._variable = variable;
      this._lowerBound = lowerBound;
      this._upperBound = upperBound;
      this._body = body;
      this._kind = BoundNodeKind.ForStatement;
    }

    public get variable (){return this._variable;}
    public get lowerBound (){return this._lowerBound;}
    public get upperBound (){return this._upperBound;}
    public get body (){return this._body;}

  }
}