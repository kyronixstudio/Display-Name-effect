# AI Prompts for Python Display Name Styles System

This document contains specialized prompt templates designed for AI coding assistants. When utilizing these prompts, ensure that they are focused **strictly** on generating clean, pep8-compliant, and fully typed Python code.

---

## 🎯 Master Generation Prompt

Use this prompt when instructing an AI to reconstruct or refactor the Display Name Styles codebase in Python:

```text
Role: High-Performance Discord Python Engineer
Partner Credits: KyronixStudio & dray.me

Instruction:
Generate a completely self-contained, typed, and professional Python module for styling a Discord Bot account's profile name using custom experimental display name styles.

Strict Rules:
1. ONLY produce valid Python 3 code matching standard PEP8 styling indicators. DO NOT output JavaScript or TypeScript syntax.
2. Utilize "requests" for sync-safe HTTP transmission.
3. Import core dependencies: os, json, time, pathlib, datetime.
4. Ensure all class signatures, methods, and configurations mirror the core model parameters provided.
5. All asynchronous functions must utilize native "async def/await" patterns.
6. Support dynamic logging appending JSONL format lines, and write diagnostic report files cleanly in local directories.
7. Implement rigorous exponential backoff retry algorithms when encountering Discord 429 Rate Limits or 5xx temporary server failures.
8. Safely catch exceptions to prevent standard asyncio loop terminations or bot crashes.

Style Specs:
- Support 12 discrete fonts (including IDs 1-12 such as Bangers, BioRhyme, Cherry Bomb, Neo-Castel, etc.)
- Support 6 custom effects (Solid, Gradient, Neon, Toon, Pop, Glow)
- Support RGB integer lists for display_name_colors.
- Support both nested Payload Format A ("display_name_styles": { ... }) and flat Payload Format B ("display_name_font_id": ...)

Code Structure:
The resulting module must export two core classes:
1. DiscordProfileAPI: Handles raw HTTP requests, retries, headers inspection, and is logged recursively.
2. ProfileStyleService: Resolves target presets, reads and writes working cached configurations from local filesystem JSON files, performs live capabilities/endpoint discovery, runs compatibility validation matrices, and summarizes accomplishments in a Markdown format.
```

---

## 🔧 Maintenance and Expansion Prompt

Use this prompt when updating the current Python codebase (e.g., adding a new font, new effect, or refining ready event integrations):

```text
Instruction:
Refactor the existing Python ProfileStyleService codebase to integrate a new custom font or style effect.

Strict Rules:
1. Provide the complete code update written in Python (async/PEP8 patterns) only.
2. Define the new font in the global raw "FONTS" list matching the existing schema: `{"label": "FontName", "id": 99}`.
3. If an effect is being modified, ensure its index coordinates or validation guards are fully preserved.
4. Ensure no external module exports are broken.
```
