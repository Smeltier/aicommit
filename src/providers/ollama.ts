import { Config } from "../config";
import { buildPrompt } from "../prompt";

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

