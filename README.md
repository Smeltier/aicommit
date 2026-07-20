# aicommit

AI-powered commit message generator following the [Conventional Commits](https://www.conventionalcommits.org/) spec. Analyzes your staged git diff and suggests a ready-to-use commit message, which you confirm before committing.

Supports **Anthropic**, **OpenAI**, and **Ollama** (runs locally, no API key needed).

## Why use it

There are similar tools out there (`opencommit`, `aicommits`), but `aicommit` focuses on:

- Native support for 3 providers, including Ollama for anyone who doesn't want to depend on a paid API.
- Commit messages generated in whatever language you configure.
- Interactive confirmation before committing (the AI suggests, you decide).

## Installation

```bash
npm install -g @smeltier/aicommit
```

## Setup

### 1. Choose a provider and configure it

**Anthropic or OpenAI** (equires an API key):

```bash
export AICOMMIT_PROVIDER=anthropic   # or openai
export AICOMMIT_API_KEY=your-api-key
```

**Ollama** (runs locally, no API key needed):

```bash
export AICOMMIT_PROVIDER=ollama
```

Make sure you have [Ollama](https://ollama.com) installed and running (`ollama serve`), with the model pulled (`ollama pull llama3`).

### 2. (Optional) Commit message language

```bash
export AICOMMIT_LANG=en   # default: en
```

### 3. Persist the variables

Add the lines above to your `.zshrc` or `.bashrc` so you don't have to set them every time:

```bash
echo 'export AICOMMIT_PROVIDER=anthropic' >> ~/.zshrc
echo 'export AICOMMIT_API_KEY=your-api-key' >> ~/.zshrc
```

Then reload your shell (`source ~/.zshrc`) or open a new terminal.

## Usage

```bash
git add .
aicommit
```

`aicommit` shows the suggested message and asks for confirmation before committing:

```
Commit message: feat(auth): add token refresh logic

Confirm? (Y/n)
```

## Providers and default models

| Provider  | Default model                | Requires API key |
|-----------|-------------------------------|-------------------|
| anthropic | `claude-haiku-4-5-20251001`   | Yes               |
| openai    | `gpt-4o-mini`                  | Yes               |
| ollama    | `llama3`                       | No                |

To use a different model:

```bash
export AICOMMIT_MODEL=claude-opus-4-6
```

## License

[MIT](./LICENSE)
