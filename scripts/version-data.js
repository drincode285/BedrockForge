/* ==========================================================================
   BedrockForge Studio - Official Minecraft Bedrock Version & Module Registry
   (scripts/version-data.js)
   Grounded in Microsoft Learn Creator Documentation & Script API Changelogs
   ========================================================================== */

window.BEDROCK_VERSION_DB = [
  {
    mcVersion: "1.26.70 (Preview / Latest)",
    engineVersion: [1, 26, 70],
    releaseChannel: "Preview",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.11.0", beta: "2.13.0-beta" },
      "@minecraft/server-ui": { stable: "2.4.0", beta: "2.5.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Latest Preview drop: adds @minecraft/server 2.13.0-beta, @minecraft/server-ui 2.4.0 stable & 2.5.0-beta, POI manager, and WorldClock APIs."
  },
  {
    mcVersion: "1.26.50",
    engineVersion: [1, 26, 50],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.10.0", beta: "2.11.0-beta" },
      "@minecraft/server-ui": { stable: "2.2.0", beta: "2.3.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Releases custom dimension JSON support and promotes @minecraft/server 2.10.0 (Camera shake, BlockDynamicProperties, SoundDefinitionRegistry) to stable."
  },
  {
    mcVersion: "1.26.40",
    engineVersion: [1, 26, 40],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.9.0", beta: "2.10.0-beta" },
      "@minecraft/server-ui": { stable: "2.1.0", beta: "2.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.9.0 stable (Block.getParts, calculateClosestBiomeFromSeed, PlayerStartBreakingBlockAfterEvent) and @minecraft/server-ui 2.2.0-beta."
  },
  {
    mcVersion: "1.26.30",
    engineVersion: [1, 26, 30],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.8.0", beta: "2.9.0-beta" },
      "@minecraft/server-ui": { stable: "2.1.0", beta: "2.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.8.0 stable (LocatorBar, Waypoint, PrimitiveShapesManager, BlockContainerOpenedAfterEvent)."
  },
  {
    mcVersion: "1.26.20",
    engineVersion: [1, 26, 20],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.7.0", beta: "2.8.0-beta" },
      "@minecraft/server-ui": { stable: "2.1.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.7.0 stable (BiomeTypes, BiomeType.getTags, Entity.addItem) and 3D World Text Primitives in beta."
  },
  {
    mcVersion: "1.26.10",
    engineVersion: [1, 26, 10],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.6.0", beta: "2.7.0-beta" },
      "@minecraft/server-ui": { stable: "2.1.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.6.0 stable (Camera splines, attachToEntity, AimAssistRegistry, TickingAreaManager, EntityHeal/Hurt events)."
  },
  {
    mcVersion: "1.26.0",
    engineVersion: [1, 26, 0],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.5.0", beta: "2.6.0-beta" },
      "@minecraft/server-ui": { stable: "2.1.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.5.0 stable (PlayerSwingStartAfterEvent, RedstoneProducer, MapColor block components)."
  },
  {
    mcVersion: "1.21.130",
    engineVersion: [1, 21, 130],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.4.0", beta: "2.5.0-beta" },
      "@minecraft/server-ui": { stable: "2.0.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.4.0 stable (LootTable APIs, Potions, Player.getControlScheme) and introduces @minecraft/server-graphics."
  },
  {
    mcVersion: "1.21.120",
    engineVersion: [1, 21, 120],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: true,
    modules: {
      "@minecraft/server": { stable: "2.3.0", beta: "2.4.0-beta" },
      "@minecraft/server-ui": { stable: "2.0.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.3.0 stable (Dimension.getBiome, light detection APIs, setDynamicProperties) and allows version: 'beta' in manifest.json."
  },
  {
    mcVersion: "1.21.110",
    engineVersion: [1, 21, 110],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "2.2.0", beta: "2.3.0-beta" },
      "@minecraft/server-ui": { stable: "2.0.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.2.0 stable (LootTableManager, ItemBookComponent, Camera.setFov, getRawLore)."
  },
  {
    mcVersion: "1.21.100",
    engineVersion: [1, 21, 100],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "2.1.0", beta: "2.2.0-beta" },
      "@minecraft/server-ui": { stable: "2.0.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 2.1.0 stable (CustomCommandRegistry, PlayerInventoryItemChangeAfterEvent, Hunger/Saturation components)."
  },
  {
    mcVersion: "1.21.90",
    engineVersion: [1, 21, 90],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v2",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "2.0.0", beta: "2.1.0-beta" },
      "@minecraft/server-ui": { stable: "2.0.0", beta: "2.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "First stable release of Script API v2.0.0 (@minecraft/server 2.0.0 & @minecraft/server-ui 2.0.0). Uses worldLoad event and StartupEvent."
  },
  {
    mcVersion: "1.21.80",
    engineVersion: [1, 21, 80],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.19.0", beta: "2.0.0-beta" },
      "@minecraft/server-ui": { stable: "1.3.0", beta: "2.0.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.19.0 stable (placeFeature, placeJigsawStructure, World.setDifficulty) and v2.0.0-beta."
  },
  {
    mcVersion: "1.21.70",
    engineVersion: [1, 21, 70],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.18.0", beta: "2.0.0-beta" },
      "@minecraft/server-ui": { stable: "1.3.0", beta: "2.0.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Spring to Life update: ships @minecraft/server 1.18.0 stable and introduces Script API 2.0.0-beta track."
  },
  {
    mcVersion: "1.21.60",
    engineVersion: [1, 21, 60],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.17.0", beta: "1.18.0-beta" },
      "@minecraft/server-ui": { stable: "1.3.0", beta: "1.4.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Official Microsoft Learn table mapping: Minecraft 1.21.60 ships @minecraft/server 1.17.0 stable."
  },
  {
    mcVersion: "1.21.50",
    engineVersion: [1, 21, 50],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.16.0", beta: "1.17.0-beta" },
      "@minecraft/server-ui": { stable: "1.3.0", beta: "1.4.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "The Garden Awakens update: ships @minecraft/server 1.16.0 stable."
  },
  {
    mcVersion: "1.21.40",
    engineVersion: [1, 21, 40],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.15.0", beta: "1.16.0-beta" },
      "@minecraft/server-ui": { stable: "1.3.0", beta: "1.4.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Bundles of Bravery update: ships @minecraft/server 1.15.0 stable (World.isHardcore, EntityBreathableComponent)."
  },
  {
    mcVersion: "1.21.30",
    engineVersion: [1, 21, 30],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.14.0", beta: "1.15.0-beta" },
      "@minecraft/server-ui": { stable: "1.3.0", beta: "1.4.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.14.0 stable and @minecraft/server-ui 1.3.0 stable (UIManager.closeAllForms)."
  },
  {
    mcVersion: "1.21.20",
    engineVersion: [1, 21, 20],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.13.0", beta: "1.14.0-beta" },
      "@minecraft/server-ui": { stable: "1.2.0", beta: "1.3.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.13.0 stable and @minecraft/server-ui 1.2.0 stable (ModalFormData.submitButton)."
  },
  {
    mcVersion: "1.21.0",
    engineVersion: [1, 21, 0],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.11.0", beta: "1.12.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Tricky Trials update: ships @minecraft/server 1.11.0 stable (Custom Components V1 for blocks and items)."
  },
  {
    mcVersion: "1.20.80",
    engineVersion: [1, 20, 80],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.10.0", beta: "1.11.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Armored Paws update: ships @minecraft/server 1.10.0 stable."
  },
  {
    mcVersion: "1.20.70",
    engineVersion: [1, 20, 70],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.9.0", beta: "1.10.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.9.0 stable."
  },
  {
    mcVersion: "1.20.60",
    engineVersion: [1, 20, 60],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.8.0", beta: "1.9.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.8.0 stable."
  },
  {
    mcVersion: "1.20.50",
    engineVersion: [1, 20, 50],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.7.0", beta: "1.8.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Bats and Pots update: ships @minecraft/server 1.7.0 stable."
  },
  {
    mcVersion: "1.20.40",
    engineVersion: [1, 20, 40],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.6.0", beta: "1.7.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.6.0 stable."
  },
  {
    mcVersion: "1.20.30",
    engineVersion: [1, 20, 30],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.5.0", beta: "1.6.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.5.0 stable."
  },
  {
    mcVersion: "1.20.20",
    engineVersion: [1, 20, 20],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.4.0", beta: "1.5.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.4.0 stable."
  },
  {
    mcVersion: "1.20.10",
    engineVersion: [1, 20, 10],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.3.0", beta: "1.4.0-beta" },
      "@minecraft/server-ui": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.3.0 stable and @minecraft/server-ui 1.1.0 stable."
  },
  {
    mcVersion: "1.20.0",
    engineVersion: [1, 20, 0],
    releaseChannel: "Stable",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.2.0", beta: "1.3.0-beta" },
      "@minecraft/server-ui": { stable: "1.0.0", beta: "1.1.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Trails & Tales update: ships @minecraft/server 1.2.0 stable and first stable @minecraft/server-ui 1.0.0."
  },
  {
    mcVersion: "1.19.80",
    engineVersion: [1, 19, 80],
    releaseChannel: "Legacy",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.1.0", beta: "1.2.0-beta" },
      "@minecraft/server-ui": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "Ships @minecraft/server 1.1.0 stable; @minecraft/server-ui requires 1.0.0-beta."
  },
  {
    mcVersion: "1.19.70",
    engineVersion: [1, 19, 70],
    releaseChannel: "Legacy",
    manifestFormatVersion: 2,
    scriptApiGeneration: "v1",
    supportsBetaWildcard: false,
    modules: {
      "@minecraft/server": { stable: "1.0.0", beta: "1.1.0-beta" },
      "@minecraft/server-ui": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-gametest": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-net": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/server-admin": { stable: null, beta: "1.0.0-beta" },
      "@minecraft/debug-utilities": { stable: null, beta: "1.0.0-beta" }
    },
    notes: "First stable release of @minecraft/server (1.0.0)."
  }
];

window.ALL_MODULE_VERSIONS = {
  "@minecraft/server": [
    "2.13.0-beta", "2.11.0", "2.11.0-beta", "2.10.0", "2.10.0-beta",
    "2.9.0", "2.9.0-beta", "2.8.0", "2.8.0-beta", "2.7.0", "2.7.0-beta",
    "2.6.0", "2.6.0-beta", "2.5.0", "2.5.0-beta", "2.4.0", "2.4.0-beta",
    "2.3.0", "2.3.0-beta", "2.2.0", "2.2.0-beta", "2.1.0", "2.1.0-beta",
    "2.0.0", "2.0.0-beta", "1.19.0", "1.18.0", "1.18.0-beta", "1.17.0",
    "1.16.0", "1.15.0", "1.14.0", "1.13.0", "1.12.0", "1.11.0", "1.10.0",
    "1.9.0", "1.8.0", "1.7.0", "1.6.0", "1.5.0", "1.4.0", "1.3.0", "1.2.0",
    "1.1.0", "1.0.0", "beta"
  ],
  "@minecraft/server-ui": [
    "2.5.0-beta", "2.4.0", "2.3.0", "2.3.0-beta", "2.2.0", "2.2.0-beta",
    "2.1.0", "2.1.0-beta", "2.0.0", "2.0.0-beta", "1.4.0-beta", "1.3.0",
    "1.3.0-beta", "1.2.0", "1.2.0-beta", "1.1.0", "1.1.0-beta", "1.0.0",
    "1.0.0-beta", "beta"
  ],
  "@minecraft/server-gametest": ["1.0.0-beta", "beta"],
  "@minecraft/server-net": ["1.0.0-beta", "beta"],
  "@minecraft/server-admin": ["1.0.0-beta", "beta"],
  "@minecraft/debug-utilities": ["1.0.0-beta", "beta"]
};

window.resolveVersionProfile = function(mcVersionString) {
  return window.BEDROCK_VERSION_DB.find(v => v.mcVersion === mcVersionString) || window.BEDROCK_VERSION_DB[2];
};
