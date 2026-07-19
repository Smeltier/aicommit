import { Config } from "../config";
import { buildPrompt } from "../prompt";

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

    const data = await response.json() as { content: { type: string; text: string }[] };
    const text = data.content?.[0]?.text;

    if (!text) {
        throw new Error("Anthropic API returned an unexpected response format.");
    }

    return text.trim();
}

