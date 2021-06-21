///<reference path="./consoleColor.ts" />
namespace Idealang{
    export class Console {
        public static color: ConsoleColor = ConsoleColor.default;
        public static log <T> (text: string | TextBuilder | T = ""): void{
            if(text instanceof TextBuilder){
                console.log(text.toColoredString());
            }
            else{
                console.log(this.color + text + ConsoleColor.default);
            }
        }

        public static warn (text: string): void{
            console.log(`${ConsoleColor.FgYellow}%s${ConsoleColor.default}`, text);
        }

        public static error (text: string): void{
            console.log(`${ConsoleColor.FgRed}%s${ConsoleColor.default}`, text);
        }

        public static clear (): void{
            console.clear();
        }

        public static resetColor (): void{
            this.color = ConsoleColor.default;
        }

    }
}