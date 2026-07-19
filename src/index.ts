#!/usr/bin/env node

import { execSync } from "child_process";
import * as readline from "readline";
import { loadConfig } from "./config";
import { generate as anthropicGenerate } from "./providers/anthropic";
import { generate as openaiGenerate } from "./providers/openai";
import { generate as ollamaGenerate } from "./providers/ollama";

async function getStagedDiff(): Promise<string> {
    try {
        const diff = execSync("git diff --staged", { encoding: "utf-8" });
        return diff.trim();
    } catch {
        console.error("Failed to get staged diff. Are you inside a git repository?");
        process.exit();
    }
}

async function generateMessage(diff: string): Promise<string> {
    const config = loadConfig();

    switch (config.provider) {
        case "anthropic": return anthropicGenerate(diff, config);
        case "openai": return openaiGenerate(diff, config);
        case "ollama": return ollamaGenerate(diff, config);
    }
}

async function confirm(message: string): Promise<boolean> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(`\nCommit message: ${message}\n\nConfirm? (Y/n) `, (answer) => {
            rl.close();
            const normalized = answer.trim().toLowerCase();
            resolve(normalized === "" || normalized === "y" || normalized === "yes");
        });
    });
}

async function main() {
    const diff = await getStagedDiff();

    if (!diff) {
        console.error("No staged changes found. Run `git add` first.");
        process.exit(1);
    }

    console.log("Generating commit message...");

    const message = await generateMessage(diff);
    const confirmed = await confirm(message);

    if (!confirmed) {
        console.log("Aborted.");
        process.exit(0);
    }

    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
}

main().catch((err) => {
    console.error(err.message),
    process.exit(1);
});
