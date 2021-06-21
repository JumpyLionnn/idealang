///<reference path="repl.ts" />
class IdealangRepl extends Repl {
    private readonly _variables: Map<Idealang.VariableSymbol, Idealang.all> = new Map<Idealang.VariableSymbol, Idealang.all>();
    private _previous: Idealang.Compilation | null = null;

    private _showTree: boolean = false;
    private _showProgram: boolean = false;

    constructor () {
        super();
    }

    protected isCompleteSubmission (text: string): boolean{
        const lines = text.split("\n");
        if(lines[lines.length - 1] === ""){
            return true;
        }
        const syntaxTree = Idealang.SyntaxTree.parse(text);
        if(syntaxTree.diagnostics.length > 0){
            return false;
        }
        return true;
    }


    protected evaluateSubmission (text: string){
        const syntaxTree = Idealang.SyntaxTree.parse(text);
        const compilation: Idealang.Compilation = this._previous === null ? new Idealang.Compilation(syntaxTree): this._previous.continueWith(syntaxTree);

        const result = compilation.evaluate(this._variables);

        if(this._showTree){
            const builder = new Idealang.TextBuilder();
            syntaxTree.root.writeTo(builder);
            cConsole.log(builder);
        }
        if(this._showProgram){
            const builder = new Idealang.TextBuilder();
            compilation.emitTree(builder);
            cConsole.log(builder);
        }

        const diagnostics = result.diagnostics;

        if(diagnostics.length > 0){
            const errors = this.getErrorsTextMessages(syntaxTree.text, diagnostics);
            for(let i =0; i < diagnostics.length; i++){
                cConsole.error(errors[i]);
                cConsole.log();
            }
        }
        else{
            this._previous = compilation;
            cConsole.log(result.value);
        }
    }


    protected evaluateMetaCommand (input: string) {
        if(input === "#showTree"){
            this._showTree = !this._showTree;
            cConsole.log(this._showTree ? "showing parse tree" : "not showing parse tree");
        }
        else if(input === "#showProgram"){
            this._showProgram = !this._showProgram;
            cConsole.log(this._showProgram ? "showing bound tree" : "not showing bound tree");
        }
        else if(input === "#clr"){
            cConsole.clear();
        }
        else if(input === "#reset"){
            this._variables.clear();
            this._previous = null;
        }
        else{
            cConsole.error(`invalid command ${input}`);
        }
    }


    private getErrorsTextMessages (text: Idealang.SourceText, diagnostics: Idealang.Diagnostic[]): string[]{
        const result = [];
        for(let i =0; i < diagnostics.length; i++){
            const diagnostic = diagnostics[i];
            const lineIndex = text.getLineIndex(diagnostic.span.start);
            const line = text.lines[lineIndex];
            let character = diagnostic.span.start - line.start ;

            let messageText = `ERROR (${lineIndex + 1}, ${character + 1}): ${diagnostic.toString()}\n`;
            messageText += text.toString(line.start, line.length  +1) + "\n";
            if(lineIndex > 0){
                character--;
            }
            messageText += " ".repeat(character);
            messageText += "^".repeat(diagnostic.span.length);

            result.push(messageText);
        }
        return result;
    }

}