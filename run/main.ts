

const readline = require("readline");

const rl = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout,
    "terminal": false
});

const variables: Map<Idealang.VariableSymbol, Idealang.all> = new Map();


function input (){
    rl.question(">>>", (line: string) => {
        const syntaxTree = Idealang.SyntaxTree.parse(line);

        const compilation = new Idealang.Compilation(syntaxTree);

        const result = compilation.evaluate(variables);

        const diagnostics = result.diagnostics;

        if(diagnostics.length > 0){
            for(let i =0; i < diagnostics.length; i++){
                console.error(getErrorText(diagnostics[i], line));
                console.log();
            }
        }
        else{
            console.log(result.value);
        }
        input();
    });
}




function getErrorText (diagnostic: Idealang.Diagnostic, line: string): string{
    let text = "ERROR: " + diagnostic.toString() + "\n";
    text += line + "\n";

    text += " ".repeat(diagnostic.span.start);
    text += "^".repeat(diagnostic.span.length);

    return text;
}






input();










