/// <reference path="./parser.ts" />
/// <reference path="./evaluator.ts" />
/// <reference path="./syntaxType.ts" />

const fs = require("fs");


const code = fs.readFileSync("./input.txt").toString();


const syntaxTree = SyntaxTree.parse(code);

//console.log(syntaxTree.root);


if(syntaxTree.diagnostics.length > 0){
    for(let i =0; i < syntaxTree.diagnostics.length; i++){
        console.error(syntaxTree.diagnostics[i]);
    }
}
else{
    const evaluator = new Evaluator(syntaxTree.root);
    const result = evaluator.evaluate();
    console.log(result);
}