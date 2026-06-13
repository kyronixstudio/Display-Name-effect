import * as fs from "fs";
import * as path from "path";

// ============================================================================
// TYPE DEFINITIONS & SCHEMAS
// ============================================================================

export interface Style {
  font_id: number;
  effect_id: number;
  colors: number[];
}

export interface Font {
  label: string;
  value: string;
  id: number;
  description: string;
}

export interface Effect {
  label: string;
  value: string;
  id: number;
  description: string;
}

export interface ColorTest {
  label: string;
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

export interface WorkingConfig {
  endpoint: string;
  endpointTemplate: string;
  endpointLabel: string;
  endpointKey: string;
  guildId: string | null;
  guildScoped: boolean;
  payloadFormat: string;
  style: Style;
  discoveredAt: string;
  appliedAt?: string;
  appliedGuildIds?: string[];
}

export interface ApiResponse {
  ok: boolean;
  status: number;
  statusText: string;
  method: string;
  endpoint: string;
  url: string;
  attempt: number;
  durationMs: number;
  headers: Record<string, string>;
  retryAfterSeconds: number | null;
  rateLimited: boolean;
  raw: string;
  parsed: any;
  parseError: string | null;
  requestBody: any;
  error?: {
    name: string;
    message: string;
    stack?: string;
  } | null;
  verifiedStyle?: boolean;
  verification?: any[];
  guildId?: string | null;
}

export interface ServiceReport {
  title: string;
  generatedAt: string;
  endpointSupported: string;
  botTokenSupported: string;
  payloadFormat: string;
  acceptedFontIds: number[];
  acceptedEffectIds: number[];
  acceptedColors: string[];
  finalWorkingConfiguration: WorkingConfig | null;
  finalTargetConfiguration: Style | null;
  selectedStylePreset: Preset | null;
  availableStylePresets: Preset[];
  unsupportedFields: string[];
  endpoints: Record<string, Record<string, any>>;
  notes: string[];
}

export interface RotationState {
  nextIndex: number;
  lastPresetKey: string;
  updatedAt: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const FONTS: Font[] = [
  { label: "Bangers", value: "bangers", id: 1, description: "Bold comic-style font" },
  { label: "BioRhyme", value: "biorhyme", id: 2, description: "Elegant serif font" },
  { label: "Cherry Bomb", value: "cherry_bomb", id: 3, description: "Playful bubble font" },
  { label: "Chicle", value: "chicle", id: 4, description: "Rounded soft font" },
  { label: "Compagnon", value: "compagnon", id: 5, description: "Monospaced display font" },
  { label: "Museo Moderno", value: "museo_moderno", id: 6, description: "Modern display font" },
  { label: "Neo-Castel", value: "neo_castel", id: 7, description: "Gothic medieval font" },
  { label: "Pixelify Sans", value: "pixelify_sans", id: 8, description: "Retro pixel font" },
  { label: "Ribes", value: "ribes", id: 9, description: "Decorative display font" },
  { label: "Sinistre", value: "sinistre", id: 10, description: "Dark elegant font" },
  { label: "Default (GG Sans)", value: "default", id: 11, description: "Standard Discord font" },
  { label: "Zilla Slab", value: "zilla_slab", id: 12, description: "Modern slab-serif font" }
];

export const EFFECTS: Effect[] = [
  { label: "Solid", value: "solid", id: 1, description: "Single flat color" },
  { label: "Gradient", value: "gradient", id: 2, description: "Two-color gradient (needs 2 colors)" },
  { label: "Neon", value: "neon", id: 3, description: "Glowing outline effect" },
  { label: "Toon", value: "toon", id: 4, description: "Subtle gradient with stroke" },
  { label: "Pop", value: "pop", id: 5, description: "Colored drop shadow" },
  { label: "Glow", value: "glow", id: 6, description: "Soft glow effect" }
];

export const COLOR_TESTS: ColorTest[] = [
  { label: "White", colors: [16777215] },
  { label: "Blue", colors: [5865] },
  { label: "Pink", colors: [16711935] },
  { label: "Purple", colors: [8388736] },
  { label: "White to Blue Gradient", colors: [16777215, 5865] },
  { label: "Pink to Purple Gradient", colors: [16711935, 8388736] }
];

export const TARGET_STYLE: Style = {
  font_id: 10,
  effect_id: 3,
  colors: [16777215]
};

export const STYLE_PRESETS: Preset[] = [
  { key: "sinistre-neon-white", label: "Sinistre Neon White", style: { font_id: 10, effect_id: 3, colors: [16777215] } },
  { key: "ribes-neon-pink", label: "Ribes Neon Pink", style: { font_id: 9, effect_id: 3, colors: [16711935] } },
  { key: "neo-castel-gradient-blue-white", label: "Neo-Castel Blue/White Gradient", style: { font_id: 7, effect_id: 2, colors: [5865, 16777215] } },
  { key: "pixelify-pop-purple", label: "Pixelify Sans Pop Purple", style: { font_id: 8, effect_id: 5, colors: [8388736] } },
  { key: "bangers-glow-pink-purple", label: "Bangers Pink/Purple Glow", style: { font_id: 1, effect_id: 6, colors: [16711935, 8388736] } },
  { key: "cherry-toon-white", label: "Cherry Bomb Toon White", style: { font_id: 3, effect_id: 4, colors: [16777215] } },
  { key: "zilla-solid-blue", label: "Zilla Slab Solid Blue", style: { font_id: 12, effect_id: 1, colors: [5865] } }
];

export const PAYLOAD_FORMATS: Record<string, (style: Style) => any> = {
  A: (style) => ({ display_name_styles: style }),
  B: (style) => ({
    display_name_font_id: style.font_id,
    display_name_effect_id: style.effect_id,
    display_name_colors: style.colors
  })
};

const SUPPORTED_ERROR_STATUSES = new Set([400, 401, 403, 404, 405, 409, 429, 500, 502, 503, 504]);
const DEFAULT_LOG_DIR = path.join(process.cwd(), "logs", "display-name-styles");

// ============================================================================
// TRANSPORT LAYER: DiscordProfileAPI
// ============================================================================

export class DiscordProfileAPI {
  private token: string;
  private baseUrl: string;
  private logger: (entry: ApiResponse) => void;
  private maxRetries: number;
  private retryBaseDelayMs: number;

  constructor(
    token: string,
    baseUrl = "https://discord.com/api/v10",
    logger?: (entry: ApiResponse) => void,
    maxRetries = 3,
    retryBaseDelayMs = 1000
  ) {
    this.token = token;
    this.baseUrl = baseUrl;
    this.logger = logger || (() => {});
    this.maxRetries = maxRetries;
    this.retryBaseDelayMs = retryBaseDelayMs;
  }

  public async patch(endpoint: string, body: any, options: any = {}): Promise<ApiResponse> {
    return this.request("PATCH", endpoint, body, options);
  }

  public async get(endpoint: string, options: any = {}): Promise<ApiResponse> {
    return this.request("GET", endpoint, null, options);
  }

  private async request(method: string, endpoint: string, body: any, options: any): Promise<ApiResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    let attempt = 0;
    const maxAttempts = (options.maxRetries ?? this.maxRetries) + 1;

    while (attempt < maxAttempts) {
      attempt++;
      const startTime = Date.now();
      let response: Response | null = null;
      let raw = "";
      let parsed: any = null;
      let parseError: string | null = null;

      try {
        const headers: Record<string, string> = {
          "Authorization": `Bot ${this.token}`,
          "User-Agent": "DiscordBot (https://discord.com, 1.0)"
        };

        if (method !== "GET") {
          headers["Content-Type"] = "application/json";
          headers["Accept"] = "application/json";
        }

        const fetchOptions: RequestInit = {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined
        };

        response = await fetch(url, fetchOptions);
        raw = await response.text();

        try {
          parsed = JSON.parse(raw);
        } catch (err: any) {
          parseError = err.message;
        }
      } catch (err: any) {
        const duration = Date.now() - startTime;
        const result: ApiResponse = {
          ok: false,
          status: 0,
          statusText: "NETWORK_ERROR",
          method,
          endpoint,
          url,
          attempt,
          durationMs: duration,
          headers: {},
          retryAfterSeconds: null,
          rateLimited: false,
          raw: err.message,
          parsed: null,
          parseError: null,
          requestBody: body,
          error: {
            name: err.name,
            message: err.message,
            stack: err.stack
          }
        };

        this.logger(result);

        if (attempt < maxAttempts) {
          const delay = (this.retryBaseDelayMs * Math.pow(2, attempt - 1)) / 1000;
          await new Promise((resolve) => setTimeout(resolve, delay * 1000));
          continue;
        }
        return result;
      }

      const duration = Date.now() - startTime;
      const headers = this.pickHeaders(response);
      const retryAfterSeconds = this.getRetryAfterSeconds(response, parsed);
      const rateLimited = response.status === 429;

      const result: ApiResponse = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        method,
        endpoint,
        url,
        attempt,
        durationMs: duration,
        headers,
        retryAfterSeconds,
        rateLimited,
        raw,
        parsed,
        parseError,
        requestBody: body,
        error: null
      };

      this.logger(result);

      if (rateLimited && attempt < maxAttempts) {
        const delay = retryAfterSeconds ?? ((this.retryBaseDelayMs * Math.pow(2, attempt - 1)) / 1000);
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
        continue;
      }

      const shouldRetry = new Set([500, 502, 503, 504]).has(response.status) && attempt < maxAttempts;
      if (shouldRetry) {
        const delay = (this.retryBaseDelayMs * Math.pow(2, attempt - 1)) / 1000;
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
        continue;
      }

      return result;
    }

    throw new Error("DiscordProfileAPI request reached an unreachable state.");
  }

  private getRetryAfterSeconds(response: Response, parsed: any): number | null {
    if (parsed && typeof parsed.retry_after === "number") {
      return parsed.retry_after;
    }
    const headerValue = response.headers.get("retry-after");
    if (headerValue) {
      const parsedFloat = parseFloat(headerValue);
      if (!isNaN(parsedFloat)) return parsedFloat;
    }
    return null;
  }

  private pickHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {};
    const keys = [
      "content-type",
      "date",
      "x-ratelimit-bucket",
      "x-ratelimit-limit",
      "x-ratelimit-remaining",
      "x-ratelimit-reset",
      "x-ratelimit-reset-after",
      "retry-after",
      "x-discord-trace-id"
    ];
    for (const key of keys) {
      const value = response.headers.get(key);
      if (value) {
        headers[key] = value;
      }
    }
    return headers;
  }
}

// ============================================================================
// BUSINESS LOGIC LAYER: ProfileStyleService
// ============================================================================

export class ProfileStyleService {
  public static readonly FONTS = FONTS;
  public static readonly EFFECTS = EFFECTS;
  public static readonly COLOR_TESTS = COLOR_TESTS;
  public static readonly TARGET_STYLE = TARGET_STYLE;
  public static readonly STYLE_PRESETS = STYLE_PRESETS;

  private client: any;
  private options: Required<ServiceOptions>;
  private report: ServiceReport;
  private runId: string;
  private logFile: string;
  private reportFile: string;
  private cacheFile: string;
  private rotationFile: string;
  private api: DiscordProfileAPI | null = null;
  private selectedStylePreset: Preset | null = null;

  constructor(client: any, options: ServiceOptions = {}) {
    this.client = client;
    this.options = {
      logDir: options.logDir ?? process.env.DISCORD_PROFILE_STYLE_LOG_DIR ?? DEFAULT_LOG_DIR,
      forceDiscovery: options.forceDiscovery ?? process.env.DISCORD_PROFILE_STYLE_FORCE_DISCOVERY === "true",
      runCompatibilityTests: options.runCompatibilityTests ?? process.env.DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY === "true",
      requestDelayMs: Number(process.env.DISCORD_PROFILE_STYLE_REQUEST_DELAY_MS ?? options.requestDelayMs ?? 1500),
      maxRetries: Number(process.env.DISCORD_PROFILE_STYLE_MAX_RETRIES ?? options.maxRetries ?? 2),
      targetStyle: options.targetStyle ?? (null as any),
      stylePreset: options.stylePreset ?? process.env.DISCORD_PROFILE_STYLE_PRESET ?? "",
      styleMode: options.styleMode ?? process.env.DISCORD_PROFILE_STYLE_MODE ?? "rotate",
      guildId: options.guildId ?? process.env.DISCORD_PROFILE_STYLE_GUILD_ID ?? ""
    };

    this.report = this.createEmptyReport();
    this.runId = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-");
    this.logFile = path.join(this.options.logDir, `${this.runId}.jsonl`);
    this.reportFile = path.join(this.options.logDir, "latest-report.md");
    this.cacheFile = path.join(this.options.logDir, "working-config.json");
    this.rotationFile = path.join(this.options.logDir, "preset-rotation.json");
  }

  public static async initialize(client: any, options?: ServiceOptions): Promise<ServiceReport> {
    const service = new ProfileStyleService(client, options);
    return service.run();
  }

  public async run(): Promise<ServiceReport> {
    await this.ensureLogDirectory();

    try {
      if (process.env.DISCORD_PROFILE_STYLE_ENABLED === "false") {
        await this.writeSummary("Display Name Styles disabled by DISCORD_PROFILE_STYLE_ENABLED=false.");
        return this.report;
      }

      const token = this.client?.token ?? process.env.DISCORD_TOKEN ?? this.client?.config?.token;
      if (!token) {
        await this.writeSummary("No Discord bot token available for Display Name Styles startup task.");
        return this.report;
      }

      this.api = new DiscordProfileAPI(
        token,
        undefined,
        (entry) => this.logApiResponse(entry),
        this.options.maxRetries
      );

      await this.resolveTargetStyle();
      this.report.botTokenSupported = "UNKNOWN";
      this.report.selectedStylePreset = this.selectedStylePreset;
      this.report.availableStylePresets = STYLE_PRESETS;
      this.report.finalTargetConfiguration = this.options.targetStyle;

      const cached = await this.loadWorkingConfig();
      if (cached && !this.options.forceDiscovery) {
        await this.writeSummary("Using saved Display Name Styles configuration from a previous successful run.");
        const responses = await this.applyCachedConfiguration(cached);
        const applied = responses.some((r) => this.isStyleConfirmed(r, this.options.targetStyle));
        if (applied) {
          await this.saveWorkingConfig(this.report.finalWorkingConfiguration ?? cached);
          await this.finalizeReport("Applied saved working configuration.");
          return this.report;
        }
        await this.writeSummary("Saved Display Name Styles configuration failed verification; running fresh discovery.");
      }

      const endpoints = this.getCandidateEndpoints();
      await this.writeSummary(`Starting Display Name Styles discovery with ${endpoints.length} endpoint(s).`);

      const working = await this.detectWorkingConfiguration(endpoints);
      if (working) {
        await this.applyFinalStyle(working);
        await this.saveWorkingConfig(this.report.finalWorkingConfiguration ?? working);
        if (this.options.runCompatibilityTests) {
          await this.runCompatibilityMatrix(working);
          await this.applyFinalStyle(working);
        }
      } else {
        this.report.endpointSupported = "NO";
        this.report.botTokenSupported = this.report.botTokenSupported === "YES" ? "YES" : "NO";
      }

      await this.finalizeReport(working ? "Display Name Styles startup task completed." : "No working Display Name Styles configuration was found.");
    } catch (err: any) {
      await this.logEvent("fatal-error", { message: err.message, stack: err.stack });
      await this.finalizeReport("Display Name Styles startup task failed safely; bot startup continued.");
    }

    return this.report;
  }

  private createEmptyReport(): ServiceReport {
    return {
      title: "Display Name Styles Report",
      generatedAt: new Date().toISOString(),
      endpointSupported: "UNKNOWN",
      botTokenSupported: "UNKNOWN",
      payloadFormat: "UNKNOWN",
      acceptedFontIds: [],
      acceptedEffectIds: [],
      acceptedColors: [],
      finalWorkingConfiguration: null,
      finalTargetConfiguration: null,
      selectedStylePreset: null,
      availableStylePresets: [],
      unsupportedFields: [],
      endpoints: {},
      notes: []
    };
  }

  private async resolveTargetStyle(): Promise<void> {
    if (this.options.targetStyle) {
      this.selectedStylePreset = { key: "custom-options", label: "Custom Options", style: this.options.targetStyle };
      return;
    }

    const envStyle = this.parseEnvironmentStyle();
    if (envStyle) {
      this.options.targetStyle = envStyle;
      this.selectedStylePreset = { key: "custom-env", label: "Custom Environment Style", style: envStyle };
      return;
    }

    const preset = await this.selectPreset();
    this.options.targetStyle = { ...preset.style, colors: [...preset.style.colors] };
    this.selectedStylePreset = preset;
    await this.writeSummary(`Selected Display Name Style preset: ${preset.label} (${preset.key}).`);
  }

  private parseEnvironmentStyle(): Style | null {
    if (process.env.DISCORD_PROFILE_STYLE_JSON) {
      try {
        const style = JSON.parse(process.env.DISCORD_PROFILE_STYLE_JSON);
        if (this.validateStyle(style)) {
          return style;
        }
        this.report.notes.push("DISCORD_PROFILE_STYLE_JSON was present but invalid.");
      } catch (err: any) {
        this.report.notes.push(`DISCORD_PROFILE_STYLE_JSON could not be parsed: ${err.message}`);
      }
    }

    const fontId = process.env.DISCORD_PROFILE_STYLE_FONT_ID ? parseInt(process.env.DISCORD_PROFILE_STYLE_FONT_ID, 10) : NaN;
    const effectId = process.env.DISCORD_PROFILE_STYLE_EFFECT_ID ? parseInt(process.env.DISCORD_PROFILE_STYLE_EFFECT_ID, 10) : NaN;
    const colors = this.parseColorList(process.env.DISCORD_PROFILE_STYLE_COLORS);

    if (!isNaN(fontId) && !isNaN(effectId) && colors) {
      const style: Style = { font_id: fontId, effect_id: effectId, colors };
      if (this.validateStyle(style)) {
        return style;
      }
    }

    return null;
  }

  private parseColorList(value?: string): number[] | null {
    if (!value) return null;
    const split = value.split(",");
    const parsed = split.map((c) => parseInt(c.trim(), 10)).filter((n) => !isNaN(n));
    return parsed.length > 0 ? parsed : null;
  }

  private async selectPreset(): Promise<Preset> {
    const presetKey = this.options.stylePreset.trim().toLowerCase();
    if (presetKey) {
      const preset = STYLE_PRESETS.find((p) => p.key === presetKey || p.label.toLowerCase() === presetKey);
      if (preset) return preset;
      this.report.notes.push(`Unknown Display Name Style preset '${this.options.stylePreset}', falling back to rotation mode.`);
    }

    const mode = this.options.styleMode.toLowerCase();
    if (mode === "random") {
      const index = Math.floor(Math.random() * STYLE_PRESETS.length);
      return STYLE_PRESETS[index];
    }

    if (mode === "fixed") {
      return STYLE_PRESETS[0];
    }

    const state = await this.loadRotationState();
    const index = typeof state.nextIndex === "number" ? state.nextIndex : 1;
    const preset = STYLE_PRESETS[index % STYLE_PRESETS.length];

    await this.saveRotationState({
      nextIndex: (index + 1) % STYLE_PRESETS.length,
      lastPresetKey: preset.key,
      updatedAt: new Date().toISOString()
    });

    return preset;
  }

  private async loadRotationState(): Promise<Partial<RotationState>> {
    try {
      if (fs.existsSync(this.rotationFile)) {
        const text = fs.readFileSync(this.rotationFile, "utf-8");
        return JSON.parse(text);
      }
    } catch {}
    return {};
  }

  private async saveRotationState(state: RotationState): Promise<void> {
    try {
      fs.writeFileSync(this.rotationFile, JSON.stringify(state, null, 2), "utf-8");
    } catch {}
  }

  private validateStyle(style: any): style is Style {
    return (
      style &&
      typeof style.font_id === "number" &&
      typeof style.effect_id === "number" &&
      Array.isArray(style.colors) &&
      style.colors.length >= 1 &&
      style.colors.every((c: any) => typeof c === "number" && c >= 0 && c <= 0xffffff)
    );
  }

  private getCandidateEndpoints(): any[] {
    const guildId = this.options.guildId || this.getGuildIds()[0];
    const endpoints: any[] = [];

    if (guildId) {
      endpoints.push({
        key: "guild-members-me",
        label: "PATCH /guilds/{guild_id}/members/@me",
        endpoint: `/guilds/${guildId}/members/@me`,
        endpointTemplate: "/guilds/{guild_id}/members/@me",
        guildId,
        guildScoped: true,
        payloadFormats: ["B", "A"]
      });
      endpoints.push({
        key: "guild-profile-me",
        label: "PATCH /guilds/{guild_id}/profile/@me",
        endpoint: `/guilds/${guildId}/profile/@me`,
        endpointTemplate: "/guilds/{guild_id}/profile/@me",
        guildId,
        guildScoped: true,
        payloadFormats: ["B", "A"]
      });
    } else {
      this.report.notes.push("No guild id was available, so guild-specific profile endpoints were skipped.");
    }

    endpoints.push({
      key: "users-me",
      label: "PATCH /users/@me",
      endpoint: "/users/@me",
      endpointTemplate: "/users/@me",
      guildId: null,
      guildScoped: false,
      payloadFormats: ["B", "A"]
    });

    return endpoints;
  }

  private getGuildIds(): string[] {
    const cache = this.client?.guilds?.cache;
    if (!cache) return [];
    if (typeof cache.map === "function") {
      return cache.map((g: any) => g.id).filter(Boolean);
    }
    if (typeof cache.values === "function") {
      return Array.from(cache.values()).map((g: any) => g.id).filter(Boolean);
    }
    return [];
  }

  private endpointForGuild(working: WorkingConfig, guildId: string | null): string {
    if (!working.guildScoped || !guildId) return working.endpoint;
    return working.endpointTemplate.replace("{guild_id}", guildId);
  }

  private async detectWorkingConfiguration(endpoints: any[]): Promise<WorkingConfig | null> {
    for (const endpoint of endpoints) {
      for (const payloadFormat of endpoint.payloadFormats ?? Object.keys(PAYLOAD_FORMATS)) {
        const payload = this.buildPayload(payloadFormat, this.options.targetStyle);
        if (!this.validatePayload(payloadFormat, payload)) continue;

        const response = await this.testPayload({
          phase: "endpoint-discovery",
          endpoint,
          payloadFormat,
          payload,
          style: this.options.targetStyle
        });

        this.recordEndpointResult(endpoint, payloadFormat, response);
        if (this.isStyleConfirmed(response, this.options.targetStyle)) {
          const working: WorkingConfig = {
            endpoint: endpoint.endpoint,
            endpointTemplate: endpoint.endpointTemplate,
            endpointLabel: endpoint.label,
            endpointKey: endpoint.key,
            guildId: endpoint.guildId,
            guildScoped: endpoint.guildScoped,
            payloadFormat,
            style: this.options.targetStyle,
            discoveredAt: new Date().toISOString()
          };

          this.report.endpointSupported = "YES";
          this.report.botTokenSupported = "YES";
          this.report.payloadFormat = payloadFormat;
          this.report.finalWorkingConfiguration = working;
          return working;
        }

        if (response.ok) {
          this.report.notes.push(`${endpoint.label} returned ${response.status}, but the response did not confirm Display Name Styles were applied.`);
        }
        this.captureUnsupportedFields(response);
        await new Promise((resolve) => setTimeout(resolve, this.options.requestDelayMs));
      }
    }
    return null;
  }

  private async runCompatibilityMatrix(working: WorkingConfig): Promise<void> {
    await this.writeSummary("Running Display Name Styles compatibility matrix for known fonts, effects, and colors.");

    for (const font of FONTS) {
      const response = await this.testStyleVariant(working, "font", font.label, {
        ...this.options.targetStyle,
        font_id: font.id
      });
      if (response.ok) {
        this.addUnique(this.report.acceptedFontIds, font.id);
      }
      await new Promise((resolve) => setTimeout(resolve, this.options.requestDelayMs));
    }

    for (const effect of EFFECTS) {
      const response = await this.testStyleVariant(working, "effect", effect.label, {
        ...this.options.targetStyle,
        effect_id: effect.id
      });
      if (response.ok) {
        this.addUnique(this.report.acceptedEffectIds, effect.id);
      }
      await new Promise((resolve) => setTimeout(resolve, this.options.requestDelayMs));
    }

    for (const colorTest of COLOR_TESTS) {
      const response = await this.testStyleVariant(working, "color", colorTest.label, {
        ...this.options.targetStyle,
        effect_id: colorTest.colors.length > 1 ? 2 : this.options.targetStyle.effect_id,
        colors: colorTest.colors
      });
      if (response.ok) {
        this.addUnique(this.report.acceptedColors, colorTest.colors.join(","));
      }
      await new Promise((resolve) => setTimeout(resolve, this.options.requestDelayMs));
    }
  }

  private async testStyleVariant(working: WorkingConfig, category: string, label: string, style: Style): Promise<ApiResponse> {
    const payload = this.buildPayload(working.payloadFormat, style);
    return this.testPayload({
      phase: `compatibility-${category}`,
      endpoint: {
        key: working.endpointKey,
        label: working.endpointLabel,
        endpoint: working.endpoint,
        guildId: working.guildId
      },
      payloadFormat: working.payloadFormat,
      payload,
      style,
      label
    });
  }

  private async applyFinalStyle(working: WorkingConfig): Promise<ApiResponse[]> {
    const presetLabel = this.selectedStylePreset?.label ?? "Custom Display Name Style";
    await this.writeSummary(`Applying final target Display Name Style: ${presetLabel}.`);
    const responses = await this.applyStyleToConfiguredScope(working, this.options.targetStyle, "final-apply", presetLabel);
    const confirmed = responses.filter((r) => this.isStyleConfirmed(r, this.options.targetStyle));

    if (confirmed.length > 0) {
      this.report.finalWorkingConfiguration = {
        ...working,
        style: this.options.targetStyle,
        appliedAt: new Date().toISOString(),
        appliedGuildIds: working.guildScoped ? (confirmed.map((r) => r.guildId).filter(Boolean) as string[]) : []
      };
      await this.saveWorkingConfig(this.report.finalWorkingConfiguration);
    }
    return responses;
  }

  private async applyCachedConfiguration(cached: WorkingConfig): Promise<ApiResponse[]> {
    const style = this.options.targetStyle;
    const responses = await this.applyStyleToConfiguredScope(cached, style, "cached-apply", "Saved Working Configuration");

    if (responses.some((r) => this.isStyleConfirmed(r, style))) {
      this.report.endpointSupported = "YES";
      this.report.botTokenSupported = "YES";
      this.report.payloadFormat = cached.payloadFormat;
      this.report.finalWorkingConfiguration = {
        ...cached,
        style,
        appliedAt: new Date().toISOString()
      };
    } else {
      for (const r of responses) {
        this.captureUnsupportedFields(r);
      }
    }
    return responses;
  }

  private async applyStyleToConfiguredScope(
    working: WorkingConfig,
    style: Style,
    phase: string,
    label: string
  ): Promise<ApiResponse[]> {
    const guildIds = working.guildScoped
      ? Array.from(new Set([working.guildId, ...this.getGuildIds()]))
      : [null];

    const responses: ApiResponse[] = [];
    for (const guildId of guildIds) {
      const payload = this.buildPayload(working.payloadFormat, style);
      const endpoint = {
        key: working.endpointKey,
        label: working.endpointLabel,
        endpoint: this.endpointForGuild(working, guildId),
        guildId,
        guildScoped: working.guildScoped
      };

      const response = await this.testPayload({
        phase,
        endpoint,
        payloadFormat: working.payloadFormat,
        payload,
        style,
        label
      });
      response.guildId = guildId;
      responses.push(response);
      await new Promise((resolve) => setTimeout(resolve, this.options.requestDelayMs));
    }
    return responses;
  }

  private isStyleConfirmed(response: ApiResponse, expectedStyle: Style): boolean {
    if (!response?.ok) return false;
    return response.verifiedStyle === true || this.responseContainsStyle(response, expectedStyle);
  }

  private responseContainsStyle(response: ApiResponse, expectedStyle: Style): boolean {
    return this.objectContainsStyle(response.parsed, expectedStyle);
  }

  private objectContainsStyle(value: any, expectedStyle: Style, seen = new Set<any>()): boolean {
    if (!value || typeof value !== "object") return false;
    if (seen.has(value)) return false;
    seen.add(value);

    if (this.styleMatches(value.display_name_styles, expectedStyle)) return true;
    if (this.styleMatches(value, expectedStyle)) return true;

    if (
      value.display_name_font_id === expectedStyle.font_id &&
      value.display_name_effect_id === expectedStyle.effect_id &&
      this.colorsMatch(value.display_name_colors, expectedStyle.colors)
    ) {
      return true;
    }

    for (const key of Object.keys(value)) {
      if (this.objectContainsStyle(value[key], expectedStyle, seen)) return true;
    }

    return false;
  }

  private styleMatches(value: any, expectedStyle: Style): boolean {
    return (
      value &&
      value.font_id === expectedStyle.font_id &&
      value.effect_id === expectedStyle.effect_id &&
      this.colorsMatch(value.colors, expectedStyle.colors)
    );
  }

  private colorsMatch(actual: any, expected: number[]): boolean {
    return (
      Array.isArray(actual) &&
      Array.isArray(expected) &&
      actual.length === expected.length &&
      actual.every((val, index) => val === expected[index])
    );
  }

  private async testPayload(params: {
    phase: string;
    endpoint: any;
    payloadFormat: string;
    payload: any;
    style: Style;
    label?: string;
  }): Promise<ApiResponse> {
    const { phase, endpoint, payloadFormat, payload, style, label } = params;

    await this.logDisplayNameStyleTest({
      phase,
      endpoint,
      payloadFormat,
      payload,
      style,
      label,
      status: "STARTED"
    });

    if (!this.api) throw new Error("DiscordProfileAPI has not been initialized.");
    const response = await this.api.patch(endpoint.endpoint, payload);

    if (response.ok && !this.responseContainsStyle(response, style)) {
      response.verification = await this.verifyAppliedStyle(endpoint, style);
      response.verifiedStyle = response.verification.some((entry) => entry.confirmed);
    } else {
      response.verifiedStyle = this.responseContainsStyle(response, style);
    }

    await this.logDisplayNameStyleTest({
      phase,
      endpoint,
      payloadFormat,
      payload,
      style,
      label,
      status: response.status,
      response,
      result: this.isStyleConfirmed(response, style) ? "SUCCESS_CONFIRMED" : (response.ok ? "SUCCESS_UNCONFIRMED" : "FAILURE")
    });

    if (!response.ok && SUPPORTED_ERROR_STATUSES.has(response.status)) {
      this.report.notes.push(`${endpoint.label} returned ${response.status} during ${phase}.`);
    }

    return response;
  }

  private async verifyAppliedStyle(endpoint: any, style: Style): Promise<any[]> {
    if (!this.api) return [];
    const userId = this.client?.user?.id;
    const checks = ["/users/@me"];
    if (userId) {
      const query = endpoint.guildId ? `?guild_id=${endpoint.guildId}` : "";
      checks.push(`/users/${userId}/profile${query}`);
    }

    const results: any[] = [];
    for (const checkEndpoint of checks) {
      const response = await this.api.get(checkEndpoint, { maxRetries: 1 });
      results.push({
        endpoint: checkEndpoint,
        status: response.status,
        confirmed: this.responseContainsStyle(response, style),
        response
      });
    }

    return results;
  }

  private buildPayload(format: string, style: Style): any {
    return PAYLOAD_FORMATS[format](style);
  }

  private validatePayload(format: string, payload: any): boolean {
    if (!(format in PAYLOAD_FORMATS)) return false;

    const style = format === "A"
      ? payload.display_name_styles
      : {
          font_id: payload.display_name_font_id,
          effect_id: payload.display_name_effect_id,
          colors: payload.display_name_colors
        };

    const valid = this.validateStyle(style);
    if (!valid) {
      this.report.notes.push(`Skipped invalid payload format ${format}.`);
    }
    return valid;
  }

  private recordEndpointResult(endpoint: any, payloadFormat: string, response: ApiResponse): void {
    if (!this.report.endpoints[endpoint.label]) {
      this.report.endpoints[endpoint.label] = {};
    }
    this.report.endpoints[endpoint.label][payloadFormat] = {
      status: response.status,
      supported: this.isStyleConfirmed(response, this.options.targetStyle) ? "YES" : (response.ok ? "UNCONFIRMED" : "NO"),
      rateLimited: response.rateLimited,
      errorCode: response.parsed?.code,
      message: response.parsed?.message ?? response.statusText
    };
  }

  private captureUnsupportedFields(response: ApiResponse): void {
    const fields = this.extractErrorFields(response.parsed?.errors);
    for (const field of fields) {
      this.addUnique(this.report.unsupportedFields, field);
    }
  }

  private extractErrorFields(errors: any, prefix = ""): string[] {
    if (!errors || typeof errors !== "object") return [];

    const fields: string[] = [];
    for (const key of Object.keys(errors)) {
      if (key === "_errors") continue;
      const next = prefix ? `${prefix}.${key}` : key;
      if (errors[key] && errors[key]._errors) {
        fields.push(next);
      }
      fields.push(...this.extractErrorFields(errors[key], next));
    }
    return fields;
  }

  private async ensureLogDirectory(): Promise<void> {
    if (!fs.existsSync(this.options.logDir)) {
      fs.mkdirSync(this.options.logDir, { recursive: true });
    }
  }

  private async logApiResponse(entry: ApiResponse): Promise<void> {
    await this.logEvent("api-response", this.sanitizeLogEntry(entry));
  }

  private async logDisplayNameStyleTest(entry: any): Promise<void> {
    await this.logEvent("display-name-style-test", this.sanitizeLogEntry({
      separator: "━━━━━━━━━━━━━━━━━━",
      title: "Display Name Style Test",
      ...entry
    }));
  }

  private async writeSummary(message: string): Promise<void> {
    this.report.notes.push(message);
    await this.logEvent("summary", { message });
    console.log(`[DisplayNameStyles] ${message} | Main: KyronixStudio | High Partner: dray.me`);
  }

  private async logEvent(type: string, data: any): Promise<void> {
    const entry = {
      type,
      timestamp: new Date().toISOString(),
      data
    };
    try {
      fs.appendFileSync(this.logFile, JSON.stringify(entry) + "\n", "utf-8");
    } catch {}
  }

  private sanitizeLogEntry(entry: any): any {
    if (!entry || typeof entry !== "object") return entry;

    const sanitize = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      } else if (obj && typeof obj === "object") {
        const result: any = {};
        for (const k of Object.keys(obj)) {
          if (k.toLowerCase().includes("authorization")) {
            result[k] = "[REDACTED]";
          } else {
            result[k] = sanitize(obj[k]);
          }
        }
        return result;
      }
      return obj;
    };

    return sanitize(entry);
  }

  private async loadWorkingConfig(): Promise<WorkingConfig | null> {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const text = fs.readFileSync(this.cacheFile, "utf-8");
        const parsed = JSON.parse(text);
        if (parsed.endpoint && parsed.payloadFormat && parsed.style) {
          return this.normalizeWorkingConfig(parsed);
        }
      }
    } catch {}
    return null;
  }

  private async saveWorkingConfig(config: WorkingConfig): Promise<void> {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(config, null, 2), "utf-8");
    } catch {}
  }

  private normalizeWorkingConfig(config: any): WorkingConfig {
    const normalized = { ...config };

    if (normalized.endpoint?.startsWith("/guilds/") && normalized.endpoint.includes("/members/@me")) {
      normalized.guildScoped = true;
      normalized.endpointTemplate = normalized.endpointTemplate ?? "/guilds/{guild_id}/members/@me";
      normalized.endpointLabel = normalized.endpointLabel ?? "PATCH /guilds/{guild_id}/members/@me";
      normalized.endpointKey = normalized.endpointKey ?? "guild-members-me";
    }

    if (normalized.endpoint?.startsWith("/guilds/") && normalized.endpoint.includes("/profile/@me")) {
      normalized.guildScoped = true;
      normalized.endpointTemplate = normalized.endpointTemplate ?? "/guilds/{guild_id}/profile/@me";
      normalized.endpointLabel = normalized.endpointLabel ?? "PATCH /guilds/{guild_id}/profile/@me";
      normalized.endpointKey = normalized.endpointKey ?? "guild-profile-me";
    }

    if (normalized.endpoint === "/users/@me") {
      normalized.guildScoped = false;
      normalized.endpointTemplate = normalized.endpointTemplate ?? "/users/@me";
      normalized.endpointLabel = normalized.endpointLabel ?? "PATCH /users/@me";
      normalized.endpointKey = normalized.endpointKey ?? "users-me";
    }

    return normalized;
  }

  private async finalizeReport(message: string): Promise<void> {
    this.report.generatedAt = new Date().toISOString();
    this.report.notes.push(message);
    try {
      fs.writeFileSync(this.reportFile, this.renderReport(), "utf-8");
    } catch {}
    await this.logEvent("report", this.report);
    console.log(`[DisplayNameStyles] ${message} | Powered by KyronixStudio & dray.me`);
  }

  private renderReport(): string {
    const lines = [
      "# Display Name Styles Report",
      "",
      "## Credits",
      "- **Main Server**: KyronixStudio",
      "- **High Partner**: dray.me",
      "",
      `Generated At: ${this.report.generatedAt}`,
      "",
      `Endpoint Supported: ${this.report.endpointSupported}`,
      `Bot Token Supported: ${this.report.botTokenSupported}`,
      `Payload Format: ${this.report.payloadFormat}`,
      `Selected Preset: ${this.report.selectedStylePreset?.label ?? "UNKNOWN"} (${this.report.selectedStylePreset?.key ?? "UNKNOWN"})`,
      `Accepted Font IDs: ${this.report.acceptedFontIds.length > 0 ? this.report.acceptedFontIds.join(", ") : "UNKNOWN"}`,
      `Accepted Effect IDs: ${this.report.acceptedEffectIds.length > 0 ? this.report.acceptedEffectIds.join(", ") : "UNKNOWN"}`,
      `Accepted Colors: ${this.report.acceptedColors.length > 0 ? this.report.acceptedColors.join(" | ") : "UNKNOWN"}`,
      `Unsupported Fields: ${this.report.unsupportedFields.length > 0 ? this.report.unsupportedFields.join(", ") : "NONE DETECTED"}`,
      "",
      "## Final Working Configuration",
      "```json",
      JSON.stringify(this.report.finalWorkingConfiguration, null, 2),
      "```",
      "",
      "## Final Target Configuration",
      "```json",
      JSON.stringify({ display_name_styles: this.options.targetStyle }, null, 2),
      "```",
      "",
      "## Available Style Presets",
      "```json",
      JSON.stringify(this.report.availableStylePresets, null, 2),
      "```",
      "",
      "## Endpoint Results",
      "```json",
      JSON.stringify(this.report.endpoints, null, 2),
      "```",
      "",
      "## Notes",
      ...this.report.notes.map((note) => `- ${note}`),
      ""
    ];
    return lines.join("\n");
  }

  private addUnique<T>(target: T[], value: T): void {
    if (!target.includes(value)) {
      target.push(value);
    }
  }
}
