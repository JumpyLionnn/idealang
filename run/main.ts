

const readline = require("readline");

const rl = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout,
    "terminal": false
});

const variables: Map<Idealang.VariableSymbol, Idealang.all> = new Map();
let previous: Idealang.Compilation | null = null;

let text = "";


function input (prefix: string){
    rl.question(prefix, (line: string) => {
        text += line;
        const isBlank = line.trim() === "";
        if(!isBlank){
            input("|");
            text += "\n";
            return;
        }
        const syntaxTree = Idealang.SyntaxTree.parse(text);


        const compilation = previous === null ? new Idealang.Compilation(syntaxTree): previous.continueWith(syntaxTree);

        const result = compilation.evaluate(variables);

        const diagnostics = result.diagnostics;

        const errors = getErrorsTextMessages(syntaxTree.text, diagnostics);
        if(errors.length > 0){
            for(let i =0; i < diagnostics.length; i++){
                console.error(errors[i]);
                console.log();
            }
        }
        else{
            previous = compilation;
            console.log(result.value);
        }
        text = "";
        input(">");
    });
}

function getErrorsTextMessages (text: Idealang.SourceText, diagnostics: Idealang.Diagnostic[]): string[]{
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

input(">");