# TypeChat Demo

This is a demo of a coffeeshop automated attendant using [TypeChat](https://microsoft.github.io/TypeChat/docs/introduction/).

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [PNPM](https://pnpm.io/) (v6 or higher)

## Getting Started

Create a file called `.env.local` in the root directory of the project that looks like the following:

```txt
# For OpenAI
OPENAI_MODEL=...
OPENAI_API_KEY=...

# For Azure OpenAI
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
```

and then run the following commands:

```sh
pnpm install
pnpm dev

```
