# BedrockForge Studio — Minecraft: Bedrock Edition Add-On Generator

A pure-frontend web application for creating, customizing, editing, and exporting **Minecraft: Bedrock Edition** Behavior Packs (`.mcpack`), Resource Packs (`.mcpack`), and bundled Add-Ons (`.mcaddon`).

## Project Folder Structure

```text
minecraft-bedrock-addon-generator/
├── index.html               # Main Add-On Builder Studio page
├── docs.html                # Script API Version Matrix & Bedrock Documentation page
├── README.md                # Project documentation & usage instructions
├── css/
│   ├── styles.css           # Core layout, dark studio theme, typography, responsive grid
│   └── components.css       # File tree explorer, version cards, code editor, modals, dropzone
└── scripts/
    ├── version-data.js      # Official Minecraft Bedrock 1.19.70 – 1.26.70 Script API registry
    ├── templates.js         # BP/RP manifest & boilerplate generator (Script API v1 & v2)
    ├── zip-builder.js       # Pure client-side binary ZIP / .mcpack / .mcaddon encoder
    ├── storage.js           # localStorage state persistence & auto-save manager
    └── app.js               # Main UI controller, file uploader (.png/.json/.js), and exporter
```

## Key Features

1. **Flexible Pack Generation (`BP`, `RP`, or Combined `.mcaddon`)**
   - Generate standalone Behavior Packs (`_BP.mcpack`), standalone Resource Packs (`_RP.mcpack`), combined `.mcaddon` packages, or development folder `.zip` archives.
2. **Automatic Minecraft Version to Script API Module Resolver**
   - Select your target Minecraft: Bedrock Edition version (`1.19.70` through `1.26.70`), and the studio automatically configures `min_engine_version`, `@minecraft/server`, `@minecraft/server-ui`, `@minecraft/server-gametest`, `@minecraft/server-net`, `@minecraft/server-admin`, and `@minecraft/debug-utilities`, while adapting the generated `scripts/main.js` boilerplate between Script API v1 (`worldInitialize`) and Script API v2 (`system.beforeEvents.startup` + `worldLoad`).
3. **Complete Virtual File System & Boilerplate Templates**
   - Includes ready-to-run `manifest.json`, procedural pixel-art `pack_icon.png`, `scripts/main.js`, custom items, custom blocks, custom entities, crafting recipes, `.mcfunction` files, texture atlases (`item_texture.json`, `terrain_texture.json`), and `en_US.lang` files.
4. **Frontend File Upload (`.png`, `.json`, `.js`, `.mcfunction`, `.lang`)**
   - Drag and drop or browse to upload custom textures, JSON definitions, or JavaScript files directly into your Behavior Pack or Resource Pack tree.
5. **LocalStorage Persistence**
   - Every change to metadata, module versions, code files, or uploaded PNG textures is automatically saved to `localStorage` so nothing is lost on page refresh.
