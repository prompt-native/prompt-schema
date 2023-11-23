import { ChatPrompt, CompletionPrompt } from "../types/Prompt";
import { parsePrompt } from "./Parser";

describe("parse prompts that is not a json file", () => {
    test("should throw error if is empty", () => {
        expect(() => parsePrompt("")).toThrow();
    });

    test("should throw error if is not json", () => {
        expect(() => parsePrompt("abc")).toThrow();
        expect(() => parsePrompt("[[[")).toThrow();
    });

    test("should throw error if json is invalid", () => {
        expect(() => parsePrompt("{abc}")).toThrow();
    });
});

describe("parse prompts that it not valid", () => {
    test("should throw error if type is empty", () => {
        expect(() => parsePrompt("{}")).toThrow();
    });

    test("should throw error if type is not supported", () => {
        expect(() => parsePrompt('{"type":"something"}')).toThrow();
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
