/// <reference path="./codeAnalysis/syntax/syntaxTree.ts" />
/// <reference path="./codeAnalysis/evaluator.ts" />
/// <reference path="./codeAnalysis/binding/binder.ts" />

const fs = require("fs");


const code = fs.readFileSync("./input.txt").toString();


const syntaxTree = SyntaxTree.parse(code);

const binder = new Binder();

const boundExpression = binder.bindExpression(syntaxTree.root);

const diagnostics = syntaxTree.diagnostics.push(...binder.diagnostics);

//console.log(syntaxTree.root);


if(syntaxTree.diagnostics.length > 0){
    for(let i =0; i < syntaxTree.diagnostics.length; i++){
        console.error(syntaxTree.diagnostics[i]);
    }
}
else{
    const evaluator = new Evaluator(boundExpression);
    const result = evaluator.evaluate();
    console.log(result);
}