namespace Idealang{
    export class TextBuilder {
        private _text: string[] = [""];
        private _colorText: string[] = [ConsoleColor.default];
        private _color: ConsoleColor = ConsoleColor.default;
        public constructor () {}

        public write<T> (text: string | T = ""){
            this._text[this._text.length - 1] += text;
        }

        public writeLine<T> (line: string | T = ""){
            const lastIndex = this._text.length - 1;
            if(this._text[lastIndex] === ""){
                this._text[lastIndex] += line;
                return;
            }
            this._text[lastIndex] += "\n" + line;
        }

        public add (builder: TextBuilder){
            this._text.push(...builder._text);
            this._colorText.push(...builder._colorText);
        }


        public get color (): ConsoleColor{
            return this._color;
        }

        public set color (color: ConsoleColor){
            this._color = color;
            this._colorText.push(color);
            this._text.push("");
        }

        public toString (){
            return this._text.join("");
        }

        public toColoredString (){
            const result = [];
            const length = Math.min(this._colorText.length, this._text.length);

            for (let i = 0; i < length; i++) {
                result.push(this._colorText[i], this._text[i]);
            }
            result.push(...this._colorText.slice(length), ...this._text.slice(length));
            return result.join("") + ConsoleColor.default;
        }
    }
}