// =========================================================
// Fabrique FlicEnCavale-poki.zip à partir du dossier dist-poki/
// (lancé par « npm run zip:poki », après « npm run build:poki »).
// index.html est à la racine du zip, tous les chemins sont relatifs :
// c'est le format attendu par Poki. Aucun outil à installer : juste Node.
// =========================================================

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { deflateRawSync } from 'node:zlib';

const SOURCE = 'dist-poki';
const OUTPUT = 'FlicEnCavale-poki.zip';

if (!existsSync(join(SOURCE, 'index.html'))) {
  console.error(`❌ ${SOURCE}/index.html introuvable : lance d'abord « npm run build:poki ».`);
  process.exit(1);
}

/** Tous les fichiers d'un dossier (sous-dossiers compris), triés pour un zip reproductible. */
function listFiles(dir) {
  return readdirSync(dir)
    .sort()
    .flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? listFiles(path) : [path];
    });
}

// Somme de contrôle CRC-32 (exigée par le format zip)
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// Date fixe (1er janvier 2026) : le même jeu donne toujours le même zip
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

const locals = [];
const centrals = [];
let offset = 0;
for (const file of listFiles(SOURCE)) {
  const name = Buffer.from(relative(SOURCE, file).split(sep).join('/'), 'utf8');
  const data = readFileSync(file);
  const packed = deflateRawSync(data, { level: 9 });
  const useDeflate = packed.length < data.length;
  const body = useDeflate ? packed : data;
  const crc = crc32(data);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); // signature
  local.writeUInt16LE(20, 4); // version
  local.writeUInt16LE(0x0800, 6); // noms en UTF-8
  local.writeUInt16LE(useDeflate ? 8 : 0, 8); // compression
  local.writeUInt16LE(DOS_TIME, 10);
  local.writeUInt16LE(DOS_DATE, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(body.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(name.length, 26);
  locals.push(local, name, body);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(useDeflate ? 8 : 0, 10);
  central.writeUInt16LE(DOS_TIME, 12);
  central.writeUInt16LE(DOS_DATE, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(body.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt32LE(offset, 42);
  centrals.push(central, name);

  offset += local.length + name.length + body.length;
}

const centralSize = centrals.reduce((s, b) => s + b.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(centrals.length / 2, 8);
end.writeUInt16LE(centrals.length / 2, 10);
end.writeUInt32LE(centralSize, 12);
end.writeUInt32LE(offset, 16);

const zip = Buffer.concat([...locals, ...centrals, end]);
writeFileSync(OUTPUT, zip);
console.log(`✅ ${OUTPUT} créé (${(zip.length / 1024).toFixed(0)} Ko, ${centrals.length / 2} fichiers). C'est ce fichier qu'il faut envoyer à Poki.`);
