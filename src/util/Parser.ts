import { ChatPrompt, CompletionPrompt } from "../types/Prompt";
import { validateChatSchema, validateCompletionSchema } from "./Validator";

export function parsePrompt(text: string): CompletionPrompt | ChatPrompt {
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error(err);
        throw new Error("Failed to parse json");
    }
    const version = data.version as string;
    if (!version) throw new Error("Unable to get type of data");
    if (version.startsWith("chat@")) {
        const err = validateChatSchema(data);
        if (err) throw new Error(`Json validate failed:${err}`);
        return ChatPrompt.from(data);
    } else if (version.startsWith("completion@")) {
        const err = validateCompletionSchema(data);
        if (err) throw new Error(`Json validate failed:${err}`);
        return CompletionPrompt.from(data);
    } else throw new Error(`Unsupported type:${version} detected`);
}
