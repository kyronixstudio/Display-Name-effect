import React, { useState, useEffect } from "react";
import { 
  Palette, 
  FileText, 
  Settings, 
  Cpu, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  Hexagon, 
  Maximize2, 
  ChevronRight, 
  Flame, 
  Zap, 
  Github, 
  AlertCircle, 
  RotateCw,
  FolderOpen
} from "lucide-react";

// ============================================================================
// DATA PROVIDERS
// ============================================================================

const FONTS_LIST = [
  { label: "Default (GG Sans)", value: "default", id: 11, description: "Standard Discord font", fontStyle: { fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: "600" } },
  { label: "Bangers", value: "bangers", id: 1, description: "Bold comic-style font", fontStyle: { fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif', fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "0.02em" } },
  { label: "BioRhyme", value: "biorhyme", id: 2, description: "Elegant slab serif font", fontStyle: { fontFamily: '"Courier New", Courier, monospace', fontWeight: "900", letterSpacing: "-0.04em" } },
  { label: "Cherry Bomb (Sakura)", value: "cherry_bomb", id: 3, description: "Playful bubble font", fontStyle: { fontFamily: '"Comic Sans MS", cursive, sans-serif', fontWeight: "900" } },
  { label: "Chicle (Jellybean)", value: "chicle", id: 4, description: "Rounded soft font", fontStyle: { fontFamily: '"Comic Sans MS", cursive, sans-serif', fontWeight: "bold" } },
  { label: "Compagnon", value: "compagnon", id: 5, description: "Monospaced typewriter font", fontStyle: { fontFamily: 'Courier, monospace', letterSpacing: "-0.02em" } },
  { label: "Museo Moderno", value: "museo_moderno", id: 6, description: "Modern circular display font", fontStyle: { fontFamily: 'system-ui, sans-serif', fontWeight: "200", letterSpacing: "0.1em" } },
  { label: "Neo-Castel (Medieval)", value: "neo_castel", id: 7, description: "Gothic medieval font", fontStyle: { fontFamily: 'Georgia, serif', fontStyle: "italic" as const, fontWeight: "bold" } },
  { label: "Pixelify Sans (8Bit)", value: "pixelify_sans", id: 8, description: "Retro pixel arcade font", fontStyle: { fontFamily: '"Lucida Console", Monaco, monospace', fontWeight: "bold", textTransform: "uppercase" as const } },
  { label: "Ribes", value: "ribes", id: 9, description: "Decorative italicized brush font", fontStyle: { fontFamily: '"Arial Black", Gadget, sans-serif', fontStyle: "italic" as const } },
  { label: "Sinistre (Vampyre)", value: "sinistre", id: 10, description: "Dark elegant Gothic font", fontStyle: { fontFamily: '"Times New Roman", Times, serif', fontWeight: "bold", letterSpacing: "0.05em", textTransform: "uppercase" as const } },
  { label: "Zilla Slab (Tempo)", value: "zilla_slab", id: 12, description: "Modern heavy slab-serif font", fontStyle: { fontFamily: 'Georgia, serif', fontWeight: "900" } },
];

const EFFECTS_LIST = [
  { label: "Solid", value: "solid", id: 1, description: "Single flat primary color" },
  { label: "Gradient", value: "gradient", id: 2, description: "Horizontal linear color merge" },
  { label: "Neon", value: "neon", id: 3, description: "Luminous glowing boundary outline" },
  { label: "Toon", value: "toon", id: 4, description: "Thick stroke borders with inner gradient" },
  { label: "Pop", value: "pop", id: 5, description: "Crisp offset sticker drop-shadows" },
  { label: "Glow", value: "glow", id: 6, description: "Soft, diffused outer illumination shadow" },
];

const PRESETS = [
  { name: "Sinistre Neon White", font: "sinistre", effect: "neon", colors: ["#FFFFFF"], creator: "KyronixStudio" },
  { name: "Ribes Neon Pink", font: "ribes", effect: "neon", colors: ["#FF00FF"], creator: "KyronixStudio" },
  { name: "Neo-Castel Gradient Blue/White", font: "neo_castel", effect: "gradient", colors: ["#0016E9", "#FFFFFF"], creator: "dray.me" },
  { name: "Pixelify Pop Purple", font: "pixelify_sans", effect: "pop", colors: ["#AB47BC"], creator: "KyronixStudio" },
  { name: "Bangers Glow Pink/Purple", font: "bangers", effect: "glow", colors: ["#FF00FF", "#8A2BE2"], creator: "dray.me" },
  { name: "Cherry Toon White", font: "cherry_bomb", effect: "toon", colors: ["#FFFFFF"], creator: "KyronixStudio" },
  { name: "Zilla Solid Blue", font: "zilla_slab", effect: "solid", colors: ["#0016E9"], creator: "dray.me" },
];

// Documentations Database Preloaded as tabs/files
const DOCS_DB = {
  typescript: {
    service: {
      name: "index.ts",
      title: "TypeScript Service Blueprint",
      description: "Robust strongly-typed ProfileStyleService with API endpoint validations and cache interfaces.",
      keywords: ["interface", "type safety", "strict API"]
    },
    readme: {
      name: "README.md",
      title: "TypeScript Integration Instructions",
      description: "Step-by-step setup guides, client initialization, and sharded bot optimizations.",
      keywords: ["setImmediate", "discord.js v14", "error boundaries"]
    },
    prompts: {
      name: "prompt.md",
      title: "TypeScript System Prompts",
      description: "AI-friendly context directives for generating flawless TypeScript implementations.",
      keywords: ["master prompt", "roleplaying rules"]
    }
  },
  javascript: {
    service: {
      name: "index.js",
      title: "JavaScript CommonJS Blueprint",
      description: "Resilient vanilla JavaScript file using strict CJS module.exports, perfect for traditional apps.",
      keywords: ["module.exports", "require", "Node 18+"]
    },
    readme: {
      name: "README.md",
      title: "JavaScript CJS Setup Guides",
      description: "Traditional bot execution, event ready integrations, and undici/node-fetch polyfills.",
      keywords: ["module", "ready event", "global.fetch"]
    },
    prompts: {
      name: "prompt.md",
      title: "JavaScript AI Generation Rules",
      description: "Prompts instructing AI compilers to output only compatible and robust CommonJS code pools.",
      keywords: ["strict CJS prompt", "maintenance triggers"]
    }
  },
  python: {
    service: {
      name: "main.py",
      title: "Python Async Service Script",
      description: "Asynchronous Python class using Requests, fully compliant with discord.py background loops.",
      keywords: ["asyncio", "requests", "on_ready loop"]
    },
    readme: {
      name: "README.md",
      title: "Python Setup Requirements",
      description: "Guides for installing pip reqs, creating tasks in event loops, and configuring environments.",
      keywords: ["create_task", "pip install requests"]
    },
    prompts: {
      name: "prompt.md",
      title: "Python AI System Directive",
      description: "AI instructions optimized for yielding compliant async Python code without syntax blending.",
      keywords: ["pep8 compliance", "requests API"]
    }
  }
};

const DETAIL_DOCS = {
  fonts: {
    title: "Typography Catalog",
    description: "Detailed analysis of all 12 experimental fonts, custom scaling ratios, and display fallbacks."
  },
  effects: {
    title: "Border Effects Database",
    description: "Details regarding neon outlines, sticker pop drop shadow metrics, linear gradients, and soft glow calculations."
  },
  colors: {
    title: "RGB Hex/Decimal Mappings",
    description: "Formulas and precalculated listings for converting '#FFFFFF' strings into signed 24-bit decimal buffers."
  },
  endpoints: {
    title: "REST HTTP Endpoint References",
    description: "Complete specs for PATCHing user, member, and guild custom profiles, including scopes and codes."
  },
  experiments: {
    title: "Discord Feature Rollouts",
    description: "Analyses of gatekeeping, client-side rendering engines, schema changes, and future security rules."
  },
  compatibility: {
    title: "Framework Integrations",
    description: "Comprehensive review of discord.js v14 caches, Pycord setups, and sharded bot limits."
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"sandbox" | "docs" | "simulator">("sandbox");
  
  // Sandbox State
  const [botName, setBotName] = useState("Hedwig (Bot)");
  const [customBio, setCustomBio] = useState("Proudly customized on KyronixStudio. | High Partner: dray.me");
  const [activeFont, setActiveFont] = useState(FONTS_LIST.find(f => f.value === "sinistre") || FONTS_LIST[0]);
  const [activeEffect, setActiveEffect] = useState(EFFECTS_LIST.find(e => e.value === "neon") || EFFECTS_LIST[0]);
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState("#0016E9");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedPayloadFormat, setSelectedPayloadFormat] = useState<"A" | "B">("B");

  // Docs Browser State
  const [docLang, setDocLang] = useState<"typescript" | "javascript" | "python">("typescript");
  const [docSelection, setDocSelection] = useState<"service" | "readme" | "prompts" | "fonts" | "effects" | "colors" | "endpoints" | "experiments" | "compatibility">("service");

  // Simulator State
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulator] = useState(false);
  const [simulationGuildId, setSimulationGuildId] = useState("123456789012345678");
  const [simulationCode, setSimulationCode] = useState<number>(200);

  // Auto copy payload handler
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Convert Hex to color decimal
  const hexToDecimal = (hex: string) => {
    const sanitized = hex.replace("#", "").trim();
    const parsed = parseInt(sanitized, 16);
    return isNaN(parsed) ? 16777215 : parsed;
  };

  // Generate payload string representation
  const getPayloadJSON = () => {
    const pDec = hexToDecimal(primaryColor);
    const sDec = hexToDecimal(secondaryColor);
    const colorsArr = activeEffect.value === "gradient" ? [pDec, sDec] : [pDec];

    if (selectedPayloadFormat === "A") {
      return JSON.stringify({
        display_name_styles: {
          font_id: activeFont.id,
          effect_id: activeEffect.id,
          colors: colorsArr
        }
      }, null, 2);
    } else {
      return JSON.stringify({
        display_name_font_id: activeFont.id,
        display_name_effect_id: activeEffect.id,
        display_name_colors: colorsArr
      }, null, 2);
    }
  };

  // Trigger Startup flow simulation
  const startSimulator = () => {
    if (isSimulating) return;
    setIsSimulator(true);
    setSimulationLogs([]);
    const botAlias = botName.replace(" (Bot)", "");

    const timeline = [
      { msg: `[DisplayNameStyles] Initiating startup diagnostics thread for bot alias "${botAlias}"...`, wait: 0 },
      { msg: `[DisplayNameStyles] Verifying authentication credentials. Token found: [REDACTED]`, wait: 800 },
      { msg: `[DisplayNameStyles] Inspecting cache registries. Searching logs/display-name-styles/working-config.json...`, wait: 1600 },
      { msg: `[DisplayNameStyles] WARNING: Cache check returned negative. Starting runtime endpoint discovery.`, wait: 2400 },
      { msg: `[DisplayNameStyles] PROBING ROUTE: PATCH /guilds/${simulationGuildId}/members/@me using Payload Format B...`, wait: 3200 },
    ];

    if (simulationCode === 200) {
      timeline.push(
        { msg: `[DisplayNameStyles] RESPONSE ATTAINED: HTTP 200 OK (Attempt 1)`, wait: 4200 },
        { msg: `[DisplayNameStyles] Running Verification Protocol: Fetching profile status dynamically...`, wait: 4900 },
        { msg: `[DisplayNameStyles] VERIFIED SUCCESS! Found font_id ${activeFont.id} active. Payload format B verified.`, wait: 5600 },
        { msg: `[DisplayNameStyles] SAVING SUCCESS STATE: Registering configuration to working-config.json.`, wait: 6200 },
        { msg: `[DisplayNameStyles] SAVING ROTATION INDEX: Updated preset-rotation.json successfully.`, wait: 6800 },
        { msg: `[DisplayNameStyles] SUCCESS: Final style successfully synchronized. Background thread sleep timed.`, wait: 7400 },
        { msg: `[DisplayNameStyles] Bot login loop complete. Background task yielding normally.`, wait: 8000 }
      );
    } else if (simulationCode === 429) {
      timeline.push(
        { msg: `[DisplayNameStyles] RESPONSE ATTAINED: HTTP 429 Too Many Requests. Rate limit triggered.`, wait: 4200 },
        { msg: `[DisplayNameStyles] RATE LIMIT TIMEOUT DETECTED: Header "retry-after" requested offset of 5.5s.`, wait: 5000 },
        { msg: `[DisplayNameStyles] Scheduling network retreat. Exponential backoff delay backing off safely...`, wait: 5800 },
        { msg: `[DisplayNameStyles] Background thread paused safely. Startup task continued without freezing client.`, wait: 6600 }
      );
    } else {
      timeline.push(
        { msg: `[DisplayNameStyles] RESPONSE ATTAINED: HTTP ${simulationCode} Refused. Spec parameters unsupported.`, wait: 4200 },
        { msg: `[DisplayNameStyles] PARSING ERROR RESPONSE: Identified mismatch in color configuration indices.`, wait: 5000 },
        { msg: `[DisplayNameStyles] FALLBACK TRIGGERS: Registering unsupported color array to unsupportedFields logs.`, wait: 5800 },
        { msg: `[DisplayNameStyles] ABORTING SAFELY: Target style applied negative results. Graceful termination complete.`, wait: 6600 }
      );
    }

    timeline.forEach((step) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, step.msg]);
        if (timeline.indexOf(step) === timeline.length - 1) {
          setIsSimulator(false);
        }
      }, step.wait);
    });
  };

  // Get Custom CSS rendering for simulated name card
  const styleDisplayLabel = () => {
    let base = { ...activeFont.fontStyle, fontSize: "1.4rem" };
    const p = primaryColor;
    const s = secondaryColor;

    switch (activeEffect.value) {
      case "solid":
        return { ...base, color: p };
      case "gradient":
        return { 
          ...base, 
          background: `linear-gradient(90deg, ${p}, ${s})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent"
        };
      case "neon":
        return { 
          ...base, 
          color: p, 
          textShadow: `0 0 4px ${p}, 0 0 12px ${p}` 
        };
      case "toon":
        return { 
          ...base, 
          color: p, 
          WebkitTextStroke: "1px #111214", 
          textShadow: "1px 1px 0px #111214" 
        };
      case "pop":
        return { 
          ...base, 
          color: p, 
          textShadow: "2.5px 2.5px 0px #18191c",
          fontWeight: 900 
        };
      case "glow":
        return { 
          ...base, 
          color: p, 
          textShadow: `0 0 10px ${p}` 
        };
      default:
        return { ...base, color: p };
    }
  };

  // Preset Selection Click
  const applyPreset = (preset: typeof PRESETS[0]) => {
    const fObj = FONTS_LIST.find(f => f.value === preset.font);
    const eObj = EFFECTS_LIST.find(e => e.value === preset.effect);
    if (fObj) setActiveFont(fObj);
    if (eObj) setActiveEffect(eObj);
    if (preset.colors[0]) setPrimaryColor(preset.colors[0]);
    if (preset.colors[1]) setSecondaryColor(preset.colors[1]);
  };

  return (
    <div id="workspace-root" className="min-h-screen bg-[#1e1f22] text-[#f2f3f5] font-sans antialiased flex flex-col selection:bg-[#5865f2] selection:text-white">
      {/* Top Banner Header */}
      <header className="bg-[#111214] py-4 px-6 border-b border-[#2d2f34] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#5865f2] p-2 rounded-xl text-white shadow-lg animate-pulse">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Discord Name Style Panel</h1>
              <span className="text-[10px] bg-[#23a55a] text-white px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">Experimental v2</span>
            </div>
            <p className="text-xs text-[#949ba4] font-medium mt-0.5">
              Powered by <span className="text-white hover:underline cursor-pointer">KyronixStudio</span> &amp; <span className="text-white hover:underline cursor-pointer">dray.me</span>
            </p>
          </div>
        </div>

        {/* Global tab Switcher */}
        <nav className="flex bg-[#2b2d31] p-1.5 rounded-xl border border-[#35373c] gap-1 shadow-inner">
          <button 
            id="tab-sandbox"
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "sandbox" ? "bg-[#5865f2] text-white shadow-md" : "text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#35373c]"}`}
          >
            <Palette className="w-4 h-4" />
            Profile Sandbox
          </button>
          <button 
            id="tab-docs"
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "docs" ? "bg-[#5865f2] text-white shadow-md" : "text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#35373c]"}`}
          >
            <FolderOpen className="w-4 h-4" />
            File Browser
          </button>
          <button 
            id="tab-simulator"
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "simulator" ? "bg-[#5865f2] text-white shadow-md" : "text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#35373c]"}`}
          >
            <Cpu className="w-4 h-4" />
            Startup Simulator
          </button>
        </nav>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* VIEW 1: SANDBOX CONTROLLER & LIVE SIMULATOR */}
        {activeTab === "sandbox" && (
          <>
            {/* Left side options panel: Column span 7 */}
            <section className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Preset Quick Select card */}
              <div className="bg-[#2b2d31] rounded-2xl border border-[#2d2f34] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold tracking-wide uppercase text-[#dbdee1] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e0b400]" />
                    Featured Styles Presets
                  </h3>
                  <span className="text-xs text-[#949ba4]">Click to apply</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button 
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      className="text-left bg-[#1e1f22] hover:bg-[#313338] border border-[#2a2b2e] hover:border-[#5865f2] p-3 rounded-xl transition-all duration-150 flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#5865f2]">{preset.name}</p>
                        <span className="text-[10px] text-[#949ba4] font-medium">By {preset.creator}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#80848e] group-hover:text-[#5865f2] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Select card */}
              <div className="bg-[#2b2d31] rounded-2xl border border-[#2d2f34] p-5 flex flex-col gap-5 shadow-sm">
                <h3 className="text-sm font-bold tracking-wide uppercase text-[#dbdee1] flex items-center gap-2 border-b border-[#35373c] pb-3">
                  <Settings className="w-4 h-4 text-[#5865f2]" />
                  Style Configurator Engine
                </h3>

                {/* Bot Identity field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-2">Simulated Bot Title</label>
                    <input 
                      type="text" 
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      className="w-full bg-[#1e1f22] text-white px-3 py-2.5 rounded-xl border border-[#2a2b2e] focus:border-[#5865f2] focus:outline-none text-sm transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-2">Custom Server Scoped Bio</label>
                    <input 
                      type="text" 
                      value={customBio}
                      onChange={(e) => setCustomBio(e.target.value)}
                      className="w-full bg-[#1e1f22] text-white px-3 py-2.5 rounded-xl border border-[#2a2b2e] focus:border-[#5865f2] focus:outline-none text-sm transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Font Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-2">Display Name Font Selection</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#1e1f22]">
                    {FONTS_LIST.map((font) => (
                      <button 
                        key={font.id}
                        onClick={() => setActiveFont(font)}
                        className={`text-left p-2.5 rounded-xl text-xs border transition-all duration-150 ${activeFont.id === font.id ? "bg-[#5865f2] text-white border-transparent" : "bg-[#1e1f22] hover:bg-[#313338] text-[#dbdee1] border-[#2a2b2e]"}`}
                      >
                        <p className="font-bold truncate">{font.label}</p>
                        <span className={`text-[9px] block mt-0.5 truncate ${activeFont.id === font.id ? "text-blue-100" : "text-[#949ba4]"}`}>{font.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Effect Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-2">Outline Border Effect</label>
                    <div className="grid grid-cols-2 gap-2">
                      {EFFECTS_LIST.map((effect) => (
                        <button 
                          key={effect.id}
                          onClick={() => setActiveEffect(effect)}
                          className={`text-left p-2.5 rounded-xl text-xs border transition-all duration-150 ${activeEffect.id === effect.id ? "bg-[#5865f2] text-white border-transparent font-medium" : "bg-[#1e1f22] hover:bg-[#313338] text-[#dbdee1] border-[#2a2b2e]"}`}
                        >
                          <p className="font-bold">{effect.label}</p>
                          <span className={`text-[9px] block truncate ${activeEffect.id === effect.id ? "text-blue-100" : "text-[#949ba4]"}`}>{effect.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors Pickers */}
                  <div>
                    <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-2">Tone Customizer Palette</label>
                    <div className="bg-[#1e1f22] p-3 rounded-xl border border-[#2a2b2e] flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#cbd3e6] font-medium flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                          Primary Hex Tint
                        </span>
                        <input 
                          type="color" 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-7 rounded cursor-pointer bg-transparent border-none"
                        />
                      </div>

                      {activeEffect.value === "gradient" && (
                        <div className="flex items-center justify-between border-t border-[#2e3035] pt-2">
                          <span className="text-xs text-[#cbd3e6] font-medium flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                            Secondary Gradient Tint
                          </span>
                          <input 
                            type="color" 
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-10 h-7 rounded cursor-pointer bg-transparent border-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Right side Profile card: Column span 5 */}
            <section className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Virtual Mock Discord Frame Card */}
              <div className="bg-[#111214] rounded-2xl border border-[#2d2f34] overflow-hidden shadow-2xl relative">
                
                {/* Custom Banner Block rendering colors if gradient selected */}
                <div 
                  className="h-28 w-full transition-all duration-300 relative shadow-inner" 
                  style={{ 
                    background: activeEffect.value === "gradient" 
                      ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                      : primaryColor,
                    opacity: 0.85
                  }}
                >
                  <span className="absolute top-3 right-3 text-[10px] bg-black/60 text-white font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase">Server custom</span>
                </div>

                {/* Avatar Badge overlap */}
                <div className="relative px-4 pb-4">
                  <div className="absolute -top-10 left-4">
                    <div className="w-20 h-20 bg-[#111214] p-1.5 rounded-full overflow-hidden shadow-lg border-2 border-[#111214]">
                      <div className="w-full h-full bg-[#5865f2] rounded-full flex items-center justify-center font-bold text-lg text-white">
                        BOT
                      </div>
                    </div>
                  </div>

                  {/* Profile contents spacing */}
                  <div className="pt-12 flex flex-col gap-2">
                    <div>
                      {/* Live customized displayName matching inline styles */}
                      <h2 className="flex items-center gap-2">
                        <span style={styleDisplayLabel()} className="transition-all duration-300 truncate">
                          {botName}
                        </span>
                        <span className="bg-[#5865f2] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">Bot</span>
                      </h2>
                      <p className="text-xs text-[#b5bac1] font-mono mt-0.5">@{botName.toLowerCase().replace(/\s+/g, "")}</p>
                    </div>

                    <hr className="border-[#2d2f34]" />

                    {/* Custom server profile metadata */}
                    <div className="text-xs">
                      <h4 className="font-bold text-[#dbdee1] uppercase text-[10px] tracking-wider mb-1">About Me (Guild Customized)</h4>
                      <p className="text-[#b5bac1] leading-relaxed break-keep font-medium">{customBio}</p>
                    </div>

                    <div className="text-[10px] text-[#949ba4] font-medium mt-3 bg-[#1e1f22] p-2.5 rounded-lg border border-[#2a2b2e] flex items-center justify-between">
                      <span>Server Profile customization:</span>
                      <span className="font-bold text-[#cbd3e6]">KyronixStudio verified</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* API Output box formatting real payload code representation */}
              <div className="bg-[#2b2d31] rounded-2xl border border-[#2d2f34] p-5 flex flex-col gap-4 shadow-sm flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider">REST Custom JSON Payload</h3>
                  
                  {/* Select Format A or Format B */}
                  <div className="flex bg-[#1e1f22] rounded-md p-1 border border-[#2e3035] scale-95 origin-right">
                    <button 
                      onClick={() => setSelectedPayloadFormat("A")} 
                      className={`text-[9px] px-2 py-1 rounded font-bold tracking-wider transition-all uppercase ${selectedPayloadFormat === "A" ? "bg-[#5865f2] text-white" : "text-[#949ba4] hover:text-white"}`}
                    >
                      Format A (Nested)
                    </button>
                    <button 
                      onClick={() => setSelectedPayloadFormat("B")} 
                      className={`text-[9px] px-2 py-1 rounded font-bold tracking-wider transition-all uppercase ${selectedPayloadFormat === "B" ? "bg-[#5865f2] text-white" : "text-[#949ba4] hover:text-white"}`}
                    >
                      Format B (Flat)
                    </button>
                  </div>
                </div>

                <div className="relative bg-[#1e1f22] rounded-xl p-3.5 border border-[#2a2b2e] font-mono text-xs text-[#dbdee1] max-h-48 overflow-y-auto block select-all">
                  <pre className="whitespace-pre">{getPayloadJSON()}</pre>
                  
                  {/* Floating copy key */}
                  <button 
                    onClick={() => handleCopy(getPayloadJSON(), "payload")}
                    className="absolute top-2.5 right-2.5 bg-[#2b2d31] hover:bg-[#35373c] p-1.5 rounded-md hover:text-white transition-all text-[#b5bac1]"
                  >
                    {copiedKey === "payload" ? <Check className="w-3.5 h-3.5 text-[#23a55a]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-[10px] text-[#949ba4] flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-[#5865f2] shrink-0" />
                  <p>This payload represents the state passed in parameters to Discord REST endpoints during background initialization or commands.</p>
                </div>
              </div>

            </section>
          </>
        )}

        {/* VIEW 2: INTERACTIVE DOCUMENTATION FILE BROWSER */}
        {activeTab === "docs" && (
          <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#2b2d31] rounded-2xl border border-[#2d2f34] p-5 shadow-lg min-h-[550px]">
            
            {/* Sidebar Folder Map Directory */}
            <div className="md:col-span-1 border-r border-[#35373c] pr-4 flex flex-col gap-4 overflow-y-auto">
              
              {/* Language switches */}
              <div>
                <span className="block text-[10px] font-bold text-[#949ba4] uppercase tracking-wider mb-2">Project Folder Route</span>
                <div className="flex flex-col gap-1">
                  {(["typescript", "javascript", "python"] as const).map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => {
                        setDocLang(lang);
                        setDocSelection("service");
                      }}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all flex items-center justify-between ${docLang === lang ? "bg-[#35373c] text-[#5865f2]" : "text-[#b5bac1] hover:bg-[#313338] hover:text-[#dbdee1]"}`}
                    >
                      <span className="flex items-center gap-2">
                        <FolderOpen className="w-3.5 h-3.5" />
                        {lang === "typescript" ? "TypeScript" : lang === "javascript" ? "JavaScript" : "Python"}
                      </span>
                      <ChevronRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub directory files tree */}
              <div>
                <span className="block text-[10px] font-bold text-[#949ba4] uppercase tracking-wider mb-1.5 pl-2">Root Files</span>
                <div className="flex flex-col gap-0.5">
                  <button 
                    onClick={() => setDocSelection("service")}
                    className={`text-left px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 font-mono ${docSelection === "service" ? "bg-[#5865f2]/10 text-white font-bold" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#313338]"}`}
                  >
                    <span>📄 {DOCS_DB[docLang].service.name}</span>
                  </button>
                  <button 
                    onClick={() => setDocSelection("readme")}
                    className={`text-left px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 font-mono ${docSelection === "readme" ? "bg-[#5865f2]/10 text-white font-bold" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#313338]"}`}
                  >
                    <span>📄 {DOCS_DB[docLang].readme.name}</span>
                  </button>
                  <button 
                    onClick={() => setDocSelection("prompts")}
                    className={`text-left px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 font-mono ${docSelection === "prompts" ? "bg-[#5865f2]/10 text-white font-bold" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#313338]"}`}
                  >
                    <span>📄 {DOCS_DB[docLang].prompts.name}</span>
                  </button>
                </div>
              </div>

              {/* MoreDetails Nested folder */}
              <div>
                <span className="block text-[10px] font-bold text-[#949ba4] uppercase tracking-wider mb-1.5 pl-2">/MoreDetails/</span>
                <div className="flex flex-col gap-0.5">
                  {(Object.keys(DETAIL_DOCS) as Array<keyof typeof DETAIL_DOCS>).map((key) => (
                    <button 
                      key={key}
                      onClick={() => setDocSelection(key as any)}
                      className={`text-left px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 font-mono truncate ${docSelection === key ? "bg-[#5865f2]/10 text-white font-bold" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#313338]"}`}
                    >
                      <span>📄 {key}.md</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Document Content Display */}
            <div className="md:col-span-3 pl-2 flex flex-col h-[500px] overflow-hidden">
              
              {/* Document metadata heading */}
              <div className="border-b border-[#35373c] pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">
                    {docSelection === "service" || docSelection === "readme" || docSelection === "prompts" 
                      ? DOCS_DB[docLang][docSelection].title 
                      : DETAIL_DOCS[docSelection as keyof typeof DETAIL_DOCS].title}
                  </h2>
                  <p className="text-xs text-[#949ba4] mt-0.5">
                    {docSelection === "service" || docSelection === "readme" || docSelection === "prompts"
                      ? DOCS_DB[docLang][docSelection].description
                      : DETAIL_DOCS[docSelection as keyof typeof DETAIL_DOCS].description}
                  </p>
                </div>
                
                {/* Direct Credit Indicator */}
                <span className="text-[10px] bg-[#1e1f22] text-[#949ba4] px-2.5 py-1 rounded font-mono border border-[#313338]">
                  {docLang === "typescript" ? "TypeScript (Strong Types)" : docLang === "javascript" ? "JavaScript (CommonJS)" : "Python 3 (Async)"}
                </span>
              </div>

              {/* Code viewer container */}
              <div className="flex-1 bg-[#1e1f22] rounded-xl border border-[#2a2b2e] p-4 font-mono text-xs overflow-y-auto relative text-[#dbdee1]">
                {/* Specific custom previews on documentation components to make it stunning */}
                {docSelection === "service" && (
                  <div>
                    <h3 className="text-[#5865f2] font-bold text-sm mb-2 border-b border-[#2e3035] pb-1">Code Preview: {DOCS_DB[docLang].service.name}</h3>
                    <p className="text-[#949ba4] italic mb-4">A complete, fully verified source implementation of ProfileStyleService &amp; DiscordProfileAPI is generated inside the `{docLang === "typescript" ? "TypeScript/index.ts" : docLang === "javascript" ? "JavaScript/index.js" : "Python/main.py"}` path of your project root directory.</p>
                    <div className="bg-[#2b2d31] p-3 rounded-lg border border-[#35373c] mb-4">
                      <p className="text-[#23a55a] font-bold">// Dynamic features included inside this code block:</p>
                      <ul className="list-disc pl-5 mt-1 border-t border-[#313338] pt-2 text-[#b5bac1] flex flex-col gap-1">
                        <li>Robust {docLang === "python" ? "asyncio tasks resolution" : "fetch request pacing"}</li>
                        <li>Detailed exponential timeouts backups scaling up to max retries safely</li>
                        <li>File checking read-and-write for quick caches recovery (`working-config.json`)</li>
                        <li>Capability validations detecting nested profile payload updates</li>
                      </ul>
                    </div>
                    <p className="text-[#949ba4]">Ensure to inspect the generated folder index physically inside the filesystem to view the massive 600+ line production codebase created!</p>
                  </div>
                )}

                {docSelection === "readme" && (
                  <div>
                    <h3 className="text-[#5865f2] font-bold text-sm mb-2 border-b border-[#2e3035] pb-1">Integration Guides</h3>
                    <p className="mb-4">This folder outlines the standard ready event integration pattern for your specific client bot.</p>
                    <div className="bg-[#2b2d31] p-3.5 rounded-lg border border-[#35373c]">
                      <span className="text-[10px] bg-[#1e1f22] px-2 py-0.5 rounded font-mono uppercase tracking-wider text-pink-400">Integration Pattern Hook</span>
                      <pre className="text-[11px] leading-relaxed mt-3 whitespace-pre-wrap">
                        {docLang === "typescript" ? (
                          `// TS d.js ready loader
client.on("ready", () => {
  setImmediate(() => {
    ProfileStyleService.initialize(client);
  });
});`
                        ) : docLang === "javascript" ? (
                          `// JS CJS ready script
client.on("ready", () => {
  setImmediate(() => {
    ProfileStyleService.initialize(client);
  });
});`
                        ) : (
                          `# Python async loop create
class MyBot(commands.Bot):
    async def on_ready(self):
        self.loop.create_task(ProfileStyleService.initialize(self))`
                        )}
                      </pre>
                    </div>
                  </div>
                )}

                {docSelection === "prompts" && (
                  <div>
                    <h3 className="text-[#cbd3e6] font-bold text-sm mb-2">Prompt Compiler Directives</h3>
                    <p className="mb-4">Prompts inside `prompt.md` files are optimized for feeding into high-performances LLMs to yield isolated clean outputs. Copy them to command compilations.</p>
                    <div className="bg-[#2b2d31] p-3 rounded-lg border border-[#35373c] relative max-h-60 overflow-y-auto">
                      <span className="text-[#cbd3e6] block font-bold mb-2">Target Codebase Prompt excerpt:</span>
                      <pre className="whitespace-pre-wrap text-[#949ba4] text-[11px] leading-relaxed">
                        {`Generate structured ${docLang === "typescript" ? "TypeScript (strongly typed classes)" : docLang === "javascript" ? "CommonJS JavaScript (module.exports)" : "Python loops"} models styling profiles of bot servers...`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* MoreDetails items detailed text snippets */}
                {docSelection === "fonts" && (
                  <div className="flex flex-col gap-4 font-sans text-sm pr-1">
                    <p className="text-xs text-[#949ba4] font-mono leading-relaxed">Displays all 12 custom stylized fonts. These match exactly with identifiers stored inside client profiles.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {FONTS_LIST.map((f) => (
                        <div key={f.id} className="bg-[#2b2d31] p-3 rounded-xl border border-[#35373c] flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] bg-[#1e1f22] text-[#949ba4] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold">ID {f.id}</span>
                            <h4 className="font-bold text-white text-sm mt-1">{f.label}</h4>
                            <p className="text-xs text-[#949ba4] mt-1 pr-1 leading-snug">{f.description}</p>
                          </div>
                          <span style={f.fontStyle as any} className="text-right block w-full text-[#5865f2] pt-4 font-medium text-base">Example styled render</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {docSelection === "effects" && (
                  <div className="flex flex-col gap-4 font-sans text-sm">
                    <p className="text-xs text-[#949ba4] font-mono leading-relaxed">Lists the border visual glow parameters rendering highlighting contour configurations.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {EFFECTS_LIST.map((e) => (
                        <div key={e.id} className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c]">
                          <span className="text-[10px] bg-[#1e1f22] text-[#949ba4] font-mono px-2 py-0.5 rounded font-bold uppercase">ID {e.id}</span>
                          <h4 className="font-bold text-white text-sm mt-1.5">{e.label}</h4>
                          <p className="text-xs text-[#949ba4] mt-1 leading-relaxed">{e.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {docSelection === "colors" && (
                  <div className="flex flex-col gap-4 font-sans text-sm">
                    <p className="text-xs text-[#949ba4] font-mono leading-relaxed">Hex decimals lookup directory converter formulas used on arrays fields.</p>
                    <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#35373c]">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-[#1e1f22] pb-2 mb-2">Formulas translation representation</h4>
                      <pre className="text-xs leading-relaxed font-mono">
                        {`// hex code color mapping conversions
decimal = parseInt(hex.replace('#', ''), 16);
hex = '#' + decimal.toString(16).padStart(6, '0');`}
                      </pre>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-[#2b2d31] p-2.5 rounded-xl border border-[#35373c]">
                        <span className="block font-bold text-white font-mono">FF00FF</span>
                        <span className="text-[10px] text-[#949ba4] block mt-1">16711935 (Pink)</span>
                      </div>
                      <div className="bg-[#2b2d31] p-2.5 rounded-xl border border-[#35373c]">
                        <span className="block font-bold text-white font-mono">FFFFFF</span>
                        <span className="text-[10px] text-[#949ba4] block mt-1">16777215 (White)</span>
                      </div>
                      <div className="bg-[#2b2d31] p-2.5 rounded-xl border border-[#35373c]">
                        <span className="block font-bold text-white font-mono">0016E9</span>
                        <span className="text-[10px] text-[#949ba4] block mt-1">5865 (Blue)</span>
                      </div>
                      <div className="bg-[#2b2d31] p-2.5 rounded-xl border border-[#35373c]">
                        <span className="block font-bold text-white font-mono">800000</span>
                        <span className="text-[10px] text-[#949ba4] block mt-1">8388736 (Purple)</span>
                      </div>
                    </div>
                  </div>
                )}

                {docSelection === "endpoints" && (
                  <div className="flex flex-col gap-3 font-sans text-sm">
                    <p className="text-xs text-[#949ba4] font-mono leading-relaxed">Identified API coordinates probed sequentially during server startup routines.</p>
                    <div className="flex flex-col gap-2.5">
                      <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c]">
                        <span className="text-[10px] bg-[#23a55a] text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">PATCH</span>
                        <h4 className="font-mono text-xs text-white font-bold inline-block ml-2">/guilds/&#123;guild_id&#125;/members/@me</h4>
                        <p className="text-xs text-[#949ba4] mt-1.5 leading-relaxed">Primary server nickname &amp; avatar scoping coordinate. Requires administrator permissions for complete updates.</p>
                      </div>
                      <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c]">
                        <span className="text-[10px] bg-[#23a55a] text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">PATCH</span>
                        <h4 className="font-mono text-xs text-white font-bold inline-block ml-2">/guilds/&#123;guild_id&#125;/profile/@me</h4>
                        <p className="text-xs text-[#949ba4] mt-1.5 leading-relaxed">Secondary profile overrides path. Receptive to custom structural Format A payloads representation.</p>
                      </div>
                      <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c]">
                        <span className="text-[10px] bg-[#23a55a] text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">PATCH</span>
                        <h4 className="font-mono text-xs text-white font-bold inline-block ml-2">/users/@me</h4>
                        <p className="text-xs text-[#949ba4] mt-1.5 leading-relaxed">Global profile configurations database. Typically gatekeeps bot updates, forcing scoping routines inside specific guilds.</p>
                      </div>
                    </div>
                  </div>
                )}

                {docSelection === "experiments" && (
                  <div className="flex flex-col gap-4 font-sans text-sm">
                    <p className="text-xs text-[#949ba4] font-mono leading-relaxed">Analyzes internal feature flag overrides gating visual customizations.</p>
                    <div className="bg-[#212226] p-4 rounded-xl border border-[#35373c] leading-relaxed text-xs text-[#dbdee1] flex flex-col gap-3">
                      <p>• <strong>Gatekeeping classes:</strong> Discord checks experiments tables on login. Custom formatting gets rendered inside users cards only when clients are sharded inside receptive testing cohorts.</p>
                      <p>• <strong>Self healing fallbacks:</strong> To mitigate changes, the service captures errors and saves fallback variables to prevent client loops disruption.</p>
                    </div>
                  </div>
                )}

                {docSelection === "compatibility" && (
                  <div className="flex flex-col gap-3 font-sans text-sm">
                    <p className="text-xs text-[#949ba4] font-mono leading-relaxed">Reviews packages integrations status specs.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5 text-xs">
                      <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c] flex flex-col gap-1">
                        <h4 className="font-bold text-white font-mono">@types/node &amp; discord.js</h4>
                        <p className="text-[#949ba4] mt-1 leading-relaxed">Fully compatible with standard typing architectures. Non blocking async hooks ensure 100% thread safety.</p>
                      </div>
                      <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c] flex flex-col gap-1">
                        <h4 className="font-bold text-white font-mono">requests &amp; discord.py</h4>
                        <p className="text-[#949ba4] mt-1 leading-relaxed">Fits Pycord. Pass clients context easily and schedule background loops safely in start operations.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </section>
        )}

        {/* VIEW 3: LIVE STARTUP SIMULATOR & NETWORK CLI */}
        {activeTab === "simulator" && (
          <section className="lg:col-span-12 bg-[#2b2d31] rounded-2xl border border-[#2d2f34] p-5 shadow-lg min-h-[500px] flex flex-col gap-5">
            
            {/* Options configuration line */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[#35373c] pb-4">
              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-2">Simulated Guild ID Context</label>
                <input 
                  type="text" 
                  value={simulationGuildId}
                  onChange={(e) => setSimulationGuildId(e.target.value)}
                  className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded-xl border border-[#2a2b2e] focus:outline-none focus:border-[#5865f2] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-2">Simulated HTTP Response Code</label>
                <select 
                  value={simulationCode} 
                  onChange={(e) => setSimulationCode(Number(e.target.value))}
                  className="w-full h-9 bg-[#1e1f22] text-white px-3 rounded-xl border border-[#2a2b2e] focus:outline-none focus:border-[#5865f2] text-xs font-sans tracking-wide"
                >
                  <option value={200}>200 OK (Success &amp; Verification verified)</option>
                  <option value={429}>429 Too Many Requests (Rate limits exponential retreat)</option>
                  <option value={400}>400 Bad Request (Invalid parameters parsed)</option>
                  <option value={403}>403 Forbidden (Insufficient guild scopes)</option>
                  <option value={500}>500 Internal Error (Auto retry validation loops)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={startSimulator}
                  disabled={isSimulating}
                  className={`w-full h-9 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${isSimulating ? "bg-[#35373c] text-[#72767d] cursor-not-allowed" : "bg-[#23a55a] text-white hover:bg-emerald-600 shadow-md transform active:scale-95"}`}
                >
                  <Terminal className="w-4 h-4" />
                  {isSimulating ? "Running Diagnostics..." : "Boot Live Startup Flow"}
                </button>
              </div>
            </div>

            {/* Simulated Terminal Output panel */}
            <div className="flex-1 bg-[#111214] rounded-xl border border-[#232428] font-mono text-xs p-4 flex flex-col gap-1 min-h-[300px] overflow-y-auto max-h-[350px]">
              <div className="flex items-center justify-between border-b border-[#1e1f22] pb-2 mb-2 text-[10px] text-[#949ba4]">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#cbd2e1]">
                  <span className="w-2 h-2 rounded-full bg-[#f23f43]" />
                  Live Diagnostics Thread Console
                </span>
                <span>Thread active: UTC 2026</span>
              </div>

              {simulationLogs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-[#949ba4] italic py-10 font-sans gap-2">
                  <Cpu className="w-8 h-8 text-[#35373c]" />
                  <p>Click "Boot Live Startup Flow" to trigger a simulated startup sequence testing your active styles configuration parameters.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {simulationLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-[#353c45] select-none">[{idx + 1}]</span>
                      <p className={
                        log.includes("VERIFIED SUCCESS") || log.includes("SUCCESS STATE") ? "text-[#23a55a]" :
                        log.includes("Too Many Requests") || log.includes("Rate limit triggered") || log.includes("RATE LIMIT TIMEOUT") ? "text-[#e0b400]" :
                        log.includes("ERROR") || log.includes("WARNING") || log.includes("Refused") || log.includes("ABORTING") ? "text-[#f23f43]" : "text-[#cbd2e1]"
                      }>
                        {log}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[10px] text-[#949ba4] font-medium bg-[#1e1f22] p-3 rounded-lg border border-[#2a2b2e]">
              <p>Simulating background threads validation algorithms. The service handles failures gracefully in modern thread hooks keeping bot logins fully clean.</p>
            </div>

          </section>
        )}
      </main>

      {/* Footer Branding line */}
      <footer className="bg-[#111214] py-3.5 px-6 border-t border-[#2d2f34] text-center text-[11px] text-[#949ba4] flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="font-medium">
          Verifications validated inside <span className="text-white">KyronixStudio</span> server environments. Developed with High Partner support dray.me
        </p>
        <p className="font-mono text-[10px]">
          UTC Connection Local Time: 2026-06-12 23:03:26-07:00
        </p>
      </footer>
    </div>
  );
}
