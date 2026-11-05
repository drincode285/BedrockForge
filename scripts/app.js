/* ==========================================================================
   BedrockForge Studio - Main Application Controller (scripts/app.js)
   Handles Minecraft version selection, automatic Script API module matching,
   virtual file system tree, live code/image editor, file upload (.png/.json/.js),
   localStorage auto-save, and .mcpack / .mcaddon export.
   ========================================================================== */

(function() {
  let state = null;

  function showToast(message, borderColor) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    if (borderColor) toast.style.borderLeftColor = borderColor;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  function updateSaveIndicator() {
    const el = document.getElementById("saveStatusText");
    if (!el || !state) return;
    const timeStr = new Date(state.lastSavedAt || Date.now()).toLocaleTimeString();
    el.textContent = `Saved to localStorage (${timeStr})`;
  }

  // Synchronize manifest.json and scripts/main.js when config changes
  function syncAutoManagedFiles(regenerateScript) {
    const cfg = state.config;
    const bpManifest = window.buildBPManifestObject(cfg);
    const rpManifest = window.buildRPManifestObject(cfg);

    if (state.files.BP["manifest.json"]) {
      state.files.BP["manifest.json"].content = JSON.stringify(bpManifest, null, 2);
    }
    if (state.files.RP["manifest.json"]) {
      state.files.RP["manifest.json"].content = JSON.stringify(rpManifest, null, 2);
    }

    const entryPath = cfg.scriptEntry || "scripts/main.js";
    if (regenerateScript || (state.files.BP[entryPath] && state.files.BP[entryPath].autoManaged)) {
      state.files.BP[entryPath] = {
        type: "js",
        locked: false,
        autoManaged: true,
        content: window.buildScriptBoilerplate(cfg)
      };
    }

    window.saveStudioState(state);
    updateSaveIndicator();
  }

  // Apply Minecraft version -> module version auto-resolution
  function applyMinecraftVersionMapping() {
    const cfg = state.config;
    const profile = window.resolveVersionProfile(cfg.mcVersion);
    if (!profile) return;

    if (cfg.autoMatchModules) {
      Object.keys(cfg.modules).forEach(modName => {
        const modInfo = profile.modules[modName];
        if (!modInfo) return;
        if (cfg.releaseTrack === "wildcard" && profile.supportsBetaWildcard) {
          cfg.modules[modName].version = "beta";
        } else if (cfg.releaseTrack === "beta") {
          cfg.modules[modName].version = modInfo.beta || modInfo.stable || "1.0.0-beta";
        } else {
          // Stable track preferred; fallback to beta if module is beta-only
          cfg.modules[modName].version = modInfo.stable || modInfo.beta || "1.0.0-beta";
        }
      });
    }
  }

  // Render Minecraft Version dropdown
  function populateMcVersionDropdown() {
    const select = document.getElementById("mcVersionSelect");
    if (!select) return;
    select.innerHTML = "";
    window.BEDROCK_VERSION_DB.forEach(entry => {
      const opt = document.createElement("option");
      opt.value = entry.mcVersion;
      const srv = entry.modules["@minecraft/server"].stable || entry.modules["@minecraft/server"].beta;
      const ui = entry.modules["@minecraft/server-ui"].stable || entry.modules["@minecraft/server-ui"].beta;
      opt.textContent = `Minecraft ${entry.mcVersion}  →  server ${srv} | ui ${ui}`;
      if (entry.mcVersion === state.config.mcVersion) opt.selected = true;
      select.appendChild(opt);
    });
  }

  // Render Version Resolution Summary Card & Module List
  function renderVersionAndModuleControls() {
    const cfg = state.config;
    const profile = window.resolveVersionProfile(cfg.mcVersion);

    const badgeEngine = document.getElementById("badgeMinEngine");
    const badgeApiGen = document.getElementById("badgeApiGen");
    const badgeServerVer = document.getElementById("badgeServerVer");
    const badgeUiVer = document.getElementById("badgeUiVer");
    const versionNotes = document.getElementById("versionReleaseNotes");

    if (profile) {
      if (badgeEngine) badgeEngine.textContent = `min_engine: [${profile.engineVersion.join(", ")}]`;
      if (badgeApiGen) badgeApiGen.textContent = `Script API: ${profile.scriptApiGeneration.toUpperCase()}`;
      if (badgeServerVer) badgeServerVer.textContent = `@minecraft/server: ${cfg.modules["@minecraft/server"].version}`;
      if (badgeUiVer) badgeUiVer.textContent = `@minecraft/server-ui: ${cfg.modules["@minecraft/server-ui"].version}`;
      if (versionNotes) versionNotes.textContent = profile.notes;
    }

    const moduleListEl = document.getElementById("moduleListContainer");
    if (!moduleListEl) return;
    moduleListEl.innerHTML = "";

    Object.keys(cfg.modules).forEach(modName => {
      const modState = cfg.modules[modName];
      const row = document.createElement("div");
      row.className = "module-item";

      const left = document.createElement("div");
      left.className = "module-item-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !!modState.enabled;
      checkbox.disabled = !cfg.enableScripting;
      checkbox.addEventListener("change", () => {
        cfg.modules[modName].enabled = checkbox.checked;
        syncAutoManagedFiles(false);
        renderEditorArea();
      });

      const label = document.createElement("span");
      label.className = "module-item-name";
      label.textContent = modName;

      left.appendChild(checkbox);
      left.appendChild(label);

      const verSelect = document.createElement("select");
      verSelect.className = "module-item-select";
      verSelect.disabled = !cfg.enableScripting || cfg.autoMatchModules;

      const versions = window.ALL_MODULE_VERSIONS[modName] || [modState.version];
      versions.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        if (v === modState.version) opt.selected = true;
        verSelect.appendChild(opt);
      });

      verSelect.addEventListener("change", () => {
        cfg.modules[modName].version = verSelect.value;
        syncAutoManagedFiles(false);
        renderVersionAndModuleControls();
        renderEditorArea();
      });

      row.appendChild(left);
      row.appendChild(verSelect);
      moduleListEl.appendChild(row);
    });
  }

  // Bind Form Inputs to State
  function syncFormInputsFromState() {
    const cfg = state.config;
    document.querySelectorAll(".pack-mode-card").forEach(card => {
      card.classList.toggle("active", card.dataset.mode === cfg.packMode);
    });

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!val;
    };

    setVal("addonNameInput", cfg.addonName);
    setVal("namespaceInput", cfg.namespace);
    setVal("addonDescInput", cfg.addonDescription);
    setVal("addonAuthorInput", cfg.addonAuthor);
    setVal("addonLicenseSelect", cfg.addonLicense);
    setVal("packVerMajor", cfg.packVersion[0]);
    setVal("packVerMinor", cfg.packVersion[1]);
    setVal("packVerPatch", cfg.packVersion[2]);
    setVal("mcVersionSelect", cfg.mcVersion);
    setVal("releaseTrackSelect", cfg.releaseTrack);
    setVal("scriptEntryInput", cfg.scriptEntry);

    setChk("autoMatchModulesCheck", cfg.autoMatchModules);
    setChk("enableScriptingCheck", cfg.enableScripting);
    setChk("enableScriptEvalCheck", cfg.enableScriptEval);
    setChk("linkCrossDepCheck", cfg.linkCrossDependency);

    setVal("uuidBpHeader", cfg.uuids.bpHeader);
    setVal("uuidBpData", cfg.uuids.bpDataModule);
    setVal("uuidBpScript", cfg.uuids.bpScriptModule);
    setVal("uuidRpHeader", cfg.uuids.rpHeader);
    setVal("uuidRpResources", cfg.uuids.rpResourcesModule);
  }

  // Render File Tree Explorer
  function renderFileTree() {
    const container = document.getElementById("fileTreeContainer");
    if (!container) return;
    container.innerHTML = "";

    const packsToShow = [];
    if (state.config.packMode === "BP" || state.config.packMode === "BOTH") packsToShow.push("BP");
    if (state.config.packMode === "RP" || state.config.packMode === "BOTH") packsToShow.push("RP");

    if (!packsToShow.includes(state.activePack)) {
      state.activePack = packsToShow[0];
      state.activePath = "manifest.json";
    }

    packsToShow.forEach(packKey => {
      const packHeader = document.createElement("div");
      packHeader.className = "tree-pack-header";
      const folderSlug = `${state.config.addonName.replace(/[^a-zA-Z0-9_-]/g, "_")}_${packKey}`;
      packHeader.innerHTML = `<span>📦 ${folderSlug}/</span><span class="badge ${packKey === "BP" ? "badge-emerald" : "badge-sky"}">${packKey}</span>`;
      container.appendChild(packHeader);

      const packFiles = state.files[packKey] || {};
      const sortedPaths = Object.keys(packFiles).sort((a, b) => {
        const aDepth = a.split("/").length;
        const bDepth = b.split("/").length;
        if (aDepth !== bDepth) return aDepth - bDepth;
        return a.localeCompare(b);
      });

      const grouped = {};
      sortedPaths.forEach(p => {
        const parts = p.split("/");
        const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : "(root)";
        if (!grouped[dir]) grouped[dir] = [];
        grouped[dir].push(p);
      });

      Object.keys(grouped).forEach(dir => {
        if (dir !== "(root)") {
          const folderEl = document.createElement("div");
          folderEl.className = "tree-folder-label";
          folderEl.textContent = `📁 ${dir}/`;
          container.appendChild(folderEl);
        }

        grouped[dir].forEach(filePath => {
          const fileObj = packFiles[filePath];
          const item = document.createElement("div");
          item.className = "tree-file" + (state.activePack === packKey && state.activePath === filePath ? " active" : "");

          const fileName = filePath.split("/").pop();
          const icon = fileObj.type === "image" ? "🖼️" : (fileObj.type === "js" ? "📜" : (fileObj.type === "json" ? "🧩" : "📄"));

          item.innerHTML = `
            <span class="tree-file-name">${icon} ${fileName}</span>
            <span class="tree-file-tag">${fileObj.type.toUpperCase()}</span>
          `;

          item.addEventListener("click", () => {
            state.activePack = packKey;
            state.activePath = filePath;
            window.saveStudioState(state);
            renderFileTree();
            renderEditorArea();
          });

          container.appendChild(item);
        });
      });
    });
  }

  // Render Code or Image Editor
  function renderEditorArea() {
    const packFiles = state.files[state.activePack] || {};
    const fileObj = packFiles[state.activePath];

    const pathLabel = document.getElementById("activeFilePathLabel");
    const codeWrap = document.getElementById("codeEditorWrapper");
    const imgWrap = document.getElementById("imagePreviewWrapper");
    const textarea = document.getElementById("codeEditorTextarea");
    const previewImg = document.getElementById("previewImageElement");
    const imgMeta = document.getElementById("previewImageMeta");

    if (!fileObj) {
      if (pathLabel) pathLabel.textContent = "No file selected";
      return;
    }

    if (pathLabel) {
      pathLabel.textContent = `${state.activePack}/${state.activePath}`;
    }

    if (fileObj.type === "image") {
      codeWrap.style.display = "none";
      imgWrap.style.display = "flex";
      previewImg.src = fileObj.content;
      imgMeta.textContent = `${state.activePack}/${state.activePath} (PNG Texture / Pack Icon)`;
    } else {
      codeWrap.style.display = "block";
      imgWrap.style.display = "none";
      textarea.value = fileObj.content || "";
    }
  }

  // Handle File Uploads (.png, .json, .js, .lang, .mcfunction)
  function handleUploadedFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    const targetPack = document.getElementById("uploadTargetPackSelect").value || state.activePack || "BP";
    const customSubfolder = (document.getElementById("uploadSubfolderInput").value || "").trim().replace(/^\/+|\/+$/g, "");

    Array.from(fileList).forEach(file => {
      const ext = file.name.split(".").pop().toLowerCase();
      let defaultDir = "";
      if (ext === "png") {
        defaultDir = file.name === "pack_icon.png" ? "" : (targetPack === "RP" ? "textures/items" : "");
      } else if (ext === "js") {
        defaultDir = "scripts";
      } else if (ext === "json") {
        defaultDir = file.name === "manifest.json" ? "" : (targetPack === "BP" ? "items" : "models/entity");
      } else if (ext === "mcfunction") {
        defaultDir = "functions";
      } else if (ext === "lang") {
        defaultDir = "texts";
      }

      const folder = customSubfolder !== "" ? customSubfolder : defaultDir;
      const finalPath = folder ? `${folder}/${file.name}` : file.name;

      const reader = new FileReader();
      if (ext === "png" || file.type.startsWith("image/")) {
        reader.onload = function(evt) {
          state.files[targetPack][finalPath] = {
            type: "image",
            locked: false,
            autoManaged: false,
            content: evt.target.result
          };
          state.activePack = targetPack;
          state.activePath = finalPath;
          window.saveStudioState(state);
          updateSaveIndicator();
          renderFileTree();
          renderEditorArea();
          showToast(`Uploaded ${targetPack}/${finalPath}`);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = function(evt) {
          const fType = ext === "js" ? "js" : (ext === "json" ? "json" : "text");
          state.files[targetPack][finalPath] = {
            type: fType,
            locked: false,
            autoManaged: false,
            content: evt.target.result
          };
          state.activePack = targetPack;
          state.activePath = finalPath;
          window.saveStudioState(state);
          updateSaveIndicator();
          renderFileTree();
          renderEditorArea();
          showToast(`Uploaded ${targetPack}/${finalPath}`);
        };
        reader.readAsText(file);
      }
    });
  }

  // Export Single Pack (.mcpack) or Combined Add-On (.mcaddon)
  function exportAddonPackage(exportType) {
    syncAutoManagedFiles(false);
    const slug = (state.config.addonName || "bedrock_addon")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");

    if (exportType === "BP_MCPACK" || exportType === "RP_MCPACK") {
      const packKey = exportType === "BP_MCPACK" ? "BP" : "RP";
      const zip = new window.BedrockZipArchive();
      const packFiles = state.files[packKey] || {};

      Object.keys(packFiles).forEach(relPath => {
        const f = packFiles[relPath];
        if (f.type === "image") {
          zip.addBinaryFile(relPath, f.content);
        } else {
          zip.addTextFile(relPath, f.content);
        }
      });

      const blob = zip.buildBlob("application/octet-stream");
      const filename = `${slug}_${packKey}.mcpack`;
      window.triggerBlobDownload(blob, filename);
      showToast(`Exported ${filename} (${Object.keys(packFiles).length} files)`);
      return;
    }

    if (exportType === "MCADDON") {
      // Build nested BP.mcpack and RP.mcpack inside the .mcaddon archive + folder structure option
      const outerZip = new window.BedrockZipArchive();
      const includeBP = state.config.packMode === "BP" || state.config.packMode === "BOTH";
      const includeRP = state.config.packMode === "RP" || state.config.packMode === "BOTH";

      if (includeBP) {
        const bpZip = new window.BedrockZipArchive();
        Object.keys(state.files.BP).forEach(relPath => {
          const f = state.files.BP[relPath];
          if (f.type === "image") bpZip.addBinaryFile(relPath, f.content);
          else bpZip.addTextFile(relPath, f.content);
        });
        outerZip.addBinaryFile(`${slug}_BP.mcpack`, bpZip.buildUint8Array());
      }

      if (includeRP) {
        const rpZip = new window.BedrockZipArchive();
        Object.keys(state.files.RP).forEach(relPath => {
          const f = state.files.RP[relPath];
          if (f.type === "image") rpZip.addBinaryFile(relPath, f.content);
          else rpZip.addTextFile(relPath, f.content);
        });
        outerZip.addBinaryFile(`${slug}_RP.mcpack`, rpZip.buildUint8Array());
      }

      const blob = outerZip.buildBlob("application/octet-stream");
      const filename = `${slug}.mcaddon`;
      window.triggerBlobDownload(blob, filename);
      showToast(`Exported ${filename} ready for Minecraft Bedrock!`);
      return;
    }

    if (exportType === "RAW_ZIP") {
      // Export raw folder hierarchy (BP/ and RP/ folders) in a .zip for development_behavior_packs
      const rawZip = new window.BedrockZipArchive();
      const includeBP = state.config.packMode === "BP" || state.config.packMode === "BOTH";
      const includeRP = state.config.packMode === "RP" || state.config.packMode === "BOTH";

      if (includeBP) {
        Object.keys(state.files.BP).forEach(relPath => {
          const f = state.files.BP[relPath];
          const fullPath = `${slug}_BP/${relPath}`;
          if (f.type === "image") rawZip.addBinaryFile(fullPath, f.content);
          else rawZip.addTextFile(fullPath, f.content);
        });
      }
      if (includeRP) {
        Object.keys(state.files.RP).forEach(relPath => {
          const f = state.files.RP[relPath];
          const fullPath = `${slug}_RP/${relPath}`;
          if (f.type === "image") rawZip.addBinaryFile(fullPath, f.content);
          else rawZip.addTextFile(fullPath, f.content);
        });
      }

      const blob = rawZip.buildBlob("application/zip");
      const filename = `${slug}_dev_folders.zip`;
      window.triggerBlobDownload(blob, filename);
      showToast(`Exported ${filename} with BP/RP development folders!`);
    }
  }

  // Render Documentation Version Table if present on page
  function renderDocumentationTable() {
    const tbody = document.getElementById("versionDocsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    window.BEDROCK_VERSION_DB.forEach(row => {
      const tr = document.createElement("tr");
      const srvStable = row.modules["@minecraft/server"].stable || "—";
      const srvBeta = row.modules["@minecraft/server"].beta || "—";
      const uiStable = row.modules["@minecraft/server-ui"].stable || "—";
      const uiBeta = row.modules["@minecraft/server-ui"].beta || "—";

      tr.innerHTML = `
        <td><strong>${row.mcVersion}</strong></td>
        <td><code>[${row.engineVersion.join(", ")}]</code></td>
        <td><span class="badge ${row.scriptApiGeneration === "v2" ? "badge-emerald" : "badge-amber"}">${row.scriptApiGeneration.toUpperCase()}</span></td>
        <td><span class="badge badge-emerald">${srvStable}</span> <span class="badge badge-purple">${srvBeta}</span></td>
        <td><span class="badge badge-sky">${uiStable}</span> <span class="badge badge-purple">${uiBeta}</span></td>
        <td>${row.supportsBetaWildcard ? "✅ Yes (<code>&quot;beta&quot;</code>)" : "No"}</td>
        <td style="color: var(--text-muted); font-size: 12px;">${row.notes}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initialize Studio Event Listeners
  function initStudio() {
    state = window.loadStudioState();
    populateMcVersionDropdown();
    applyMinecraftVersionMapping();
    syncFormInputsFromState();
    renderVersionAndModuleControls();
    renderFileTree();
    renderEditorArea();
    renderDocumentationTable();
    updateSaveIndicator();

    // Pack Mode Cards
    document.querySelectorAll(".pack-mode-card").forEach(card => {
      card.addEventListener("click", () => {
        state.config.packMode = card.dataset.mode;
        syncFormInputsFromState();
        syncAutoManagedFiles(false);
        renderFileTree();
        renderEditorArea();
      });
    });

    // Text/Select Metadata Inputs
    const bindInput = (id, callback) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        callback(el.value);
        syncAutoManagedFiles(false);
        renderFileTree();
        if (state.activePath === "manifest.json" || state.activePath === state.config.scriptEntry) {
          renderEditorArea();
        }
      });
    };

    bindInput("addonNameInput", val => { state.config.addonName = val || "Custom Add-On"; });
    bindInput("namespaceInput", val => { state.config.namespace = (val || "custom").toLowerCase().replace(/[^a-z0-9_]/g, "_"); });
    bindInput("addonDescInput", val => { state.config.addonDescription = val; });
    bindInput("addonAuthorInput", val => { state.config.addonAuthor = val; });
    bindInput("addonLicenseSelect", val => { state.config.addonLicense = val; });
    bindInput("scriptEntryInput", val => { state.config.scriptEntry = val || "scripts/main.js"; });

    ["packVerMajor", "packVerMinor", "packVerPatch"].forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        state.config.packVersion[idx] = Math.max(0, parseInt(el.value, 10) || 0);
        syncAutoManagedFiles(false);
        renderEditorArea();
      });
    });

    // Minecraft Version Selector
    const mcVerSelect = document.getElementById("mcVersionSelect");
    if (mcVerSelect) {
      mcVerSelect.addEventListener("change", () => {
        state.config.mcVersion = mcVerSelect.value;
        applyMinecraftVersionMapping();
        syncAutoManagedFiles(true);
        renderVersionAndModuleControls();
        renderEditorArea();
        showToast(`Matched modules for Minecraft ${state.config.mcVersion}`);
      });
    }

    // Release Track Selector
    const trackSelect = document.getElementById("releaseTrackSelect");
    if (trackSelect) {
      trackSelect.addEventListener("change", () => {
        state.config.releaseTrack = trackSelect.value;
        applyMinecraftVersionMapping();
        syncAutoManagedFiles(true);
        renderVersionAndModuleControls();
        renderEditorArea();
      });
    }

    // Checkboxes
    const bindCheck = (id, key, regenScript) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", () => {
        state.config[key] = el.checked;
        applyMinecraftVersionMapping();
        syncAutoManagedFiles(regenScript);
        renderVersionAndModuleControls();
        renderEditorArea();
      });
    };

    bindCheck("autoMatchModulesCheck", "autoMatchModules", false);
    bindCheck("enableScriptingCheck", "enableScripting", true);
    bindCheck("enableScriptEvalCheck", "enableScriptEval", false);
    bindCheck("linkCrossDepCheck", "linkCrossDependency", false);

    // Regenerate All UUIDs Button
    const regenUuidBtn = document.getElementById("regenAllUuidsBtn");
    if (regenUuidBtn) {
      regenUuidBtn.addEventListener("click", () => {
        state.config.uuids = {
          bpHeader: window.generateUUIDv4(),
          bpDataModule: window.generateUUIDv4(),
          bpScriptModule: window.generateUUIDv4(),
          rpHeader: window.generateUUIDv4(),
          rpResourcesModule: window.generateUUIDv4()
        };
        syncFormInputsFromState();
        syncAutoManagedFiles(false);
        renderEditorArea();
        showToast("Generated fresh UUID v4 identifiers for BP & RP!");
      });
    }

    // Regenerate Boilerplate Files Button
    const rebuildBoilerplateBtn = document.getElementById("rebuildBoilerplateBtn");
    if (rebuildBoilerplateBtn) {
      rebuildBoilerplateBtn.addEventListener("click", () => {
        state.files = window.createDefaultVirtualFiles(state.config);
        state.activePath = "manifest.json";
        window.saveStudioState(state);
        renderFileTree();
        renderEditorArea();
        showToast("Rebuilt BP & RP boilerplate structure for current namespace!");
      });
    }

    // Code Editor Live Save
    const editorTextarea = document.getElementById("codeEditorTextarea");
    if (editorTextarea) {
      editorTextarea.addEventListener("input", () => {
        const f = state.files[state.activePack] && state.files[state.activePack][state.activePath];
        if (!f) return;
        f.content = editorTextarea.value;
        f.autoManaged = false; // User manually edited
        window.saveStudioState(state);
        updateSaveIndicator();
      });
    }

    // Format JSON Button
    const formatJsonBtn = document.getElementById("formatJsonBtn");
    if (formatJsonBtn) {
      formatJsonBtn.addEventListener("click", () => {
        const f = state.files[state.activePack] && state.files[state.activePack][state.activePath];
        if (!f || f.type !== "json") {
          showToast("Active file is not a JSON file.", "#f59e0b");
          return;
        }
        try {
          const parsed = JSON.parse(f.content);
          f.content = JSON.stringify(parsed, null, 2);
          renderEditorArea();
          window.saveStudioState(state);
          showToast("Valid JSON! Formatted with 2-space indentation.");
        } catch (err) {
          showToast(`JSON Syntax Error: ${err.message}`, "#ef4444");
        }
      });
    }

    // Add New File Modal
    const newFileModal = document.getElementById("newFileModal");
    const openNewFileBtn = document.getElementById("openNewFileModalBtn");
    const closeNewFileBtn = document.getElementById("closeNewFileModalBtn");
    const confirmNewFileBtn = document.getElementById("confirmNewFileBtn");

    if (openNewFileBtn && newFileModal) {
      openNewFileBtn.addEventListener("click", () => newFileModal.classList.add("open"));
    }
    if (closeNewFileBtn && newFileModal) {
      closeNewFileBtn.addEventListener("click", () => newFileModal.classList.remove("open"));
    }
    if (confirmNewFileBtn && newFileModal) {
      confirmNewFileBtn.addEventListener("click", () => {
        const pack = document.getElementById("newFilePackSelect").value;
        const path = (document.getElementById("newFilePathInput").value || "").trim().replace(/^\/+/, "");
        if (!path) {
          showToast("Please enter a valid file path (e.g. items/ruby_sword.json)", "#ef4444");
          return;
        }
        const ext = path.split(".").pop().toLowerCase();
        const type = ext === "js" ? "js" : (ext === "json" ? "json" : "text");
        const initialContent = type === "json"
          ? JSON.stringify({ format_version: "1.21.0" }, null, 2)
          : (type === "js" ? '// Custom Script File\nimport { world } from "@minecraft/server";\n' : "");

        state.files[pack][path] = {
          type,
          locked: false,
          autoManaged: false,
          content: initialContent
        };
        state.activePack = pack;
        state.activePath = path;
        window.saveStudioState(state);
        renderFileTree();
        renderEditorArea();
        newFileModal.classList.remove("open");
        showToast(`Created ${pack}/${path}`);
      });
    }

    // Delete Active File Button
    const deleteFileBtn = document.getElementById("deleteActiveFileBtn");
    if (deleteFileBtn) {
      deleteFileBtn.addEventListener("click", () => {
        if (state.activePath === "manifest.json") {
          showToast("manifest.json is required by Minecraft Bedrock and cannot be deleted.", "#f59e0b");
          return;
        }
        delete state.files[state.activePack][state.activePath];
        state.activePath = "manifest.json";
        window.saveStudioState(state);
        renderFileTree();
        renderEditorArea();
        showToast("Removed file from pack.");
      });
    }

    // File Upload Input & Drag-and-Drop
    const fileInput = document.getElementById("fileUploadInput");
    const dropzone = document.getElementById("uploadDropzone");
    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());
      dropzone.addEventListener("dragover", e => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
      dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
      dropzone.addEventListener("drop", e => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        handleUploadedFiles(e.dataTransfer.files);
      });
      fileInput.addEventListener("change", () => {
        handleUploadedFiles(fileInput.files);
        fileInput.value = "";
      });
    }

    // Export Buttons
    const bindExport = (id, type) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", () => exportAddonPackage(type));
    };
    bindExport("exportMcaddonBtn", "MCADDON");
    bindExport("exportBpMcpackBtn", "BP_MCPACK");
    bindExport("exportRpMcpackBtn", "RP_MCPACK");
    bindExport("exportRawZipBtn", "RAW_ZIP");

    // Reset State Button
    const resetBtn = document.getElementById("resetProjectBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state = window.resetStudioState();
        populateMcVersionDropdown();
        syncFormInputsFromState();
        renderVersionAndModuleControls();
        renderFileTree();
        renderEditorArea();
        updateSaveIndicator();
        showToast("Project reset to factory defaults.");
      });
    }

    // View Switching Tabs (for single-page or multi-tab navigation)
    document.querySelectorAll("[data-view-target]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const target = btn.getAttribute("data-view-target");
        const studioView = document.getElementById("studioWorkspaceView");
        const docsView = document.getElementById("docsReferenceView");
        if (studioView && docsView) {
          e.preventDefault();
          document.querySelectorAll("[data-view-target]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          if (target === "docs") {
            studioView.style.display = "none";
            docsView.style.display = "block";
          } else {
            studioView.style.display = "block";
            docsView.style.display = "none";
          }
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initStudio);
})();
