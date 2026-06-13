# TypeScript Integration Guide — Discord Display Name Styles

This directory contains the fully-typed, production-ready TypeScript implementation of the Discord Display Name Styles subsystem.

## Credits & Partnership
- **Main Server Partner**: `KyronixStudio`
- **High Partner**: `dray.me`

---

## 🏗️ Architecture Overview

The TypeScript subsystem is structured into three clean layers to guarantee maximum safety, modularity, and compile-time verification:

```text
       [ events/ready.ts ] (Guarded background bootstrapper)
               │
               ▼
   [ ProfileStyleService ] (Style selection, preset rotation, discovery lifecycle)
               │
               ▼
     [ DiscordProfileAPI ] (Exponential retry layer, network wrapper & logging)
```

1. **Transport Layer (`DiscordProfileAPI`)**: Completely handles network communication with Discord. Supports rate-limit headers detection, exponential retry backoffs, silent failures, and diagnostic logs serialization.
2. **Business Logic Layer (`ProfileStyleService`)**: Governs the core business rules. Handles loading cached successful configs, preset checking, smart rotations, and fallback route calculations.
3. **Startup Integration Layer (`events/ready.ts`)**: Integrates into your standard Discord.js websocket startup loop using safe concurrent `setImmediate()` timers to ensure bot features run uninterrupted regardless of Discord API availability.

---

## 🛠️ Installation & Setup

1. Copy `/Typescript/index.ts` to your bot repository under `src/services/ProfileStyleService.ts`.
2. Ensure you have Node.js 18+ installed (uses the native global `fetch` API under the hood, meaning zero external request dependencies like `axios` or `node-fetch`).
3. Ensure `@types/node` and `typescript` are part of your development environment.

### Integrating with Discord.js v14 ready event

Add the background task hook directly to your bot's ready listener:

```typescript
import { Client } from "discord.js";
import { ProfileStyleService } from "./services/ProfileStyleService";

let profileStyleStarted = false;

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  if (!profileStyleStarted) {
    profileStyleStarted = true;
    
    // Execute as a safe, concurrent background task that won't block startup
    setImmediate(() => {
      ProfileStyleService.initialize(client)
        .then((report) => {
          console.log(`[DisplayNameStyles] Task complete. Verified endpoint: ${report.endpointSupported}`);
        })
        .catch((err) => {
          console.error("[DisplayNameStyles] Failed safely without blocking client:", err);
        });
    });
  }
});
```

---

## 📊 Core Enums and Types

The subsystem exposes various interfaces to guarantee type safety across your codebase:

```typescript
export interface Style {
  font_id: number;
  effect_id: number;
  colors: number[];
}

export interface Preset {
  key: string;
  label: string;
  style: Style;
}

export interface ServiceOptions {
  logDir?: string;
  forceDiscovery?: boolean;
  runCompatibilityTests?: boolean;
  requestDelayMs?: number;
  maxRetries?: number;
  targetStyle?: Style;
  stylePreset?: string;
  styleMode?: string;
  guildId?: string;
}
```

---

## ♻️ Smart Caching & Presets

On the first successful boot, the service identifies which REST endpoint, payload shape, and permissions are supported by your bot token. This discovery is cached in `logs/display-name-styles/working-config.json` immediately.

Future runs entirely bypass the expensive endpoint discovery path, immediately calling the known route and using your configured **preset rotation** or targeting your specific custom style rules directly.
