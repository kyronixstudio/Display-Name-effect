# Python Async Integration Guide — Discord Display Name Styles

This directory contains the full async **Python 3** implementation of the Display Name Styles service. It integrates beautifully inside systems driven by `discord.py` (v2+), `Pycord`, or `interactions.py` packages.

## Credits & Partners
- **Main Server Partner**: `KyronixStudio`
- **High Partner**: `dray.me`

---

## 🏗️ Architecture Design

The Python implementation mirrors the same layered architecture as the TypeScript/JavaScript systems:

1. **Transport Layer (`DiscordProfileAPI`)**: Safe, synchronous-ready network caller wrapped around the robust `requests` module. Supports exponential backoffs, rates limits evaluation, retry offsets, and raw logger callbacks.
2. **Business Logic Layer (`ProfileStyleService`)**: Governs style resolution coordinates (JSON paths, custom fields), manages rotation state databases via local files, validates payloads, and discovery.
3. **Startup Integration Layer (`on_ready` Event Hook)**: Hooks into `discord.py`'s standard async event loops on bot login, executing safely inside the event loop background as a non-blocking coroutine.

---

## 🛠️ Complete Installation and Setup

### 1. Requirements Installation
The module relies on the standard `requests` module. Ensure it is installed:
```bash
pip install requests
```

### 2. Integration inside a typical `discord.py` Bot

Import the core classes and trigger the service as an async task inside your client's custom initialization:

```python
# File: main.py
import discord
from discord.ext import commands
from Python.main import ProfileStyleService # Import from your copied Python folder path

class StyledBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        super().__init__(command_prefix="!", intents=intents)
        self.style_started = False

    async def on_ready(self):
        print(f"[Bot] Connected as {self.user} (ID: {self.user.id})")
        
        # Guard ensure starting exactly once per process
        if not self.style_started:
            self.style_started = True
            
            # Dispatch as a concurrent background task immediately
            self.loop.create_task(self.run_presets_task())

    async def run_presets_task(self):
        try:
            print("[DisplayNameStyles] Dispatched background style service...")
            # We pass self as client. Options can be customized here or via env vars.
            report = await ProfileStyleService.initialize(self, {
                "styleMode": "rotate", # Automatically rotate presets on each startup
                "runCompatibilityTests": False
            })
            print(f"[DisplayNameStyles] Task complete. Result parsed: {report.get('endpointSupported')}")
        except Exception as e:
            print(f"[DisplayNameStyles] Safe background fallback caught: {e}")

bot = StyledBot()
bot.run("YOUR_BOT_TOKEN_HERE")
```

---

## 📊 Environment Configurations

You can drive the Python service parameters by declaring direct environment variables inside your container deployment environment (e.g. `.env` file):

```env
# general switches
DISCORD_PROFILE_STYLE_ENABLED="true"

# behavior controls
DISCORD_PROFILE_STYLE_MODE="rotate"      # 'rotate', 'random', or 'fixed'
DISCORD_PROFILE_STYLE_PRESET="ribes-neon-pink" # Override directly targeting this preset

# network speeds
DISCORD_PROFILE_STYLE_REQUEST_DELAY_MS="1500" # delay spacing between compatibility checks
```
