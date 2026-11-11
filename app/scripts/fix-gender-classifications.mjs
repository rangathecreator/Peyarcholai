import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const namesDir = path.join(__dirname, "../src/data/names");

const CORRECTIONS = {
  kathir: {
    nameTamil: "கதிர்",
    gender: "boy",
    genderSuitabilityNote: "Masculine traditional name representing radiant sunbeam and golden harvest; widely used for boys (கதிர், கதிரவன்).",
    siblingPairSuggestions: ["Kaviyan", "Kadhiravan", "Kavya"]
  },
  kayal: {
    nameTamil: "கயல்",
    gender: "girl",
    genderSuitabilityNote: "Feminine classical name representing graceful carp-like eyes and Pandya dynasty maritime beauty (கயல், கயல்விழி).",
    siblingPairSuggestions: ["Kayalvizhi", "Kanmani", "Kavya"]
  },
  nambi: {
    nameTamil: "நம்பி",
    gender: "boy",
    genderSuitabilityNote: "Strictly masculine classical Sangam honorific for a noble, virtuous gentleman and leader (ஆடவரில் சிறந்தவன்; paired with நங்கை for women).",
    siblingPairSuggestions: ["Nangai", "Nannan", "Nedumaran"]
  },
  narumalar: {
    nameTamil: "நறுமலர்",
    gender: "girl",
    genderSuitabilityNote: "Feminine classical poetic name representing a sweet, fragrant blossoming flower of virtue (நறுமணம் கமழும் தூய மலர்).",
    siblingPairSuggestions: ["Narumugai", "Malarvizhi", "Narumalarchelvi"]
  }
};

let modifiedFiles = 0;
let modifiedRecords = 0;

const shardFiles = fs.readdirSync(namesDir).filter(f => f.endsWith(".json") && f !== "index.json");

for (const file of shardFiles) {
  const filePath = path.join(namesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let fileChanged = false;

  for (const record of data) {
    if (CORRECTIONS[record.slug]) {
      const fix = CORRECTIONS[record.slug];
      console.log(`[${file}] Updating slug '${record.slug}' (${record.nameTamil}): gender ${record.gender} -> ${fix.gender}`);
      record.gender = fix.gender;
      record.genderSuitabilityNote = fix.genderSuitabilityNote;
      if (fix.siblingPairSuggestions) {
        record.siblingPairSuggestions = fix.siblingPairSuggestions;
      }
      fileChanged = true;
      modifiedRecords++;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    modifiedFiles++;
  }
}

console.log(`\nCompleted gender corrections: Updated ${modifiedRecords} records across ${modifiedFiles} shards.`);

