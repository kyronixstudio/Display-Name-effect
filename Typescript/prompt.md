# AI Prompts for TypeScript Display Name Styles System

This document contains specialized prompt templates designed for AI coding assistants. When utilizing these prompts, ensure that they are focused **strictly** on generating clean, type-safe, and fully annotated TypeScript code.

---

## 🎯 Master Generation Prompt

Use this prompt when instructing an AI to reconstruct or refactor the Display Name Styles codebase in TypeScript:

```text
Role: High-Performance Discord TypeScript Engineer
Partner Credits: KyronixStudio & dray.me

Instruction:
Generate a completely self-contained, type-safe, and professional TypeScript module for styling a Discord Bot account's profile name using custom experimental display name styles.

Strict Rules:
1. ONLY produce valid, strict TypeScript code. DO NOT include JavaScript code.
2. Ensure there are top-level module ES import statements for "fs" and "path".
3. Declare explicit interfaces for all types: Style, Preset, ServiceOptions, WorkingConfig, ApiResponse, ServiceReport, and RotationState.
4. Do NOT use "import type" for importing enum descriptors if enums are declared in the same module.
5. All variables and methods MUST have explicit type annotations. Do not rely on loose implicit "any" types.
6. Use the native Node.js global "fetch" API (Node 18+) for HTTP communication. Do not introduce raw axios or third-party wrappers.
7. Implement rigorous exponential backoff retry algorithms when encountering Discord 429 Rate Limits or 5xx temporary server failures.
8. Validate all incoming parameters and safely catch exceptions to prevent standard bot client loop interruptions.

Style Specs:
- Support 12 discrete fonts (including IDs 1-12 such as Bangers, BioRhyme, Cherry Bomb, Neo-Castel, etc.)
- Support 6 custom effects (Solid, Gradient, Neon, Toon, Pop, Glow)
- Support RGB integer arrays for display_name_colors.
- Support both nested Payload Format A ("display_name_styles": { ... }) and flat Payload Format B ("display_name_font_id": ...)

Code Structure:
The resulting module must implement two core classes:
1. DiscordProfileAPI: Handles raw HTTP requests, retries, headers inspection, and logging.
2. ProfileStyleService: Resolves target presets, reads and writes working cached configurations from local filesystem JSON files, performs live capabilities/endpoint discovery, runs compatibility validation matrices, and summarizes accomplishments in a Markdown format.
```

---

## 🔧 Maintenance and Expansion Prompt

Use this prompt when updating the current TypeScript codebase (e.g., adding a new font, new effect, or refining ready event integrations):

```text
Instruction:
Refactor the existing TypeScript ProfileStyleService codebase to integrate a new custom font or style effect.

Strict Rules:
1. Provide the complete code update written in type-safe TypeScript only.
2. Define the new font in the global raw "FONTS" array matching the existing interface: `{ label: string, value: string, id: number, description: string }`.
3. If an effect is being modified, ensure its enum coordinates or validation guards are fully preserved.
4. Ensure no external ESM module structure is broken and that TS compilation targets (ES2022 / ESNext) are successfully respected.
5. Do not introduce loose dynamic typing. Maintain strong types throughout.
```
