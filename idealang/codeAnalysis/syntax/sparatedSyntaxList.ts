namespace Idealang{
    export class SeparatedSyntaxList {
        private _nodesAndSeparators: SyntaxNode[];
        constructor (nodesAndSeparators: SyntaxNode[]) {
            this._nodesAndSeparators = nodesAndSeparators;
        }

        public get count () {return Math.floor((this._nodesAndSeparators.length + 1) / 2);}
        public get (index: number){return this._nodesAndSeparators[index * 2];}
        public getSeperator (index: number){
            if(index === this.count - 1){
                return null;
            }
            return this._nodesAndSeparators[index * 2 + 1];
        }
    }

}