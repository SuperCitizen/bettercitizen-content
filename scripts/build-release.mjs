#!/usr/bin/env node
// Builds a signed content release for the apps (bettercitizen-core, docs/content-release.md).
//
//   node scripts/build-release.mjs --out dist [--version 2026.11.3] [--feed <url-or-file>] [--keep 10]
//
// Writes everything the release host serves, laid out as it is served:
//
//   dist/releases/<version>.bcpack   the whole release: a zstd-compressed tar of the manifest, its
//                                    signature and the content tree (a first install takes this)
//   dist/releases/<version>.json     the manifest alone: every file's path, SHA-256 and size
//   dist/releases/<version>.sig      the ed25519 signature over the manifest's exact bytes
//   dist/releases/index.json         the feed the apps read to see whether there is anything new
//   dist/blobs/<aa>/<sha256>.zst     each file by its digest (an update takes only the ones it lacks)
//
// The release is the committed content and nothing else: files come from `git ls-files`, so work in
// progress never ships, and the same commit always gives the same manifest. Run the checks first
// (`npm run check`, and the app's `validate-content`); this script packs, it does not validate.
//
// Signing: CONTENT_RELEASE_KEY is the ed25519 private key, a base64 32-byte seed, and
// CONTENT_RELEASE_KEY_ID names it (its public half is compiled into the apps as that id). Without
// a version, the next one is worked out from the feed: this month's patch plus one.

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FORMAT = "bettercitizen.content-release/v1";
const FEED_FORMAT = "bettercitizen.content-feed/v1";
// What an app installs. Authoring material (drafts, docs, components, news-sources, the cover
// prompts and the sets covers are copied from) stays in the repository.
const GROUPS = ["packs", "glossary", "ideologies", "issues", "organizations", "persons", "touchstones", "meta"];
const COVER = /^covers\/(dark\/)?[^/]+\.jpg$/;
// The oldest core that reads what this script writes.
const MIN_CORE = "0.2.4";

function args() {
  const out = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) throw new Error(`unexpected argument: ${a}`);
    out[a.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  }
  return out;
}

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

function shipped(file) {
  if (file === "LICENSE") return true;
  if (COVER.test(file)) return true;
  return GROUPS.some((g) => file.startsWith(`${g}/`));
}

/** The 32-byte seed as a key Node can sign with (PKCS#8, RFC 8410). */
function signingKey(seedBase64) {
  const seed = Buffer.from(seedBase64.trim(), "base64");
  if (seed.length !== 32) throw new Error("CONTENT_RELEASE_KEY must be a base64 32-byte ed25519 seed");
  const der = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]);
  return crypto.createPrivateKey({ key: der, format: "der", type: "pkcs8" });
}

/** One tar entry (ustar). Paths over 100 bytes are split at a slash into prefix and name. */
function tarEntry(name, bytes, { dir = false } = {}) {
  let prefix = "";
  let base = name;
  if (Buffer.byteLength(base) > 100) {
    const cut = name.lastIndexOf("/", 155);
    prefix = name.slice(0, cut);
    base = name.slice(cut + 1);
    if (cut < 0 || Buffer.byteLength(base) > 100 || Buffer.byteLength(prefix) > 155) {
      throw new Error(`path too long for a release: ${name}`);
    }
  }
  const h = Buffer.alloc(512);
  h.write(base, 0, 100, "utf8");
  h.write(dir ? "0000755\0" : "0000644\0", 100, 8, "ascii");
  h.write("0000000\0", 108, 8, "ascii");
  h.write("0000000\0", 116, 8, "ascii");
  h.write(bytes.length.toString(8).padStart(11, "0") + "\0", 124, 12, "ascii");
  h.write("00000000000\0", 136, 12, "ascii"); // mtime 0: the same commit packs to the same bytes
  h.write("        ", 148, 8, "ascii");
  h.write(dir ? "5" : "0", 156, 1, "ascii");
  h.write("ustar\0", 257, 6, "ascii");
  h.write("00", 263, 2, "ascii");
  h.write(prefix, 345, 155, "utf8");
  let sum = 0;
  for (const b of h) sum += b;
  h.write(sum.toString(8).padStart(6, "0") + "\0 ", 148, 8, "ascii");
  const pad = Buffer.alloc((512 - (bytes.length % 512)) % 512);
  return Buffer.concat([h, bytes, pad]);
}

async function readFeed(source) {
  const empty = { format: FEED_FORMAT, latest: null, releases: [] };
  if (!source) return empty;
  let text;
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source, { cache: "no-store" });
    if (res.status === 404) return empty; // the first release
    if (!res.ok) throw new Error(`${source}: ${res.status}`);
    text = await res.text();
  } else {
    if (!fs.existsSync(source)) return empty;
    text = fs.readFileSync(source, "utf8");
  }
  const feed = JSON.parse(text);
  if (feed.format !== FEED_FORMAT) throw new Error(`${source}: not a ${FEED_FORMAT} feed`);
  return feed;
}

const versionKey = (v) => v.split(".").map((n) => Number.parseInt(n, 10) || 0);
const newer = (a, b) => {
  const [x, y] = [versionKey(a), versionKey(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  }
  return 0;
};

/** CalVer, `YYYY.MM.patch`: the next patch this month, or `.0` in a new month. */
function nextVersion(feed, now) {
  const month = `${now.getUTCFullYear()}.${now.getUTCMonth() + 1}`;
  const patches = feed.releases
    .map((r) => r.version)
    .filter((v) => v.startsWith(`${month}.`))
    .map((v) => versionKey(v)[2] ?? 0);
  return `${month}.${patches.length ? Math.max(...patches) + 1 : 0}`;
}

async function main() {
  const opt = args();
  const out = path.resolve(opt.out ?? "dist");
  const keep = Number.parseInt(opt.keep ?? "10", 10);
  const seed = process.env.CONTENT_RELEASE_KEY;
  const keyId = process.env.CONTENT_RELEASE_KEY_ID;
  if (!seed || !keyId) throw new Error("set CONTENT_RELEASE_KEY and CONTENT_RELEASE_KEY_ID");
  const key = signingKey(seed);

  const feed = await readFeed(opt.feed);
  const commit = git("rev-parse", "HEAD").trim();
  const createdAt = new Date(Number(git("log", "-1", "--format=%ct").trim()) * 1000).toISOString();
  const version = opt.version ?? nextVersion(feed, new Date());
  if (!/^\d{4}\.\d{1,2}\.\d+$/.test(version)) throw new Error(`version must be YYYY.MM.patch: ${version}`);
  if (feed.releases.some((r) => newer(r.version, version) >= 0)) {
    throw new Error(`version ${version} is not newer than the feed's ${feed.latest}`);
  }

  // Committed files only, in a fixed order.
  const files = git("ls-files", "-z")
    .split("\0")
    .filter((f) => f && shipped(f))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    .map((f) => ({ path: f, bytes: fs.readFileSync(path.join(ROOT, f)) }));
  if (!files.some((f) => f.path.startsWith("packs/"))) throw new Error("no packs: is this bettercitizen-content?");
  // A group with nothing committed still exists for the importer, as an empty folder.
  const dirs = GROUPS.filter((g) => g !== "meta" && g !== "touchstones" && !files.some((f) => f.path.startsWith(`${g}/`)));

  const manifest = Buffer.from(
    JSON.stringify({
      format: FORMAT,
      version,
      created_at: createdAt,
      source_commit: commit,
      ...(dirs.length ? { dirs } : {}),
      files: files.map((f) => ({ path: f.path, sha256: sha256(f.bytes), size: f.bytes.length })),
    }),
  );
  const signature = Buffer.from(
    JSON.stringify({ key_id: keyId, signature: crypto.sign(null, manifest, key).toString("base64") }),
  );

  const releases = path.join(out, "releases");
  fs.mkdirSync(releases, { recursive: true });
  fs.writeFileSync(path.join(releases, `${version}.json`), manifest);
  fs.writeFileSync(path.join(releases, `${version}.sig`), signature);

  let blobBytes = 0;
  for (const f of files) {
    const sha = sha256(f.bytes);
    const dir = path.join(out, "blobs", sha.slice(0, 2));
    const file = path.join(dir, `${sha}.zst`);
    if (fs.existsSync(file)) continue;
    fs.mkdirSync(dir, { recursive: true });
    const packed = zlib.zstdCompressSync(f.bytes, { params: { [zlib.constants.ZSTD_c_compressionLevel]: 19 } });
    fs.writeFileSync(file, packed);
    blobBytes += packed.length;
  }

  const tar = Buffer.concat([
    tarEntry("bcpack.json", manifest),
    tarEntry("bcpack.sig", signature),
    ...dirs.map((d) => tarEntry(`content/${d}/`, Buffer.alloc(0), { dir: true })),
    ...files.map((f) => tarEntry(`content/${f.path}`, f.bytes)),
    Buffer.alloc(1024),
  ]);
  const archive = zlib.zstdCompressSync(tar, { params: { [zlib.constants.ZSTD_c_compressionLevel]: 19 } });
  fs.writeFileSync(path.join(releases, `${version}.bcpack`), archive);

  // Newest first. Apps only ever take the newest they can read; older entries are a short history.
  const entry = {
    version,
    url: `${version}.bcpack`,
    published_at: new Date().toISOString(),
    size_bytes: archive.length,
    sha256: sha256(archive),
    min_core: MIN_CORE,
    source_commit: commit,
  };
  const next = {
    format: FEED_FORMAT,
    latest: version,
    releases: [entry, ...feed.releases.sort((a, b) => newer(b.version, a.version))].slice(0, keep),
  };
  fs.writeFileSync(path.join(releases, "index.json"), `${JSON.stringify(next, null, 2)}\n`);

  const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;
  console.log(`release ${version} from ${commit.slice(0, 12)}`);
  console.log(`  ${files.length} files, ${mb(files.reduce((n, f) => n + f.bytes.length, 0))} unpacked`);
  console.log(`  archive ${mb(archive.length)}, new blobs ${mb(blobBytes)}`);
  console.log(`  written to ${path.relative(process.cwd(), out) || "."}`);
}

main().catch((e) => {
  console.error(`build-release: ${e.message}`);
  process.exit(1);
});
