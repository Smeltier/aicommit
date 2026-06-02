export type Provider = "anthropic" | "openai" | "ollama";

export interface Config {
    provider: Provider;
    apiKey: string;
    lang: string;
    model?: string;
}

const PROVIDER_DEFAULTS: Record<Provider, string> = {
    anthropic: "claude-haiku-4-5-20251001",
    openai: "gpt-4o-mini",
    ollama: "llama3",
};

export function loadConfig(): Config {
    const provider = (process.env.AICOMMIT_PROVIDER ?? "anthropic") as Provider;

    if (!["anthropic", "openai", "ollama"].includes(provider)) {
        console.error(`Invalid provider: "${provider}". Must be anthropic, openai, or ollama.`);
        process.exit(1);
    }

    if (provider !== "ollama" && !process.env.AICOMMIT_API_KEY) {
        console.error(`AICOMMIT_API_KEY is required for provider "${provider}".`);
        process.exit(1);
    }

    return {
        provider,
        apiKey: process.env.AICOMMIT_API_KEY ?? "",
        lang: process.env.AICOMMIT_LANG ?? "en",
        model: process.env.AICOMMIT_MODEL || PROVIDER_DEFAULTS[provider],
    };
}
