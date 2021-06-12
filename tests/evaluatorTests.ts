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


Tests.describe("evaluator variable declarion reports redeclarations", (assert) => {
    const text = `
    {
        var x = 10;
        var y = 10;
        {
            var x = 10;
        }
        var [x] = 5;
    }
    `;

    const diagnostics = "Variable 'x' is already declared.";

    assertDiagnostics(assert, text, diagnostics);
});

Tests.describe("evaluator name reports undefined", (assert) => {
    const text = "[x] * 10;";

    const diagnostics = "Variable 'x' doesn't exist.";

    assertDiagnostics(assert, text, diagnostics);
});

Tests.describe("evaluator assignment reports undefined", (assert) => {
    const text = "[x] = 10;";

    const diagnostics = "Variable 'x' doesn't exist.";

    assertDiagnostics(assert, text, diagnostics);
});


Tests.describe("evaluator assignment reports cannot assign", (assert) => {
    const text = `
    {
        let x = 10;
        x [=] 0;
    }
    `;

    const diagnostics = "Variable 'x' is read-only and cannot be assigned to.";

    assertDiagnostics(assert, text, diagnostics);
});

Tests.describe("evaluator assignment reports cannot convert", (assert) => {
    const text = `
    {
        var x = 10;
        x = [true];
    }
    `;

    const diagnostics = "Cannot convert type 'bool' to 'int'.";

    assertDiagnostics(assert, text, diagnostics);
});

Tests.describe("evaluator if statement reports cannot convert", (assert) => {
    const text = `
    {
        if[(1 + 2)]{
            var i = 0;
        }
    }
    `;

    const diagnostics = "Cannot convert type 'int' to 'bool'.";

    assertDiagnostics(assert, text, diagnostics);
});


Tests.describe("evaluator while statement reports cannot convert", (assert) => {
    const text = `
    {
        while[(1 + 2)]{
            var i = 0;
        }
    }
    `;

    const diagnostics = "Cannot convert type 'int' to 'bool'.";

    assertDiagnostics(assert, text, diagnostics);
});



Tests.describe("evaluator for statement lower bound reports cannot convert", (assert) => {
    const text = `
    {   
        var result = 0;
        for i = [false] to 10{
            result = result + i;
        }
    }
    `;

    const diagnostics = "Cannot convert type 'bool' to 'int'.";

    assertDiagnostics(assert, text, diagnostics);
});

Tests.describe("evaluator for statement upper bound reports cannot convert", (assert) => {
    const text = `
    {   
        var result = 0;
        for i = 0 to [true]{
            result = result + i;
        }
    }
    `;

    const diagnostics = "Cannot convert type 'bool' to 'int'.";

    assertDiagnostics(assert, text, diagnostics);
});




Tests.describe("evaluator unary reports undefined", (assert) => {
    const text = "[+]true;";

    const diagnostics = "Unary operator '+' is not defined for type bool.";

    assertDiagnostics(assert, text, diagnostics);
});

Tests.describe("evaluator binary reports undefined", (assert) => {
    const text = "10[*]true;";

    const diagnostics = "Binary operator '*' is not defined for type int and bool.";

    assertDiagnostics(assert, text, diagnostics);
});

function assertDiagnostics (assert: TestDescription, text: string, diagnosticText: string){
    const annonatedText = AnnotatedText.parse(text);
    const syntaxTree = Idealang.SyntaxTree.parse(annonatedText.text);
    const compilation = new Idealang.Compilation(syntaxTree);
    const result = compilation.evaluate(new Map<Idealang.VariableSymbol, Idealang.all>());

    const expectedDiagnostics = AnnotatedText.unindentLines(diagnosticText);

    if(annonatedText.spans.length !== expectedDiagnostics.length){
        throw new Error("ERROR: Must mark as many spans as there are expected diagnostics.");
    }

    assert.equal(expectedDiagnostics.length, result.diagnostics.length);

    for (let i = 0; i < expectedDiagnostics.length; i++) {
        const expectedMessage = expectedDiagnostics[i];
        const actualMessage = result.diagnostics[i].message;
        assert.equal(expectedMessage, actualMessage);

        const expectedSpan = annonatedText.spans[i];
        const actualSpan = result.diagnostics[i].span;
        assert.equal(expectedSpan.toString(), actualSpan.toString());
    }
}

const data = [
    ["1;", 1],
    ["+1;", 1],
    ["-1;", -1],
    ["14 + 12;", 26],
    ["12 - 3;", 9],
    ["1 * 2;", 2],
    ["9 / 3;", 3],
    ["(10);", 10],
    ["true;", true],
    ["false;", false],
    ["!true;", false],
    ["!false;", true],
    ["12 == 3;", false],
    ["4 == 4;", true],
    ["211 == 12*12 +67;", true],
    ["12 !=  3;", true],
    ["5 != 5;", false],
    ["true != false;", true],
    ["true != true;", false],
    ["true == false;", false],

    ["3 < 4;", true],
    ["5 < 4;", false],
    ["4 < 4;", false],
    ["3 <= 4;", true],
    ["5 <= 4;", false],
    ["4 <= 4;", true],

    ["3 > 4;", false],
    ["5 > 4;", true],
    ["4 > 4;", false],
    ["3 >= 4;", false],
    ["5 >= 4;", true],
    ["4 >= 4;", true],

    ["{var a = 0;(a = 10) * a;}", 100],
    ["{var a = 0;if(a == 0){a = 10;}a;}", 10],
    ["{var a = 0;if(a == 4){a = 10;}a;}", 0],

    ["{var a = 0;if(a == 0){a = 10;}else{a = 5;}a;}", 10],
    ["{var a = 0;if(a == 4){a = 10;}else{a = 5;}a;}", 5],

    ["{var i = 10; var result = 0; while(i > 0){result = result + i; i = i - 1;}result;}", 55],
    ["{var result = 0; for i = 0 to 10{result = result + i;}}", 55],
];