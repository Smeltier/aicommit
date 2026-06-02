# aicommit

AI-powered conventional commit message generator. Analyzes your staged changes and suggests a commit message following the [Conventional Commits](https://www.conventionalcommits.org/) spec.

## Installation

```bash
npm install -g @smeltier/aicommit
```

## Setup

Add to your `.zshrc` or `.bashrc`:

```bash
export AICOMMIT_PROVIDER=anthropic   # anthropic | openai | ollama
export AICOMMIT_API_KEY=your-api-key
export AICOMMIT_LANG=en              # language for commit messages
```

## Usage

```bash
git add .
aicommit
```

## Providers

| Provider  | Default model         |
|-----------|-----------------------|
| anthropic | claude-haiku-4-5-20251001      |
| openai    | gpt-4o-mini           |
| ollama    | llama3                |

To override the model:

```bash
export AICOMMIT_MODEL=claude-opus-4-6
```

## License

See the [MIT License](LICENSE)
