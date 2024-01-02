import { ChatPrompt, CompletionPrompt } from "../types/Prompt";
import { parsePrompt } from "./Parser";

describe("parse prompts that is not a json file", () => {
    test("should throw error if is empty", () => {
        expect(() => parsePrompt("")).toThrow("Failed to parse json");
    });

    test("should throw error if is not json", () => {
        expect(() => parsePrompt("abc")).toThrow("Failed to parse json");
        expect(() => parsePrompt("[[[")).toThrow("Failed to parse json");
    });

    test("should throw error if json is invalid", () => {
        expect(() => parsePrompt("{abc}")).toThrow("Failed to parse json");
    });
});

describe("parse prompts that it not valid", () => {
    test("should throw error if type is empty", () => {
        expect(() => parsePrompt("{}")).toThrow("Unable to get type of data");
    });

    test("should throw error if type is not supported", () => {
        expect(() => parsePrompt('{"version":"something"}')).toThrow(
            "Unsupported type:something detected"
        );
    });

    test("should throw error if json validation failed", () => {
        expect(() => parsePrompt('{"version":"chat@0.1"}')).toThrow("Json validate failed");
    });
});

describe("parse prompts that it valid", () => {
    test("should return chat prompt if it's chat", () => {
        const prompt = parsePrompt(`{
            "$schema": "../schema/chat-schema.json",
            "version": "chat@0.2",
            "engine": "chat-bison",
            "messages": [
                {
                    "role": "user",
                    "content": "Write a hello world in js"
                }
            ],
            "parameters": [
                {
                    "name": "temperature",
                    "value": 0.1
                }
            ]
        }`);
        expect(prompt).not.toBe(null);
        expect(prompt).toBeInstanceOf(ChatPrompt);
        expect(prompt.version).toBe("chat@0.2");
        expect(prompt.engine).toBe("chat-bison");
    });

    test("should return chat prompt if it's completion", () => {
        const prompt = parsePrompt(`{
            "$schema": "../schema/completion-schema-0.3.json",
            "version": "completion@0.2",
            "engine": "text-bison",
            "prompt": "I'm hungry and I want to",
            "parameters": [
                {
                    "name": "temperature",
                    "value": 0.1
                }
            ]
        }`);
        expect(prompt).not.toBe(null);
        expect(prompt).toBeInstanceOf(CompletionPrompt);
        expect(prompt.version).toBe("completion@0.2");
        expect(prompt.engine).toBe("text-bison");
    });
});

describe("parse prompts that has complex structure", () => {
    test("should return chat prompt if it has function", () => {
        const prompt = parsePrompt(
            `{"$schema":"../schema/chat-schema.json","version":"chat@0.3","engine":"gpt-3.5-turbo","messages":[{"role":"user","content":"What is the weather today in Beijing?"},{"role":"assistant","function_call":{"name":"get_weather","arguments":"{\\n\\"city\\": \\"Beijing\\",\\n\\"time\\": \\"today\\"\\n}"}},{"role":"function","name":"get_weather","content":"{\\"weather\\": \\"sunny, 25C\\"}"}],"functions":[{"name":"get_weather","description":"Get the weather today","parameters":[{"name":"city","type":"string","enums":["Wuhan","Beijing"],"description":"City name","required":true}]}],"parameters":[{"name":"temperature","value":0.1}]}`
        );

        expect(prompt).not.toBe(null);
        expect(prompt).toBeInstanceOf(ChatPrompt);
        expect(prompt.version).toBe("chat@0.3");
        expect(prompt.engine).toBe("gpt-3.5-turbo");
        const chatPrompt = prompt as ChatPrompt;
        expect(chatPrompt.functions).not.toBe(null);
        expect(chatPrompt.functions).toHaveLength(1);
        expect(chatPrompt.functions![0].name).toBe("get_weather");
        expect(chatPrompt.functions![0].parameters).toHaveLength(1);
        expect(chatPrompt.functions![0].parameters![0].name).toBe("city");
        expect(chatPrompt.functions![0].parameters![0].enums).toStrictEqual(["Wuhan", "Beijing"]);
        expect(chatPrompt.messages).toHaveLength(3);
        expect(chatPrompt.messages[0].role).toBe("user");
        expect(chatPrompt.messages[0].name).toBeUndefined();
        expect(chatPrompt.messages[0].content).toBe("What is the weather today in Beijing?");
        expect(chatPrompt.messages[0].functionCall).toBeUndefined();
        expect(chatPrompt.messages[1].role).toBe("assistant");
        expect(chatPrompt.messages[1].name).toBeUndefined();
        expect(chatPrompt.messages[1].content).toBeUndefined();
        expect(chatPrompt.messages[1].functionCall!.name).toBe("get_weather");
        expect(chatPrompt.messages[1].functionCall!.functionArguments).toStrictEqual({
            city: "Beijing",
            time: "today",
        });
        expect(chatPrompt.messages[2].role).toBe("function");
        expect(chatPrompt.messages[2].name).toBe("get_weather");
        expect(chatPrompt.messages[2].content).toBe('{"weather": "sunny, 25C"}');
        expect(chatPrompt.messages[2].functionCall).toBeUndefined();
    });
});
