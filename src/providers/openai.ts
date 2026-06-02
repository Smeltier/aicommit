import { Config } from "../config";

export async function generate(diff: string, config: Config): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.model,
            max_tokens: 256,
            messages: [{ role: "user", content: buildPrompt(diff, config.lang) }],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json() as { choices: { message: { content: string } }[] };
    return data.choices[0].message.content.trim();
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
