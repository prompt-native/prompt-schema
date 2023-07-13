# prompt-schema

This is a schema that defines a standard defination of LLM prompts.

# Background

Prompts has become an important part of applications if you want to interact with LLM. When LLM is involved, you'll need to debug prompts, invoke it via API, etc. Thus it become a problem that how you manage and use those prompts.

Prompt Schema provides an abstraction representation of promps,
regardless of the models or vendors.

Also, it provides a way that how prompts could be used in your applications.
By executing the standard defination of a prompt, it's possible that the prompt could be shared, reused, and saved in any language and any platform.

Our goal is to define a stanard format for prompts, and:

- It should be easy to parse and read/update
- It should follow best practices that we use when creating prompts

# Schema (0.1 Draft)

The schema is defined in format of [YAML](https://yaml.org/),
which is easy and also readable.
The limitation here is that yaml does not provide a native way for schema validating (like jsonschema, or XML DTD).

See [v0.1](/schema/v0.1.md) for more details about the schema.

# Libraries

There're libraries to parse and use prompts defined in this format:

- [Rust](https://github.com/prompt-native/prompt-lib-rust)
- [Java](https://github.com/prompt-native/prompt-lib-java)
- [Python](https://github.com/prompt-native/prompt-lib-python)
- [Typescript](https://github.com/prompt-native/prompt-lib-ts)
