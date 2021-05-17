
class EvaluationResult {
    private _diagnostics: Diagnostic[];
    private _value: all;
    constructor (diagnostics: Diagnostic[], value?: all) {
        this._diagnostics = diagnostics;
        if(value){
            this._value = value;
        }
    }

    public get diagnostics (): Diagnostic[]{return this._diagnostics;}
    public get value (): all{return this._value;}
}