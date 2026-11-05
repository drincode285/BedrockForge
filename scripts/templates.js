/* ==========================================================================
   BedrockForge Studio - Boilerplate & Pack Structure Generator
   (scripts/templates.js)
   Generates valid Minecraft: Bedrock Edition BP & RP folder trees, manifests,
   Script API v1 & v2 entrypoints, custom items, blocks, entities, and icons.
   ========================================================================== */

(function() {
  // Generate a valid UUID v4
  window.generateUUIDv4 = function() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Procedurally generate a crisp 64x64 Minecraft-style pixel art pack_icon.png as data URI
  window.generateDefaultPackIcon = function(packType, accentColor) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");

      // Background sky/stone gradient
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, 64, 64);

      // Isometric block top/sides pixel grid
      const topColor = accentColor || (packType === "RP" ? "#38bdf8" : "#10b981");
      ctx.fillStyle = topColor;
      ctx.fillRect(8, 8, 48, 16);

      // Dirt/stone body
      ctx.fillStyle = "#4b5563";
      ctx.fillRect(8, 24, 48, 32);

      // Pixelated grass overhangs
      ctx.fillStyle = topColor;
      for (let x = 8; x < 56; x += 8) {
        if ((x / 8) % 2 === 0) {
          ctx.fillRect(x, 24, 8, 6);
        }
      }

      // Badge text ("BP" or "RP")
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText(packType || "MC", 32, 48);

      // Border
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, 56, 56);

      return canvas.toDataURL("image/png");
    } catch (e) {
      // Fallback 1x1 valid PNG if canvas is unavailable
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    }
  };

  // Build BP manifest.json object
  window.buildBPManifestObject = function(config) {
    const profile = window.resolveVersionProfile(config.mcVersion);
    const engineVer = profile ? profile.engineVersion : [1, 26, 40];

    const modules = [
      {
        description: `${config.addonName} Behavior Data Module`,
        type: "data",
        uuid: config.uuids.bpDataModule,
        version: config.packVersion
      }
    ];

    const dependencies = [];

    // Link RP if packMode is "BOTH" or linkRPDependency enabled
    if (config.packMode === "BOTH" || config.linkCrossDependency) {
      dependencies.push({
        uuid: config.uuids.rpHeader,
        version: config.packVersion
      });
    }

    // Add Script Module if enabled
    if (config.enableScripting) {
      modules.push({
        description: `${config.addonName} Script API Module`,
        language: "javascript",
        type: "script",
        uuid: config.uuids.bpScriptModule,
        version: config.packVersion,
        entry: config.scriptEntry || "scripts/main.js"
      });

      const activeModules = config.modules || {};
      Object.keys(activeModules).forEach(modName => {
        const modCfg = activeModules[modName];
        if (modCfg && modCfg.enabled && modCfg.version) {
          dependencies.push({
            module_name: modName,
            version: modCfg.version
          });
        }
      });
    }

    const manifest = {
      format_version: 2,
      header: {
        name: `${config.addonName} [BP]`,
        description: config.addonDescription,
        uuid: config.uuids.bpHeader,
        version: config.packVersion,
        min_engine_version: engineVer
      },
      modules: modules
    };

    if (dependencies.length > 0) {
      manifest.dependencies = dependencies;
    }

    if (config.enableScriptEval) {
      manifest.capabilities = ["script_eval"];
    }

    const authors = (config.addonAuthor || "").split(",").map(s => s.trim()).filter(Boolean);
    manifest.metadata = {
      authors: authors.length ? authors : ["BedrockCreator"],
      license: config.addonLicense || "MIT",
      generated_with: {
        bedrockforge_studio: ["2.0.0"]
      }
    };

    if (config.addonUrl && config.addonUrl.trim()) {
      manifest.metadata.url = config.addonUrl.trim();
    }

    return manifest;
  };

  // Build RP manifest.json object
  window.buildRPManifestObject = function(config) {
    const profile = window.resolveVersionProfile(config.mcVersion);
    const engineVer = profile ? profile.engineVersion : [1, 26, 40];

    const manifest = {
      format_version: 2,
      header: {
        name: `${config.addonName} [RP]`,
        description: `${config.addonDescription} (Resource Pack)`,
        uuid: config.uuids.rpHeader,
        version: config.packVersion,
        min_engine_version: engineVer
      },
      modules: [
        {
          description: `${config.addonName} Resource Assets`,
          type: "resources",
          uuid: config.uuids.rpResourcesModule,
          version: config.packVersion
        }
      ]
    };

    if (config.packMode === "BOTH" || config.linkCrossDependency) {
      manifest.dependencies = [
        {
          uuid: config.uuids.bpHeader,
          version: config.packVersion
        }
      ];
    }

    const authors = (config.addonAuthor || "").split(",").map(s => s.trim()).filter(Boolean);
    manifest.metadata = {
      authors: authors.length ? authors : ["BedrockCreator"],
      license: config.addonLicense || "MIT",
      generated_with: {
        bedrockforge_studio: ["2.0.0"]
      }
    };

    return manifest;
  };

  // Build Boilerplate Script Entry (scripts/main.js) tailored to v1 vs v2 Script API
  window.buildScriptBoilerplate = function(config) {
    const profile = window.resolveVersionProfile(config.mcVersion);
    const isV2 = profile && profile.scriptApiGeneration === "v2";
    const hasServerUI = config.modules &&
      config.modules["@minecraft/server-ui"] &&
      config.modules["@minecraft/server-ui"].enabled;
    const ns = (config.namespace || "custom").toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const serverVer = (config.modules && config.modules["@minecraft/server"] && config.modules["@minecraft/server"].version) || "2.9.0";
    const uiVer = hasServerUI ? config.modules["@minecraft/server-ui"].version : "N/A";

    let code = `/**
 * ============================================================================
 * ${config.addonName} - Main Script Entrypoint (${config.scriptEntry || "scripts/main.js"})
 * Author: ${config.addonAuthor || "BedrockCreator"}
 * Target Minecraft Bedrock: ${config.mcVersion}
 * @minecraft/server: ${serverVer} | @minecraft/server-ui: ${uiVer}
 * ============================================================================
 */

import { world, system } from "@minecraft/server";
`;

    if (hasServerUI) {
      code += `import { ActionFormData, ModalFormData } from "@minecraft/server-ui";\n`;
    }

    code += `\nconst NAMESPACE = "${ns}";\n\n`;

    if (isV2) {
      code += `// Script API v2.0.0+ executes before the world loads by default.
// Register custom block/item components inside system.beforeEvents.startup:
system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.itemComponentRegistry.registerCustomComponent(\`\${NAMESPACE}:wand_effect\`, {
    onUse(event) {
      const player = event.source;
      if (!player) return;
      player.sendMessage(\`§a[\${NAMESPACE}]§r Activated \${event.itemStack.typeId}!\`);
      ${hasServerUI ? "openAddonDashboard(player);" : ""}
    }
  });

  initEvent.blockComponentRegistry.registerCustomComponent(\`\${NAMESPACE}:interactive_block\`, {
    onPlayerInteract(event) {
      const player = event.player;
      if (!player) return;
      player.sendMessage(\`§b[\${NAMESPACE}]§r Interacted with block at (\${event.block.location.x}, \${event.block.location.y}, \${event.block.location.z})\`);
    }
  });
});

// Subscribe to worldLoad (replaces worldInitialize in Script API 2.0.0+)
world.afterEvents.worldLoad.subscribe(() => {
  console.warn(\`[\${NAMESPACE}] World loaded on Minecraft ${config.mcVersion} (@minecraft/server ${serverVer})\`);
});
`;
    } else {
      code += `// Script API v1.x initialization (Minecraft 1.19.70 - 1.21.80)
world.beforeEvents.worldInitialize.subscribe((initEvent) => {
  if (initEvent.itemComponentRegistry) {
    initEvent.itemComponentRegistry.registerCustomComponent(\`\${NAMESPACE}:wand_effect\`, {
      onUse(event) {
        const player = event.source;
        if (!player) return;
        player.sendMessage(\`§a[\${NAMESPACE}]§r Activated \${event.itemStack.typeId}!\`);
        ${hasServerUI ? "openAddonDashboard(player);" : ""}
      }
    });
  }
});
`;
    }

    code += `
// Welcome message when a player spawns
world.afterEvents.playerSpawn.subscribe((event) => {
  if (!event.initialSpawn) return;
  const player = event.player;
  player.sendMessage(\`§l§a[${config.addonName}]§r §7Loaded for Minecraft ${config.mcVersion}! Use a stick or custom wand to test.\`);
});

// Trigger action when using an item
world.afterEvents.itemUse.subscribe((event) => {
  const { source: player, itemStack } = event;
  if (!player || !itemStack) return;

  if (itemStack.typeId === \`\${NAMESPACE}:aether_wand\` || itemStack.typeId === "minecraft:stick") {
    ${hasServerUI ? "openAddonDashboard(player);" : `player.sendMessage("§e[${config.addonName}]§r Triggered item action!");`}
  }
});
`;

    if (hasServerUI) {
      code += `
/**
 * Displays an interactive @minecraft/server-ui ActionFormData menu to a player
 * @param {import("@minecraft/server").Player} player
 */
function openAddonDashboard(player) {
  const form = new ActionFormData()
    .title("${config.addonName} Menu")
    .body(\`Welcome, §b\${player.name}§r! Choose an add-on action below:\`)
    .button("Speed Boost II (30s)", "textures/items/sugar")
    .button("Night Vision (60s)", "textures/items/potion_bottle_nightVision")
    .button("Configure Settings", "textures/ui/gear");

  form.show(player).then((response) => {
    if (response.canceled) return;
    if (response.selection === 0) {
      player.addEffect("speed", 600, { amplifier: 1, showParticles: true });
      player.sendMessage("§aApplied Speed II for 30 seconds!");
    } else if (response.selection === 1) {
      player.addEffect("night_vision", 1200, { amplifier: 0, showParticles: false });
      player.sendMessage("§bApplied Night Vision for 60 seconds!");
    } else if (response.selection === 2) {
      openSettingsModal(player);
    }
  });
}

function openSettingsModal(player) {
  const modal = new ModalFormData()
    .title("${config.addonName} Settings")
    .textField("Custom Nickname Tag", "Enter tag...", { defaultValue: player.name })
    .slider("Particle Intensity", 1, 10, { valueStep: 1, defaultValue: 5 })
    .toggle("Enable Sound Effects", { defaultValue: true });

  modal.show(player).then((res) => {
    if (res.canceled || !res.formValues) return;
    const [tag, intensity, soundOn] = res.formValues;
    player.nameTag = String(tag || player.name);
    player.sendMessage(\`§aSettings updated! Tag: \${player.nameTag}, Intensity: \${intensity}, Sound: \${soundOn}\`);
  });
}
`;
    }

    return code;
  };

  // Build Default Virtual File System Tree for BP and RP
  window.createDefaultVirtualFiles = function(config) {
    const ns = (config.namespace || "custom").toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const profile = window.resolveVersionProfile(config.mcVersion);
    const engineStr = profile ? profile.engineVersion.join(".") : "1.21.40";
    const bpManifest = window.buildBPManifestObject(config);
    const rpManifest = window.buildRPManifestObject(config);

    const files = {
      BP: {},
      RP: {}
    };

    // --- BEHAVIOR PACK FILES ---
    files.BP["manifest.json"] = {
      type: "json",
      locked: false,
      autoManaged: true,
      content: JSON.stringify(bpManifest, null, 2)
    };

    files.BP["pack_icon.png"] = {
      type: "image",
      locked: false,
      content: window.generateDefaultPackIcon("BP", "#10b981")
    };

    files.BP[config.scriptEntry || "scripts/main.js"] = {
      type: "js",
      locked: false,
      autoManaged: true,
      content: window.buildScriptBoilerplate(config)
    };

    files.BP[`items/${ns}_wand.json`] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        format_version: engineStr,
        "minecraft:item": {
          description: {
            identifier: `${ns}:aether_wand`,
            menu_category: {
              category: "equipment"
            }
          },
          components: {
            "minecraft:icon": `${ns}_aether_wand`,
            "minecraft:display_name": {
              value: `item.${ns}:aether_wand.name`
            },
            "minecraft:max_stack_size": 1,
            "minecraft:hand_equipped": true,
            "minecraft:glint": true,
            "minecraft:custom_components": [
              `${ns}:wand_effect`
            ]
          }
        }
      }, null, 2)
    };

    files.BP[`blocks/${ns}_core_block.json`] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        format_version: engineStr,
        "minecraft:block": {
          description: {
            identifier: `${ns}:core_block`,
            menu_category: {
              category: "construction"
            }
          },
          components: {
            "minecraft:destructible_by_mining": {
              seconds_to_destroy: 1.5
            },
            "minecraft:destructible_by_explosion": {
              explosion_resistance: 10.0
            },
            "minecraft:light_emission": 12,
            "minecraft:map_color": "#10b981",
            "minecraft:custom_components": [
              `${ns}:interactive_block`
            ]
          }
        }
      }, null, 2)
    };

    files.BP[`entities/${ns}_guardian_drone.json`] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        format_version: "1.21.0",
        "minecraft:entity": {
          description: {
            identifier: `${ns}:guardian_drone`,
            is_spawnable: true,
            is_summonable: true,
            is_experimental: false
          },
          components: {
            "minecraft:type_family": {
              family: ["drone", "mob"]
            },
            "minecraft:health": {
              value: 30,
              max: 30
            },
            "minecraft:movement": {
              value: 0.3
            },
            "minecraft:movement.basic": {},
            "minecraft:navigation.walk": {
              can_path_over_water: true
            },
            "minecraft:physics": {}
          }
        }
      }, null, 2)
    };

    files.BP[`recipes/${ns}_wand_recipe.json`] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        format_version: "1.20.10",
        "minecraft:recipe_shaped": {
          description: {
            identifier: `${ns}:aether_wand_recipe`
          },
          tags: ["crafting_table"],
          pattern: [
            "  D",
            " S ",
            "S  "
          ],
          key: {
            D: { item: "minecraft:diamond" },
            S: { item: "minecraft:stick" }
          },
          unlock: [
            { item: "minecraft:diamond" }
          ],
          result: {
            item: `${ns}:aether_wand`,
            count: 1
          }
        }
      }, null, 2)
    };

    files.BP["functions/init.mcfunction"] = {
      type: "text",
      locked: false,
      content: `# ${config.addonName} - Initialization Function\nsay [${config.addonName}] Behavior Pack Function Initialized!\ngive @s ${ns}:aether_wand 1\n`
    };

    files.BP["texts/en_US.lang"] = {
      type: "text",
      locked: false,
      content: `pack.name=${config.addonName} [BP]\npack.description=${config.addonDescription}\n`
    };

    files.BP["texts/languages.json"] = {
      type: "json",
      locked: false,
      content: JSON.stringify(["en_US"], null, 2)
    };

    // --- RESOURCE PACK FILES ---
    files.RP["manifest.json"] = {
      type: "json",
      locked: false,
      autoManaged: true,
      content: JSON.stringify(rpManifest, null, 2)
    };

    files.RP["pack_icon.png"] = {
      type: "image",
      locked: false,
      content: window.generateDefaultPackIcon("RP", "#38bdf8")
    };

    files.RP["textures/item_texture.json"] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        resource_pack_name: ns,
        texture_name: "atlas.items",
        texture_data: {
          [`${ns}_aether_wand`]: {
            textures: `textures/items/${ns}_wand`
          }
        }
      }, null, 2)
    };

    files.RP["textures/terrain_texture.json"] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        resource_pack_name: ns,
        texture_name: "atlas.terrain",
        padding: 8,
        num_mip_levels: 4,
        texture_data: {
          [`${ns}_core_block`]: {
            textures: `textures/blocks/${ns}_core_block`
          }
        }
      }, null, 2)
    };

    files.RP[`textures/items/${ns}_wand.png`] = {
      type: "image",
      locked: false,
      content: window.generateDefaultPackIcon("IT", "#a855f7")
    };

    files.RP[`textures/blocks/${ns}_core_block.png`] = {
      type: "image",
      locked: false,
      content: window.generateDefaultPackIcon("BK", "#f59e0b")
    };

    files.RP["blocks.json"] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        format_version: [1, 1, 0],
        [`${ns}:core_block`]: {
          textures: `${ns}_core_block`,
          sound: "stone"
        }
      }, null, 2)
    };

    files.RP["sounds/sound_definitions.json"] = {
      type: "json",
      locked: false,
      content: JSON.stringify({
        format_version: "1.20.20",
        sound_definitions: {}
      }, null, 2)
    };

    files.RP["texts/en_US.lang"] = {
      type: "text",
      locked: false,
      content: [
        `pack.name=${config.addonName} [RP]`,
        `pack.description=${config.addonDescription} (Resources)`,
        `item.${ns}:aether_wand.name=Aether Wand`,
        `tile.${ns}:core_block.name=Aether Core Block`,
        `entity.${ns}:guardian_drone.name=Guardian Drone`
      ].join("\n")
    };

    files.RP["texts/languages.json"] = {
      type: "json",
      locked: false,
      content: JSON.stringify(["en_US"], null, 2)
    };

    return files;
  };
})();
