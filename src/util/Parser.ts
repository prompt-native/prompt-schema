import { ChatPrompt, CompletionPrompt } from "../types/Prompt";
import { validateChatSchema, validateCompletionSchema } from "./Validator";

export function parsePrompt(text: string): CompletionPrompt | ChatPrompt {
    try {
        const data = JSON.parse(text);
        const version = data.version as string;
        if (!version) throw new Error("Unable to get type of data");
        if (version.startsWith("chat@")) {
            validateChatSchema(data);
            return ChatPrompt.from(data);
        } else if (version.startsWith("completion@")) {
            validateCompletionSchema(data);
            return CompletionPrompt.from(data);
        } else throw new Error(`Unsupported type:${version} detected`);
    } catch (err) {
        throw new Error("Failed to parse json");
    }
}
