Tests.describe("source text test", (assert) => {
    for (let i = 0; i < sourceTextTestData.length; i++) {
        const text = sourceTextTestData[i][0] as string;
        const exprectedLineCount = sourceTextTestData[i][1] as number;

        const sourceText = Idealang.SourceText.from(text);
        assert.equal(exprectedLineCount, sourceText.lines.length);

    }
});


const sourceTextTestData = [
    [".", 1],
    [".\r\n", 2],
    [".\r\n\r\n", 3],
];