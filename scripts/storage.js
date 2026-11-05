/* ==========================================================================
   BedrockForge Studio - LocalStorage State Persistence Manager
   (scripts/storage.js)
   Automatically saves & restores Add-On configuration, UUIDs, custom uploaded
   files (.png, .json, .js), and active editor state across page reloads.
   ========================================================================== */

(function() {
  const STORAGE_KEY = "bedrockforge_studio_state_v2";

  window.getDefaultStudioState = function() {
    const defaultMcVersion = "1.26.40";
    const profile = window.resolveVersionProfile(defaultMcVersion);

    const config = {
      packMode: "BOTH", // "BP", "RP", or "BOTH"
      addonName: "Aether Guardians",
      namespace: "aether",
      addonDescription: "Custom Minecraft Bedrock Add-On with Script API, items, blocks, and UI forms.",
      addonAuthor: "BedrockCreator",
      addonLicense: "MIT",
      addonUrl: "",
      packVersion: [1, 0, 0],
      mcVersion: defaultMcVersion,
      releaseTrack: "stable", // "stable", "beta", or "wildcard"
      autoMatchModules: true,
      enableScripting: true,
      enableScriptEval: false,
      linkCrossDependency: true,
      scriptEntry: "scripts/main.js",
      uuids: {
        bpHeader: window.generateUUIDv4(),
        bpDataModule: window.generateUUIDv4(),
        bpScriptModule: window.generateUUIDv4(),
        rpHeader: window.generateUUIDv4(),
        rpResourcesModule: window.generateUUIDv4()
      },
      modules: {
        "@minecraft/server": {
          enabled: true,
          version: profile.modules["@minecraft/server"].stable
        },
        "@minecraft/server-ui": {
          enabled: true,
          version: profile.modules["@minecraft/server-ui"].stable
        },
        "@minecraft/server-gametest": {
          enabled: false,
          version: "1.0.0-beta"
        },
        "@minecraft/server-net": {
          enabled: false,
          version: "1.0.0-beta"
        },
        "@minecraft/server-admin": {
          enabled: false,
          version: "1.0.0-beta"
        },
        "@minecraft/debug-utilities": {
          enabled: false,
          version: "1.0.0-beta"
        }
      }
    };

    const files = window.createDefaultVirtualFiles(config);

    return {
      config,
      files,
      activePack: "BP",
      activePath: "manifest.json",
      lastSavedAt: new Date().toISOString()
    };
  };

  window.loadStudioState = function() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return window.getDefaultStudioState();
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.config || !parsed.files) {
        return window.getDefaultStudioState();
      }
      return parsed;
    } catch (err) {
      console.warn("LocalStorage unavailable or corrupted, using default state:", err);
      return window.getDefaultStudioState();
    }
  };

  window.saveStudioState = function(state) {
    try {
      state.lastSavedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
      return false;
    }
  };

  window.resetStudioState = function() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
    return window.getDefaultStudioState();
  };
})();
