import fs from "fs/promises";
import path from "path";
const PERSIST = path.join(process.cwd(), "backend", "db", "loans.json");

export async function readPersist() {
  try {
    const raw = await fs.readFile(PERSIST, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writePersist(data) {
  try {
    await fs.writeFile(PERSIST, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Persist write failed", e);
  }
}
