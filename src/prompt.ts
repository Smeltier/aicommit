
export function buildPrompt(diff: string, lang: string): string {
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
