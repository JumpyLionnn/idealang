abstract class Repl {
    public run (){
        while (true) {
            const text = this.editSubmission();
            if(text === null){
                return;
            }
            this.evaluateSubmission(text);
        }
    }

    private editSubmission (): string | null{
        let text = "";
        while (true) {
            let prefix: string;
            if(text.length === 0){
                prefix = ">> ";
            }
            else{
                prefix = ".. ";
            }
            const line = readlineSync.question(prefix) as string;
            text += line;

            const isBlank = line.trim() === "";
            if(text.split("\n").length === 1){
                if(isBlank){
                    return null;
                }
                else if(line.startsWith("#")){
                    this.evaluateMetaCommand(line);
                    continue;
                }
            }

            if(!this.isCompleteSubmission(text)){
                text += "\n";
                continue;
            }

            return text;
        }
    }


    protected abstract evaluateSubmission (text: string): void;

    protected isCompleteSubmission (text: string): boolean{
        if(text.trim().length === 0){
            return false;
        }
        return true;
    }

    protected abstract evaluateMetaCommand (input: string): void;
}