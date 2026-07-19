import { describe, it, expect, vi } from "vitest";
import * as readline from "readline";
import * as childProcess from "child_process";
import { confirm, getStagedDiff, generateMessage } from "./index";
import { loadConfig } from "./config";
import { generate as anthropicGenerate } from "./providers/anthropic";

vi.mock("readline", () => ({
    createInterface: vi.fn(() => ({
        question: (_prompt: string, callback: (answer: string) => void) => {
            callback("y");
        },
        close: vi.fn(),
    })),
}));

vi.mock("child_process", () => ({
    execSync: vi.fn(),
}));

vi.mock("./config", () => ({
    loadConfig: vi.fn(),
}));

vi.mock("./providers/anthropic", () => ({ generate: vi.fn() }));
vi.mock("./providers/openai", () => ({ generate: vi.fn() }));
vi.mock("./providers/ollama", () => ({ generate: vi.fn() }));

describe("confirm", () => {
    it("returns true when the user answers 'y'", async () => {
        const result = await confirm("feat: something");
        expect(result).toBe(true);
    });
});

describe("getStagedDiff", () => {
    it("returns the diff without surrounding whitespace", async () => {
        vi.mocked(childProcess.execSync).mockReturnValue("  + added line\n  ");
        const diff = await getStagedDiff();
        expect(diff).toBe("+ added line");
    });

    it("calls process.exit when execSync fails", async () => {
        vi.mocked(childProcess.execSync).mockImplementation(() => {
            throw new Error("not a git repo");
        });
        const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

        await getStagedDiff();

        expect(exitSpy).toHaveBeenCalled();
        exitSpy.mockRestore();
    });
});

describe("generateMessage", () => {
    it("routes to the correct provider based on config", async () => {
        vi.mocked(loadConfig).mockReturnValue({
            provider: "anthropic",
            apiKey: "fake-key",
            lang: "en",
            model: "claude-haiku-4-5-20251001",
        });
        vi.mocked(anthropicGenerate).mockResolvedValue("feat: add login");

        const result = await generateMessage("some diff");

        expect(anthropicGenerate).toHaveBeenCalledWith("some diff", expect.objectContaining({ provider: "anthropic" }));
        expect(result).toBe("feat: add login");
    });
});
