/// <reference path="./main.ts" />

Tests.describe("evaluation tests", (assert: TestDescription) => {
    for (let i = 0; i < data.length; i++) {
        const text = data[i][0] as string;
        const expectedResult = data[i][1] as number;

        const syntaxTree = Idealang.SyntaxTree.parse(text);
        const compilation = new Idealang.Compilation(syntaxTree);
        const variables: Map<Idealang.VariableSymbol, Idealang.all> = new Map();
        const result = compilation.evaluate(variables);

        assert.empty(result.diagnostics);
        assert.equal(expectedResult, result.value);

    }
});

const data = [
    ["1", 1],
    ["+1", 1],
    ["-1", -1],
    ["14 + 12", 26],
    ["12 - 3", 9],
    ["1 * 2", 2],
    ["9 / 3", 3],
    ["(10)", 10],
    ["true", true],
    ["false", false],
    ["!true", false],
    ["!false", true],
    ["12 == 3", false],
    ["4 == 4", true],
    ["211 == 12*12 +67", true],
    ["12 !=  3", true],
    ["5 != 5", false],
    ["true != false", true],
    ["true != true", false],
    ["true == false", false],

    ["(a = 10) * a", 100],
];