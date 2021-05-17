/// <reference path="./idealang/codeAnalysis/syntax/syntaxTree.ts" />
/// <reference path="./idealang/codeAnalysis/compilation.ts" />
/// <reference path="./idealang/codeAnalysis/binding/binder.ts" />

const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout,
    "terminal": false
});


//const code = fs.readFileSync("./input.txt").toString();

const variables: {[name: string]: all} = {};


function input (){
    rl.question(">>>", (line: string) => {
        const syntaxTree = SyntaxTree.parse(line);

        const compilation = new Compilation(syntaxTree);

        const result = compilation.evaluate(variables);

        const diagnostics = result.diagnostics;

        console.log(syntaxTree.root);

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

input();


function getErrorText (diagnostic: Diagnostic, line: string): string{
    let text = "ERROR: " + diagnostic.toString() + "\n";
    text += line + "\n";

    text += " ".repeat(diagnostic.span.start);
    text += "^".repeat(diagnostic.span.length);

    return text;
}


