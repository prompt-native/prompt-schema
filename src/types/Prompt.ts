export class Parameter {
    constructor(public name: string, public value: string | number | boolean) {}
}

export class FunctionCall {
    public name: string;
    public arguments: string;
    constructor(name: string, args: string) {
        this.name = name;
        this.arguments = args;
    }

    static from(parsedData: any): FunctionCall {
        parsedData.arguments && JSON.parse(parsedData.arguments);
        return new FunctionCall(parsedData.name, parsedData.arguments);
    }
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

/**
 * see: https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models
 *      https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#functioncall-deprecated
 */
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
        public function_calls?: FunctionCall[]
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
    function_choices?: string[];

    constructor(
        version: string,
        engine: string,
        messages: Message[],
        parameters?: Parameter[],
        context?: string,
        examples?: Message[],
        functions?: Function[],
        function_choices?: string[]
    ) {
        super(version, engine, parameters);
        this.messages = messages;
        this.context = context;
        this.examples = examples;
        this.functions = functions;
        this.function_choices = function_choices;
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
                  (e: any) =>
                      new Message(
                          e.role,
                          e.name,
                          e.content,
                          e.function_calls &&
                              e.function_calls.map((call: any) => FunctionCall.from(call))
                      )
              )
            : undefined;
        const messages = parsedData.messages.map(
            (m: any) =>
                new Message(
                    m.role,
                    m.name,
                    m.content,
                    m.function_calls && m.function_calls.map((call: any) => FunctionCall.from(call))
                )
        );
        const functions = parsedData.functions
            ? parsedData.functions.map(
                  (f: any) => new Function(f.name, f.description, f.parameters)
              )
            : undefined;
        const function_choices = parsedData.function_choices;
        return new ChatPrompt(
            version,
            engine,
            messages,
            parameters,
            context,
            examples,
            functions,
            function_choices
        );
    }
}
