import type { VariantEntry } from "./types";
import standard from "./variants/standard";
import koth from "./variants/koth";
import threeCheck from "./variants/threeCheck";
import horde from "./variants/horde";
import atomic from "./variants/atomic";
import racingkings from "./variants/racingkings";
import antichess from "./variants/antichess";
import crazyhouse from "./variants/crazyhouse";

// Order here = order shown in the (paginated) setup overlay.
// Page 1: Standard (ex-Chessle), King of the Hill, Three Check, Crazyhouse
// Page 2: Antichess, Atomic, Horde, Racing Kings
export const VARIANTS_REGISTRY: VariantEntry[] = [
  standard,
  koth,
  threeCheck,
  crazyhouse,
  antichess,
  atomic,
  horde,
  racingkings,
];
