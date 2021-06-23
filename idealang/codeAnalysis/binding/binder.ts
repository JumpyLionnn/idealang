///<reference path="../types.ts"/>
/// <reference path="boundLiteralExpression.ts"/>
/// <reference path="boundBinaryOperator.ts"/>
/// <reference path="boundBinaryExpression.ts"/>
/// <reference path="boundUnaryOperator.ts"/>

namespace Idealang{
    export class Binder {
        private readonly _diagnostics: DiagnosticBag = new DiagnosticBag();

        private _scope: BoundScope;

        constructor (parent: BoundScope | null){
            this._scope = new BoundScope(parent);
        }

        public get diagnostics (): DiagnosticBag{return this._diagnostics;}

        public static bindGlobalScope (previous: BoundGlobalScope | null, syntax: CompilationUnitSyntax){
            const parentScope = this.createParentScope(previous);
            const binder = new Binder(parentScope);
            const expression = binder.bindStatement(syntax.statement);
            const variables = binder._scope.getDeclaredVariables();
            const diagnostics = binder.diagnostics.toArray();
            if(previous !== null){
                diagnostics.push(...previous.diagnostics);
            }

            return new BoundGlobalScope(previous, diagnostics, variables, expression);
        }

        public static createParentScope (previous: BoundGlobalScope | null){
            const stack: BoundGlobalScope[] = [];
            previous = previous;
            while(previous !== null){
                stack.push(previous);
                previous = previous.previous;
            }
            stack.reverse();

            let parent: BoundScope | null = this.createRootScope();
            while(stack.length > 0){
                previous = stack.pop() as BoundGlobalScope;
                const scope: BoundScope = new BoundScope(parent);
                for (let i = 0; i < previous.variables.length; i++) {
                    const variable = previous.variables[i];
                    scope.tryDeclareVariable(variable);
                }
                parent = scope;
            }
            return parent;
        }

        private static createRootScope (): BoundScope | null {
            const result = new BoundScope(null);
            for (let i = 0; i < BuiltinFunctions.getAll().length; i++) {
                const func = BuiltinFunctions.getAll()[i];
                result.tryDeclareFunction(func);
            }
            return result;
        }

        private bindStatement (syntax: StatementSyntax): BoundStatement{
            switch (syntax.kind) {
                case SyntaxKind.BlockStatement:
                    return this.bindBlockStatement(syntax as BlockStatementSyntax);
                case SyntaxKind.VariableDeclaration:
                    return this.bindVariableDeclaration(syntax as VariableDeclarationSyntax);
                case SyntaxKind.IfStatement:
                    return this.bindIfStatement(syntax as IfStatementSyntax);
                case SyntaxKind.WhileStatement:
                    return this.bindWhileStatement(syntax as WhileStatementSyntax);
                case SyntaxKind.ForStatement:
                    return this.bindForStatement(syntax as ForStatementSyntax);
                case SyntaxKind.ExpressionStatement:
                    return this.bindExpressionStatement(syntax as ExpressionStatementSyntax);
                default:
                    throw new Error(`Unexpected statement ${syntax.kind}`);
            }
        }

        private bindBlockStatement (syntax: BlockStatementSyntax): BoundBlockStatement{
            const statements: BoundStatement[] = [];

            this._scope = new BoundScope(this._scope);
            for (let i = 0; i < syntax.statements.length; i++) {
                const statement = this.bindStatement(syntax.statements[i]);
                statements.push(statement);
            }
            this._scope = this._scope.parent as BoundScope;

            return new BoundBlockStatement(statements);
        }

        private bindVariableDeclaration (syntax: VariableDeclarationSyntax): BoundVariableDeclaration{
            const name = syntax.identifier.text === "" ? "?" : syntax.identifier.text;
            const declare = !(syntax.identifier.text === "");
            const isReadOnly = syntax.keyword.kind === SyntaxKind.LetKeyword;
            const initializer = this.bindExpression(syntax.initializer);
            const variable = new VariableSymbol(name, isReadOnly, initializer.type);

            if(declare && !this._scope.tryDeclareVariable(variable)){
                this.diagnostics.reportVariableAlreadyDeclared(syntax.identifier.span, name);
            }
            return new BoundVariableDeclaration(variable, initializer);
        }

        private bindIfStatement (syntax: IfStatementSyntax): BoundIfStatement{
            const condition = this.bindParenthesizedExpression(syntax.condition);
            const thenStatement = this.bindStatement(syntax.thenStatement);

            if(condition.type !== TypeSymbol.bool){
                this._diagnostics.reportCannotConvert(syntax.condition.span, condition.type, TypeSymbol.bool);
            }
            const elseStatement = syntax.elseClause !== null ? this.bindStatement(syntax.elseClause.elseStatement) : null;
            return new BoundIfStatement(condition, thenStatement, elseStatement);
        }

        private bindWhileStatement (syntax: WhileStatementSyntax): BoundWhileStatement{
            const condition = this.bindParenthesizedExpression(syntax.condition);
            const body = this.bindStatement(syntax.body);

            if(condition.type !== TypeSymbol.bool){
                this._diagnostics.reportCannotConvert(syntax.condition.span, condition.type, TypeSymbol.bool);
            }
            return new BoundWhileStatement(condition, body);
        }

        private bindForStatement (syntax: ForStatementSyntax): BoundForStatement{
            const lowerBound = this.bindTargetExpression(syntax.lowerBound, TypeSymbol.int);
            const upperBound = this.bindTargetExpression(syntax.upperBound, TypeSymbol.int);

            this._scope = new BoundScope(this._scope);
            const name = syntax.identifier.text;
            const variable = new VariableSymbol(name, true, TypeSymbol.int);
            if(!this._scope.tryDeclareVariable(variable)){
                this.diagnostics.reportVariableAlreadyDeclared(syntax.identifier.span, name);
            }
            const body = this.bindStatement(syntax.body);
            this._scope = this._scope.parent as BoundScope;

            return new BoundForStatement(variable, lowerBound, upperBound, body);
        }

        private bindExpressionStatement (syntax: ExpressionStatementSyntax): BoundStatement{
            const expression = this.bindExpression(syntax.expression, true);
            return new BoundExpressionStatement(expression);
        }

        private bindTargetExpression (syntax: ExpressionSyntax, targetType: TypeSymbol): BoundExpression{
            const result = this.bindExpression(syntax);
            if(targetType !== TypeSymbol.error &&
                result.type !== TypeSymbol.error &&
                result.type !== targetType){
                this._diagnostics.reportCannotConvert(syntax.span, result.type, targetType);
            }
            return result;
        }

        private bindExpression (syntax: ExpressionSyntax, canBeVoid: boolean = false): BoundExpression{
            const result = this.bindExpressionInternal(syntax);
            if(!canBeVoid && result.type === TypeSymbol.void){
                this._diagnostics.reportExpressionMustHaveValue(syntax.span);
                return new BoundErrorExpression();
            }
            return result;
        }

        private bindExpressionInternal (syntax: ExpressionSyntax): BoundExpression{
            switch (syntax.kind) {
                case SyntaxKind.ParenthesizedExpression:
                    return this.bindParenthesizedExpression(syntax as ParenthesizedExpressionSyntax);
                case SyntaxKind.LiteralExpression:
                    return this.bindLiteralExpression(syntax as LiteralExpressionSyntax);
                case SyntaxKind.NameExpression:
                    return this.bindNameExpression(syntax as NameExpressionSyntax);
                case SyntaxKind.AssignmentExpression:
                    return this.bindAssignmentExpression(syntax as AssignmentExpressionSyntax);
                case SyntaxKind.UnaryExpression:
                    return this.bindUnaryExpression(syntax as UnaryExpressionSyntax);
                case SyntaxKind.BinaryExpression:
                    return this.bindBinaryExpression(syntax as BinaryExpressionSyntax);
                case SyntaxKind.CallExpression:
                    return this.bindCallExpression(syntax as CallExpressionSyntax);
                default:
                    throw new Error(`Unexpected syntax ${syntax.kind}`);
            }
        }

        private bindParenthesizedExpression (syntax: ParenthesizedExpressionSyntax): BoundExpression{
            return this.bindExpression(syntax.expression);
        }

        private bindLiteralExpression (syntax: LiteralExpressionSyntax): BoundExpression{
            let value: all;
            if(syntax.value !== undefined){
                value = syntax.value;
            }
            else{
                value = 0;
            }
            return new BoundLiteralExpression(value);
        }

        private bindNameExpression (syntax: NameExpressionSyntax): BoundExpression{
            const name = syntax.identifierToken.text;
            if(name === "" || name === null){
                return new BoundErrorExpression();
            }
            const variable = this._scope.tryLookupVariable(name);
            if(variable === null){
                this._diagnostics.reportUndefinedName(syntax.identifierToken.span, name);
                return new BoundErrorExpression();
            }
            return new BoundVariableExpression(variable);
        }

        private bindAssignmentExpression (syntax: AssignmentExpressionSyntax): BoundExpression{
            const name = syntax.identifierToken.text;
            const boundExpression = this.bindExpression(syntax.expression);
            const variable = this._scope.tryLookupVariable(name);

            if(this._scope.tryLookupVariable(name) === null){
                this._diagnostics.reportUndefinedName(syntax.identifierToken.span, name);
                return boundExpression;
            }

            if((variable as VariableSymbol).isReadOnly){
                this._diagnostics.reportCannotAssign(syntax.equalsToken.span, name);
            }

            if(boundExpression.type !== (variable as VariableSymbol).type){
                this._diagnostics.reportCannotConvert(syntax.expression.span, boundExpression.type, (variable as VariableSymbol).type);
                return boundExpression;
            }
            return new BoundAssignmentExpression(variable as VariableSymbol, boundExpression);
        }

        private bindUnaryExpression (syntax: UnaryExpressionSyntax): BoundExpression{
            const boundOperand = this.bindExpression(syntax.operand);
            if(boundOperand.type === TypeSymbol.error){
                return new BoundErrorExpression();
            }
            const boundOperator = BoundUnaryOperator.bind(syntax.operatorToken.kind, boundOperand.type);
            if(boundOperator === null){
                this._diagnostics.reportUndefinedUnaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundOperand.type);
                return new BoundErrorExpression();
            }
            return new BoundUnaryExpression(boundOperator, boundOperand);
        }

        private bindBinaryExpression (syntax: BinaryExpressionSyntax): BoundExpression{
            const boundLeft = this.bindExpression(syntax.left);
            const boundRight = this.bindExpression(syntax.right);

            if (boundLeft.type === TypeSymbol.error || boundRight.type === TypeSymbol.error){
                return new BoundErrorExpression();
            }

            const boundOperator = BoundBinaryOperator.bind(syntax.operatorToken.kind, boundLeft.type, boundRight.type);

            if(boundOperator === null){
                this._diagnostics.reportUndefinedBinaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundLeft.type, boundRight.type);
                return new BoundErrorExpression();
            }

            return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
        }

        private bindCallExpression (syntax: CallExpressionSyntax): BoundExpression{
            const type = this.lookupType(syntax.identifier.text);
            if(syntax.callArguments.count === 1 && type instanceof TypeSymbol){
                return this.bindConversion(type, syntax.callArguments.get(0));
            }
            const boundArguments: BoundExpression[] = [];
            for (let i = 0; i < syntax.callArguments.count; i++) {
                const argument = this.bindExpression(syntax.callArguments.get(i));
                boundArguments.push(argument);
            }
            const func = this._scope.tryLookupFunction(syntax.identifier.text);
            if(func === null){
                this._diagnostics.reportUndefinedFunction(syntax.identifier.span, syntax.identifier.text);
                return new BoundErrorExpression();
            }

            if (syntax.callArguments.count !== func.parameters.length){
                this._diagnostics.reportWrongArgumentCount(syntax.span, func.name, func.parameters.length, syntax.callArguments.count);
                return new BoundErrorExpression();
            }

            for (let i = 0; i < syntax.callArguments.count; i++) {
                const parameter = func.parameters[i];
                const argument = boundArguments[i];
                if(argument.type !== parameter.type){
                    this._diagnostics.reportWrongArgumentType(syntax.span, parameter.name, parameter.type, argument.type);
                    return new BoundErrorExpression();
                }
            }
            return new BoundCallExpression(func, boundArguments);
        }

        private bindConversion (type: TypeSymbol, syntax: ExpressionSyntax){
            const expression = this.bindExpression(syntax);
            const conversion = Conversion.classify(expression.type, type);
            if(!conversion.exists){
                this._diagnostics.reportCannotConvert(syntax.span, expression.type, type);
                return new BoundErrorExpression();
            }
            return new BoundConversionExpression(type, expression);
        }

        private lookupType (name: string){
            switch (name) {
                case "bool":
                    return TypeSymbol.bool;
                case "int":
                    return TypeSymbol.int;
                case "string":
                    return TypeSymbol.string;
                default:
                    return null;
            }
        }
    }
}