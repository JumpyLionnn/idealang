class Tests {
    private static tests: Test[] = [];
    private static duration: number;

    public static describe (name: string, test: (assert: TestDescription) => void){
        this.tests.push({
            "description": new TestDescription(name),
            "executor": test
        });
    }

    public static execute (){
        const startTime = Date.now();

        for(let i = 0; i <  this.tests.length; i++){
            const test = this.tests[i];
            test.executor(test.description);
        }

        this.duration = (Date.now() - startTime) / 1000;
    }

    public static showResults (){
        let testsNumber = 0;
        let testsPassed = 0;
        let testsFailed = 0;
        let errors = "";
        for(let i = 0; i <  this.tests.length; i++){
            const test = this.tests[i].description;
            testsNumber += test.tests;
            testsPassed += test.passed;
            testsFailed += test.failed;
            for(let j = 0; j < test.faliedMessages.length; j++){
                errors += test.faliedMessages[j] + "\n";
            }
        }

        console.error("%c" + errors, "color:red;");

        console.log(`Total tests: ${testsNumber} Passed: ${testsPassed} Failed: ${testsFailed}`);
        if(testsFailed > 0){
            console.error("%cTest Run Failed", "color:red;");
        }
        else{
            console.error("%cTest Run Successful", "color:green;");
        }
        console.log(`Test execution time: ${this.duration}s`);
    }
}

interface Test{
    description: TestDescription,
    executor: (assert: TestDescription) => void
}


class TestDescription {
    private _name: string;
    private _tests: number = 0;
    private _passed: number = 0;
    private _failed: number = 0;
    private _faliedMessages: string[] = [];
    constructor (name: string){
        this._name = name;
    }

    public equal<T> (expectedData: T, actualData: T){
        this._tests++;
        if(actualData === expectedData){
            this._passed++;
        }
        else{
            this._failed++;
            this._faliedMessages.push(`Failed  ${this._name}
Expected: ${expectedData}
Actual: ${actualData}`);
        }
    }


    public get name (){
        return this._name;
    }

    public get tests (){
        return this._tests;
    }

    public get passed (){
        return this._passed;
    }

    public get failed (){
        return this._failed;
    }

    public get faliedMessages (){
        return this._faliedMessages;
    }
}

setTimeout(() => {
    Tests.execute();
    Tests.showResults();
}, 10);
