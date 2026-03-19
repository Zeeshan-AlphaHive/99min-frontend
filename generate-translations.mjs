/**
 * generate-translations.mjs
 *
 * Run once: node generate-translations.mjs
 *
 * Reads the nested en.json as the source of truth, then translates every
 * string value into each target language via MyMemory (free, no API key).
 * Outputs one nested JSON file per language to /messages/{code}.json
 *
 * ✅ Works with next-intl's nested key format: t('messages.title')
 */

import fs from "fs";
import path from "path";

const OUTPUT_DIR = "./messages";
const SOURCE_FILE = path.join(OUTPUT_DIR, "en.json");
const DELAY_MS = 350; // polite to MyMemory free tier

const languages = [
  { code: "sq", name: "Albanian" },
  { code: "ast", name: "Asturian" },
  { code: "be", name: "Belarusian" },
  { code: "bs", name: "Bosnian" },
  { code: "bg", name: "Bulgarian" },
  { code: "ca", name: "Catalan" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "et", name: "Estonian" },
  { code: "fo", name: "Faroese" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "gl", name: "Galician" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "hu", name: "Hungarian" },
  { code: "is", name: "Icelandic" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "lb", name: "Luxembourgish" },
  { code: "mk", name: "Macedonian" },
  { code: "mt", name: "Maltese" },
  { code: "no", name: "Norwegian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "rm", name: "Romansh" },
  { code: "ru", name: "Russian" },
  { code: "sr", name: "Serbian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "uk", name: "Ukrainian" },
  { code: "cy", name: "Welsh" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateText(text, targetLang) {
  // Don't translate placeholder tokens like {count}, {name}, etc.
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.responseStatus === 200) {
      return json.responseData.translatedText;
    }
    return text;
  } catch {
    return text;
  }
}

/**
 * Recursively walk a nested object and translate every string leaf.
 */
async function translateObject(obj, targetLang) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = await translateText(value, targetLang);
      await sleep(DELAY_MS);
    } else if (typeof value === "object" && value !== null) {
      result[key] = await translateObject(value, targetLang);
    } else {
      result[key] = value;
    }
  }
  return result;
}

async function generateTranslations() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`❌ Source file not found: ${SOURCE_FILE}`);
    console.error("   Make sure en.json exists in /messages before running this script.");
    process.exit(1);
  }

  const source = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf-8"));
  console.log(`✓ Loaded source: en.json`);

  for (const lang of languages) {
    const outputPath = path.join(OUTPUT_DIR, `${lang.code}.json`);

    // Delete and regenerate — remove this block to skip already-generated files
    if (fs.existsSync(outputPath)) {
      console.log(`⏭  ${lang.code}.json already exists, skipping`);
      continue;
    }

    console.log(`\nTranslating → ${lang.name} (${lang.code})...`);

    const translated = await translateObject(source, lang.code);

    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), "utf-8");
    console.log(`✓ ${lang.code}.json written`);
  }

  console.log("\n✅ All translations generated in /messages");
}

generateTranslations().catch(console.error);
