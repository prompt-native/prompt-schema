export class Parameter {
    constructor(public name: string, public value: string | number | boolean) {}
}

export class FunctionCall {
    constructor(public name: string, public functionArguments: any) {}
}

export class FunctionParameter {
    constructor(
        public name: string,
        public type: string,
        public required?: boolean,
        public description?: string,
        public enums?: string[]
    ) {}
}

export class Function {
    constructor(
        public name: string,
        public description?: string,
        public parameters?: FunctionParameter[]
    ) {}
}

export class Message {
    constructor(
        public role: string,
        public name?: string,
        public content?: string,
        public functionCall?: FunctionCall
    ) {}
}

export class Prompt {
    constructor(public version: string, public engine: string, public parameters?: Parameter[]) {}
}

export class CompletionPrompt extends Prompt {
    prompt: string;
    constructor(version: string, engine: string, prompt: string, parameters?: Parameter[]) {
        super(version, engine, parameters);
        this.prompt = prompt;
    }

    static from(parsedData: any): CompletionPrompt {
        const version = parsedData.version;
        const engine = parsedData.engine;
        const prompt = parsedData.prompt;
        const parameters = parsedData.parameters
            ? parsedData.parameters.map((p: any) => new Parameter(p.name, p.value))
            : undefined;

        return new CompletionPrompt(version, engine, prompt, parameters);
    }
}

export class ChatPrompt extends Prompt {
    context?: string;
    examples?: Message[];
    messages: Message[];
    functions?: Function[];

    constructor(
        version: string,
        engine: string,
        messages: Message[],
        parameters?: Parameter[],
        context?: string,
        examples?: Message[],
        functions?: Function[]
    ) {
        super(version, engine, parameters);
        this.messages = messages;
        this.context = context;
        this.examples = examples;
        this.functions = functions;
    }

    static from(parsedData: any): ChatPrompt {
        const version = parsedData.version;
        const engine = parsedData.engine;
        const parameters = parsedData.parameters
            ? parsedData.parameters.map((p: any) => new Parameter(p.name, p.value))
            : undefined;
        const context = parsedData.context;
        const examples = parsedData.examples
            ? parsedData.examples.map(
                  (e: any) => new Message(e.role, e.name, e.content, e.functionCall)
              )
            : undefined;
        const messages = parsedData.messages.map(
            (m: any) => new Message(m.role, m.name, m.content, m.functionCall)
        );
        const functions = parsedData.functions
            ? parsedData.functions.map(
                  (f: any) => new Function(f.name, f.description, f.parameters)
              )
            : undefined;

        return new ChatPrompt(version, engine, messages, parameters, context, examples, functions);
    }
}
