# 📦 Library Compatibility Details — Python

This document outlines the framework compatibility and library-specific integrations for the **Discord Display Name Styles** service in Python.

---

## 🟢 discord.py v2+ Integration

The subsystem is fully compatible with **discord.py** version 2 and newer. It operates cleanly as an async task dispatched from standard startup event hooks (such as `on_ready()`).

### 🔌 Safe Task Dispatching

Always coordinate style updating inside the async event loop to avoid blocking standard heartbeats or command handling tasks:

```python
import discord
from discord.ext import commands
from Python.main import ProfileStyleService

class CustomBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix="!", intents=discord.Intents.default())
        self.style_service_dispatched = False

    async def on_ready(self):
        print(f"Logged in as {self.user}")
        
        if not self.style_service_dispatched:
            self.style_service_dispatched = True
            # Schedule in the loop as a background task
            self.loop.create_task(self.run_custom_style_setup())

    async def run_custom_style_setup(self):
        # Passes self as client
        report = await ProfileStyleService.initialize(self, {"styleMode": "rotate"})
        print(f"[Styles] Active format: {report.get('payloadFormat')}")
```

---

## 🔑 Permissions & Server Scopes

To modify server nickname attributes, the bot requires specific scopes:

### 1. Change Nickname Permissions
When executing `PATCH /guilds/{guild_id}/members/@me`, the bot requires the `change_nickname` permission in that guild.
- **Python Verification Check**:
  ```python
  member = guild.me
  if member.guild_permissions.change_nickname:
      print("Bot is permitted to style its nickname!")
  ```

### 2. Pycord and Interactions.py
- **Pycord**: Uses the identical client structures and fits perfectly without code changes. Pass the Pycord `Bot` or `Client` as the first argument in `ProfileStyleService.initialize()`.
- **Interactions.py**: Compatible as long as you can resolve the raw bot token in requests. If interactions.py exposes token under `client.token` or custom attributes, the client resolver handles it gracefully. Otherwise, configure `DISCORD_TOKEN` as an environment variable and it will serve as the fallback token.

---

## 🛠️ Python Version Requirements

- Minimum Python Version: **Python 3.8+**
- Core HTTP Dependency: The `requests` module (used inside `DiscordProfileAPI` for executing stable, retrying REST PATCH actions). Make sure to run `pip install requests` prior to spinning up development test files.
