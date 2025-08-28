import express from "express";
import { readPersist, writePersist } from "../db/persist.js";

const router = express.Router();

// In-memory store for fast operations (efficient, O(1) access)
const loanMap = new Map();

// hydrate from file if present
const persisted = readPersist();
if (persisted && persisted.length) {
  for (const entry of persisted) loanMap.set(entry.loanId, entry);
}

// create metadata
router.post("/", (req, res) => {
  const { loanId, purposeCID, region, scholarNote } = req.body;
  if (!loanId) return res.status(400).json({ error: "loanId required" });

  const entry = { loanId, purposeCID, region, scholarNote, updatedAt: Date.now() };
  loanMap.set(String(loanId), entry);

  // persist async (non-blocking)
  writePersist(Array.from(loanMap.values())).catch(console.error);

  res.json({ success: true, entry });
});

router.get("/:loanId", (req, res) => {
  const loan = loanMap.get(String(req.params.loanId));
  if (!loan) return res.status(404).json({ error: "not found" });
  res.json(loan);
});

router.get("/", (req, res) => {
  res.json(Array.from(loanMap.values()));
});

export default router;
