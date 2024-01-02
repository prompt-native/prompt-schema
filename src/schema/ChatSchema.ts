export const CHAT_SCHEMA = {
    $schema: "http://json-schema.org/schema",
    type: "object",
    additionalProperties: false,
    properties: {
        $schema: {
            type: "string",
        },
        version: {
            type: "string",
            description: "The schema version",
        },
        engine: {
            type: "string",
            description: "Model engine that is expected to use",
        },
        context: {
            type: "string",
            description:
                "Context instructs how the model should respond. For example, “Explain this code,” specifying words the model can or cannot use, topics to focus on or avoid, or response format. Context applies each time you send a request to the model.",
        },
        examples: {
            type: "array",
            minItems: 1,
            description:
                "Examples help the model understand what an appropriate model response looks like. You can write your own example input and output or use the Test section to save a real response as an example. You can also add a prefix which will be appended to every example (for instance, “question” and “answer”).",
            items: {
                $ref: "#/definitions/message",
            },
        },
        messages: {
            type: "array",
            minItems: 1,
            description: "History messages in the conversation",
            items: {
                $ref: "#/definitions/message",
            },
        },
        functions: {
            type: "array",
            description: "Function definitions",
            items: {
                $ref: "#/definitions/function",
            },
        },
        function_choices: {
            type: "array",
            description: "Functions names that forces the model to call",
            items: {
                type: "string",
            },
        },
        parameters: {
            type: "array",
            items: {
                $ref: "#/definitions/parameter",
            },
            description: "LLM parameters.",
        },
    },
    required: ["version", "engine", "messages"],
    definitions: {
        message: {
            properties: {
                role: {
                    type: "string",
                    enum: ["user", "assistant", "function"],
                    description: "Role of this message",
                },
                name: {
                    type: "string",
                    description: "The name of this participant",
                },
                content: {
                    type: "string",
                    description: "The message content",
                },
                function_calls: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/functionCall",
                    },
                },
            },
            oneOf: [
                {
                    required: ["role", "content"],
                },
                {
                    required: ["role", "function_calls"],
                },
            ],
        },
        function: {
            properties: {
                name: {
                    type: "string",
                    description: "Function name",
                },
                description: {
                    type: "string",
                    description: "Function descriptions",
                },
                parameters: {
                    type: "array",
                    description: "Function parameters",
                    items: {
                        $ref: "#/definitions/functionParameter",
                    },
                },
            },
            required: ["name", "parameters"],
        },
        functionParameter: {
            properties: {
                name: {
                    type: "string",
                    description: "Function name",
                },
                type: {
                    type: "string",
                    description: "Function type",
                },
                required: {
                    type: "boolean",
                    description: "Is function required",
                },
                description: {
                    type: "string",
                    description: "Function descriptions",
                },
                enums: {
                    type: "array",
                    description: "Function parameters",
                    items: {
                        type: "string",
                    },
                },
            },
            required: ["name", "type"],
        },
        functionCall: {
            properties: {
                name: {
                    type: "string",
                    description: "Function name",
                },
                arguments: {
                    type: "string",
                    description: "Function call arguments(serialized in JSON)",
                },
            },
            required: ["name", "arguments"],
        },
        parameter: {
            "additionalProperties ": false,
            "properties": {
                name: {
                    type: "string",
                    pattern: "^[a-z]+(_[a-z]+)*$",
                    description: "Name of parameter",
                },
                value: {
                    type: ["string", "number", "boolean"],
                    description: "Value of this parameter",
                },
            },
            "required": ["name", "value"],
        },
    },
};
