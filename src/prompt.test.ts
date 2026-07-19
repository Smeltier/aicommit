import { describe, it, expect } from "vitest";
import { buildPrompt } from "./prompt";

describe("buildPrompt", () => {
    it("includes the diff in the prompt", () => {
        const prompt = buildPrompt("+ added line", "en");
        expect(prompt).toContain("+ added line");
    });

    it("includes the requested language", () => {
        const prompt = buildPrompt("some diff", "pt-br");
        expect(prompt).toContain("pt-br");
    });
});

