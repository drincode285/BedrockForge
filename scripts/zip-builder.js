/* ==========================================================================
   BedrockForge Studio - Pure Frontend ZIP / MCPACK / MCADDON Archive Builder
   (scripts/zip-builder.js)
   Creates valid binary ZIP archives (.mcpack, .mcaddon, .zip) 100% client-side
   without requiring a backend server or external network connection.
   ========================================================================== */

(function() {
  // Precompute CRC32 Table
  const CRC_TABLE = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    CRC_TABLE[i] = c >>> 0;
  }

  function crc32(bytes) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function stringToUint8Array(str) {
    return new TextEncoder().encode(str);
  }

  function base64ToUint8Array(base64) {
    const cleaned = base64.includes(",") ? base64.split(",")[1] : base64;
    const binary = atob(cleaned);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function dosDateTime(date) {
    const d = date || new Date();
    const year = Math.max(1980, d.getFullYear());
    const dosTime = ((d.getHours() & 0x1F) << 11) | ((d.getMinutes() & 0x3F) << 5) | ((d.getSeconds() >> 1) & 0x1F);
    const dosDate = (((year - 1980) & 0x7F) << 9) | (((d.getMonth() + 1) & 0x0F) << 5) | (d.getDate() & 0x1F);
    return { dosTime, dosDate };
  }

  class BedrockZipArchive {
    constructor() {
      this.entries = [];
    }

    addTextFile(path, textContent) {
      const cleanPath = path.replace(/^\/+/, "");
      const data = stringToUint8Array(textContent || "");
      this.entries.push({ path: cleanPath, data });
    }

    addBinaryFile(path, uint8OrBase64) {
      const cleanPath = path.replace(/^\/+/, "");
      const data = typeof uint8OrBase64 === "string"
        ? base64ToUint8Array(uint8OrBase64)
        : new Uint8Array(uint8OrBase64);
      this.entries.push({ path: cleanPath, data });
    }

    buildUint8Array() {
      const localParts = [];
      const centralParts = [];
      let offset = 0;
      const now = dosDateTime(new Date());

      for (const entry of this.entries) {
        const nameBytes = stringToUint8Array(entry.path);
        const dataBytes = entry.data;
        const crc = crc32(dataBytes);
        const size = dataBytes.length;

        // Local file header (30 bytes + filename)
        const localHeader = new Uint8Array(30 + nameBytes.length);
        const lv = new DataView(localHeader.buffer);
        lv.setUint32(0, 0x04034b50, true); // signature
        lv.setUint16(4, 20, true);         // version needed
        lv.setUint16(6, 0x0800, true);     // UTF-8 flag
        lv.setUint16(8, 0, true);          // compression (0 = STORE)
        lv.setUint16(10, now.dosTime, true);
        lv.setUint16(12, now.dosDate, true);
        lv.setUint32(14, crc, true);
        lv.setUint32(18, size, true);
        lv.setUint32(22, size, true);
        lv.setUint16(26, nameBytes.length, true);
        lv.setUint16(28, 0, true);
        localHeader.set(nameBytes, 30);

        localParts.push(localHeader, dataBytes);

        // Central directory header (46 bytes + filename)
        const centralHeader = new Uint8Array(46 + nameBytes.length);
        const cv = new DataView(centralHeader.buffer);
        cv.setUint32(0, 0x02014b50, true); // central signature
        cv.setUint16(4, 20, true);         // version made by
        cv.setUint16(6, 20, true);         // version needed
        cv.setUint16(8, 0x0800, true);     // UTF-8 flag
        cv.setUint16(10, 0, true);         // compression STORE
        cv.setUint16(12, now.dosTime, true);
        cv.setUint16(14, now.dosDate, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, size, true);
        cv.setUint32(24, size, true);
        cv.setUint16(28, nameBytes.length, true);
        cv.setUint16(30, 0, true);
        cv.setUint16(32, 0, true);
        cv.setUint16(34, 0, true);
        cv.setUint16(36, 0, true);
        cv.setUint32(38, 0, true);
        cv.setUint32(42, offset, true);
        centralHeader.set(nameBytes, 46);

        centralParts.push(centralHeader);
        offset += localHeader.length + size;
      }

      let centralSize = 0;
      for (const c of centralParts) centralSize += c.length;

      // End of central directory record (22 bytes)
      const eocd = new Uint8Array(22);
      const ev = new DataView(eocd.buffer);
      ev.setUint32(0, 0x06054b50, true);
      ev.setUint16(4, 0, true);
      ev.setUint16(6, 0, true);
      ev.setUint16(8, this.entries.length, true);
      ev.setUint16(10, this.entries.length, true);
      ev.setUint32(12, centralSize, true);
      ev.setUint32(16, offset, true);
      ev.setUint16(20, 0, true);

      const totalLength = offset + centralSize + eocd.length;
      const out = new Uint8Array(totalLength);
      let cursor = 0;
      for (const part of localParts) {
        out.set(part, cursor);
        cursor += part.length;
      }
      for (const part of centralParts) {
        out.set(part, cursor);
        cursor += part.length;
      }
      out.set(eocd, cursor);
      return out;
    }

    buildBlob(mimeType) {
      const bytes = this.buildUint8Array();
      return new Blob([bytes], { type: mimeType || "application/octet-stream" });
    }
  }

  window.BedrockZipArchive = BedrockZipArchive;

  window.triggerBlobDownload = function(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  };
})();
