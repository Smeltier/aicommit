import { Config } from "../config";

export async function generate(diff: string, config: Config): Promise<string> {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: config.model,
            prompt: buildPrompt(diff, config.lang),
            stream: false,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ollama API error: ${error}`);
    }

    const data = await response.json() as { response: string };
    return data.response.trim();
}

function buildPrompt(diff: string, lang: string): string {
    return `Generate a conventional commit message for the following git diff.

            Rules:
                - Format: <type>(<optional scope>): <short description>
                - Types: feat, fix, docs, style, refactor, test, chore
                - Description must be in ${lang}
                - Max 72 characters
                - No emoji
                - No period at the end
                - Reply with ONLY the commit message, nothing else

            Git diff:
                ${diff}`;
}
