import { chessJsFactory } from "@/lib/engine/chessJsEngine";
import type { VariantEntry } from "../types";
import type { Opening, Difficulty } from "@/hooks/useChessle";
import openings from "@/data/chessle-openings.json";
import difficulties from "@/data/chessle-difficulties.json";

// Standard chess — previously the standalone Chessle game. chess.js already
// implements EngineFactory, so it slots into the registry like any variant.
const entry: VariantEntry = {
  key: "standard",
  engine: chessJsFactory,
  dataset: {
    openings: openings as Opening[],
    difficulties: difficulties.difficulties as Record<string, Difficulty>,
  },
  sharePrefix: "S",
  hasPockets: false,
};

export default entry;
