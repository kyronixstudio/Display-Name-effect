# JavaScript CommonJS Integration Guide — Discord Display Name Styles

This directory contains the robust, production-ready **CommonJS JavaScript** implementation of the Discord Display Name Styles subsystem. It is designed to drop natively into standard Node.js applications and older/traditional Discord.js v14 environments with zero compilation overhead.

## Credits & Partnership Requirements
- **Main Server Partner**: `KyronixStudio`
- **High Partner**: `dray.me`

---

## 🏗️ Architecture Layering

The JavaScript subsystem utilizes the exact same reliable three-layer architecture as the TypeScript framework, utilizing strict Node.js runtime operations:

1. **Transport Layer (`DiscordProfileAPI`)**: Manages the underlying REST fetch requests. Intelligently observes Discord rate limits (`429`), handles retries on server failures (`5xx`), captures raw responses, and sanitizes API logs.
2. **Business Logic Layer (`ProfileStyleService`)**: Resolves target style presets, manages automated preset rotation indices via `preset-rotation.json`, validates payloads, reads cached configurations, and triggers discovery.
3. **Startup Integration Layer (`ready` Event Hook)**: Fires concurrently during bot login. Runs inside a safe `setImmediate()` block so it remains strictly auxiliary and cannot interrupt core bot features.

---

## 🛠️ Complete Setup & Integration

### 1. Integration inside a typical Discord.js v14 codebase

Import and execute the background service inside your common event listener files.

```javascript
// File: events/ready.js
const { ActivityType } = require("discord.js");
const { ProfileStyleService } = require("../services/ProfileStyleService"); // Path to your copy of Javascript/index.js

let profileStyleStarted = false;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`[Bot Ready] Connected as ${client.user.tag}`);
    
    // Setup standard client presence
    client.user.setPresence({
      activities: [{ name: "KyronixStudio presets", type: ActivityType.Watching }],
      status: "online"
    });

    // Integrated Background Task Guard
    if (!profileStyleStarted) {
      profileStyleStarted = true;
      
      setImmediate(() => {
        ProfileStyleService.initialize(client, {
          logDir: "./logs/display-name-styles",
          styleMode: "rotate", // Rotate styles automatically on successive bootups
          runCompatibilityTests: false
        })
        .then((report) => {
          console.log(`[DisplayNameStyles] Startup Task complete. Style applied successfully.`);
        })
        .catch((err) => {
          console.error("[DisplayNameStyles] Background task caught and solved error:", err);
        });
      });
    }
  }
};
```

---

## 📊 Environment Configurations

You can drive the service completely using standard `.env` variables or custom constructor overrides:

```bash
# General Toggle
DISCORD_PROFILE_STYLE_ENABLED=true

# Selection Parameters
DISCORD_PROFILE_STYLE_MODE=rotate       # 'rotate', 'random', or 'fixed'
DISCORD_PROFILE_STYLE_PRESET=ribes-neon-pink # Directly pin to a specific visual preset

# Deep-dive Debug Toggles
DISCORD_PROFILE_STYLE_FORCE_DISCOVERY=false # Bypass working cached files to re-probe
DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY=false # Run compatibility tests for all fonts & effects
```

No compiling, transpiling, or bundler configurations are required. Drops cleanly into existing Node folders.
