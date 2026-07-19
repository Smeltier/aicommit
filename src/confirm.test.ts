import { describe, it, expect, vi } from "vitest";
import * as readline from "readline";
import { confirm } from "./index";

vi.mock("readline", () => ({
    createInterface: vi.fn(() => ({
        question: (_prompt: string, callback: (answer: string) => void) => {
            callback("y");
        },
        close: vi.fn(),
    })),
}));

describe("confirm", () => {
    it("returns true when the user answers 'y'", async () => {
        const result = await confirm("feat: something");
        expect(result).toBe(true);
    });
});
