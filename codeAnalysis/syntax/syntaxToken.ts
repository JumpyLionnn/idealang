class SyntaxToken{
    public kind: SyntaxKind;
    public text: string;
    public position: number;
    public value: all;
    constructor (kind: SyntaxKind, position: number, text: string, value: all| null){
        this.kind = kind;
        this.position = position;
        this.text = text;
        if(value){
            this.value = value;
        }
    }
}