# Prompt Schema

This is a schema that defines a standard defination of LLM prompts.

# Background

Prompts has become an important part of applications if you want to interact with LLM. When LLM is involved, you'll need to debug prompts, invoke it via API, etc. Thus it become a problem that how you manage and use those prompts.

Prompt Schema provides an abstraction representation of promps,
regardless of the models or vendors.

Also, it provides a way that how prompts could be used in your applications.
By executing the standard defination of a prompt, it's possible that the prompt could be shared, reused, and saved in any language and any platform.

Our goal is to define a stanard format for prompts, and:

- All necessary information of prompts could be saved easily
- It should be easy to parse and edit
- Provide best practices that we use when creating prompts

# Schema

The schema is defined in [JSON Schema](https://json-schema.org/) format.
Originally YAML was the chosen format for it's readability,
however there's no schema validator for it,
and it's now been replaced by JSON.

For detailed schema, see [completion-0.2](./schema/completion-schema-0.3.json) and [chat-0.2](./schema/chat-schema-0.3.json).

# Validation in Vscode

In vscode, you should able to check your prompt automatically if you set the "$schema" field
to a right location of the schema.

![](/json-examples/vscode.png)

# Libraries (WIP)

There're libraries to parse and use prompts defined in this format:

- [Rust](https://github.com/prompt-native/prompt-lib-rust)
- [Java](https://github.com/prompt-native/prompt-lib-java)
- [Python](https://github.com/prompt-native/prompt-lib-python)
- [Typescript](https://github.com/prompt-native/prompt-lib-ts)
