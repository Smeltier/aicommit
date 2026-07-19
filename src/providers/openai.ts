import { Config } from "../config";
import { buildPrompt } from "../prompt";

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
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error("OpenAI API returned an unexpected response format.");
    }

    return text.trim();
}

