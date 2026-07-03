const fs = require("fs");
const zlib = require("zlib");

const outDir = "imgverxan";
const targets = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
];

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const len = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([len, name, data, crc]);
}

function writePng(file, width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  fs.writeFileSync(
    file,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", ihdr),
      chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

function color(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
    255,
  ];
}

function blend(dst, src, a) {
  const inv = 1 - a;
  return [
    Math.round(dst[0] * inv + src[0] * a),
    Math.round(dst[1] * inv + src[1] * a),
    Math.round(dst[2] * inv + src[2] * a),
    255,
  ];
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  const x = ax + t * dx, y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}

function draw(size) {
  const scale = size / 64;
  const rgba = Buffer.alloc(size * size * 4);
  const bg = color("#030605");
  const panel = color("#08110d");
  const green = color("#7cff00");
  const greenDark = color("#49a900");
  const text = color("#d8ffd0");

  const shield = [[32, 6], [52, 15], [52, 32], [49, 43], [41, 52], [32, 58], [23, 52], [15, 43], [12, 32], [12, 15]];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x + 0.5) / scale;
      const ny = (y + 0.5) / scale;
      let px = bg;
      const glow = Math.max(0, 1 - Math.hypot(nx - 32, ny - 27) / 34);
      px = blend(px, green, glow * 0.18);

      if (pointInPoly(nx, ny, shield)) {
        px = blend(panel, greenDark, Math.max(0, 1 - ny / 64) * 0.18);
      }

      let edge = Infinity;
      for (let i = 0; i < shield.length; i++) {
        const a = shield[i], b = shield[(i + 1) % shield.length];
        edge = Math.min(edge, distToSegment(nx, ny, a[0], a[1], b[0], b[1]));
      }
      if (edge < 2.1) px = blend(px, green, Math.max(0, 1 - edge / 2.1));
      if (edge < 4.2) px = blend(px, green, Math.max(0, 1 - edge / 4.2) * 0.28);

      const off = (y * size + x) * 4;
      rgba[off] = px[0];
      rgba[off + 1] = px[1];
      rgba[off + 2] = px[2];
      rgba[off + 3] = 255;
    }
  }

  const font = Math.max(10, Math.round(size * 0.58));
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const image = new ImageData(new Uint8ClampedArray(rgba), size, size);
  ctx.putImageData(image, 0, 0);
  ctx.font = `900 ${font}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#7cff00";
  ctx.shadowBlur = Math.max(2, size * 0.04);
  ctx.fillStyle = "#d8ffd0";
  ctx.fillText("?", size / 2, size * 0.49);
  const rendered = ctx.getImageData(0, 0, size, size).data;
  return Buffer.from(rendered.buffer);
}

for (const [name, size] of targets) writePng(`${outDir}/${name}`, size, size, draw(size));

const png16 = fs.readFileSync(`${outDir}/favicon-16x16.png`);
const png32 = fs.readFileSync(`${outDir}/favicon-32x32.png`);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(2, 4);
const dir = Buffer.alloc(32);
let offset = 6 + 32;
for (const [i, png, size] of [[0, png16, 16], [1, png32, 32]]) {
  const p = i * 16;
  dir[p] = size;
  dir[p + 1] = size;
  dir[p + 2] = 0;
  dir[p + 3] = 0;
  dir.writeUInt16LE(1, p + 4);
  dir.writeUInt16LE(32, p + 6);
  dir.writeUInt32LE(png.length, p + 8);
  dir.writeUInt32LE(offset, p + 12);
  offset += png.length;
}
fs.writeFileSync(`${outDir}/favicon.ico`, Buffer.concat([header, dir, png16, png32]));
