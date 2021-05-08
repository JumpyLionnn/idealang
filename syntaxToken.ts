class SyntaxToken{
    public type: SyntaxType;
    public text: string;
    public position: number;
    public value: Value = "";
    constructor (type: SyntaxType, position: number, text: string, value: Value| null){
        this.type = type;
        this.position = position;
        this.text = text;
        if(value){
            this.value = value;
        }
    }
}

type Value = number | string;