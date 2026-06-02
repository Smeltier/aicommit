import { Config } from "../config";

export async function generate(diff: string, config: Config): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": config.apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: config.model,
            max_tokens: 256,
            messages: [{ role: "user", content: buildPrompt(diff, config.lang) }],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json() as { content: { type: string; text: string }[] }
    return data.content[0].text.trim();
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
