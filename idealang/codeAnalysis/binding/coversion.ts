namespace Idealang{
    export class Conversion{
        public static readonly none: Conversion = new Conversion(false, false, false);
        public static readonly identity: Conversion = new Conversion(true, true, true);
        public static readonly implicit: Conversion = new Conversion(true, false, true);
        public static readonly explicit: Conversion = new Conversion(true, false, false);

        private _exists: boolean;
        private _isIdentity: boolean;
        private _isImplicit: boolean;
        private constructor (exists: boolean, isIdentity: boolean, isImplicit: boolean){
            this._exists = exists;
            this._isIdentity = isIdentity;
            this._isImplicit = isImplicit;
        }

        public get exists (){return this._exists;}
        public get isIdentity (){return this._isIdentity;}
        public get isImplicit (){return this._isImplicit;}
        public get isExplicit (){return this._exists && !this._isImplicit;}


        public static classify (from: TypeSymbol, to: TypeSymbol): Conversion{
            if(from === to){
                return Conversion.identity;
            }

            if(from === TypeSymbol.bool || from === TypeSymbol.int){
                if(to === TypeSymbol.string){
                    return Conversion.explicit;
                }
            }

            if(from === TypeSymbol.string){
                if(to === TypeSymbol.bool || to === TypeSymbol.int){
                    return Conversion.explicit;
                }
            }

            return Conversion.none;
        }
    }
}