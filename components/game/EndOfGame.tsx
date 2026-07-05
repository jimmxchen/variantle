"use client";

import type { Opening, GamePhase } from "@/hooks/useChessle";

interface EndOfGameProps {
  phase: GamePhase;
  opening: Opening;
  openingIndex: number;
  lineLength: number;
  onPlayAgain: () => void;
  onDismiss: () => void;
  // When set, the "Study on Lichess" link opens the variant analysis board.
  // "standard" (ex-Chessle) behaves like no variant: plain analysis URL,
  // and openings show their real ECO code + name.
  variant?:
    | "standard"
    | "kingOfTheHill"
    | "threeCheck"
    | "horde"
    | "atomic"
    | "racingKings"
    | "antichess"
    | "crazyhouse";
}

function buildPgn(moves: string[]): string {
  const parts: string[] = [];
  for (let i = 0; i < moves.length; i++) {
    if (i % 2 === 0) parts.push(`${Math.floor(i / 2) + 1}. ${moves[i]}`);
    else parts.push(moves[i]);
  }
  return parts.join(" ");
}

export default function EndOfGame({ phase, opening, lineLength, onPlayAgain, onDismiss, variant }: EndOfGameProps) {
  if (phase === "playing") return null;

  const won = phase === "won";

  // Standard chess uses lichess's plain analysis URL and named-opening display.
  const variantSlug = variant === "standard" ? undefined : variant;

  // Truncate to the moves actually played (lineLength may be < opening.moves.length)
  const displayMoves = opening.moves.slice(0, lineLength);
  const pgn = displayMoves.length === opening.moves.length ? opening.pgn : buildPgn(displayMoves);
  const analysisBase = variantSlug
    ? `https://lichess.org/analysis/${variantSlug}/pgn/`
    : `https://lichess.org/analysis/pgn/`;
  const lichessUrl = `${analysisBase}${encodeURIComponent(pgn)}#explorer`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-foreground/10 bg-background shadow-2xl overflow-hidden">
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 text-muted/80 hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Gradient accent bar */}
        <div
          className={`h-1 w-full ${
            won
              ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
              : "bg-gradient-to-r from-red-500 to-orange-400"
          }`}
        />

        <div className="p-8 flex flex-col items-center gap-6 text-center">
          {/* Result emoji + heading */}
          <div>
            <p className="text-5xl mb-3">{won ? "♟️" : "😔"}</p>
            <h2 className="text-2xl font-bold text-foreground font-space">
              {won ? "Solved!" : "Better luck next time"}
            </h2>
            <p className="text-sm text-muted mt-1">
              {won
                ? "You matched the opening exactly."
                : "You've used all your guesses."}
            </p>
          </div>

          {/* Opening info */}
          <div className="w-full rounded-xl bg-foreground/5 border border-foreground/10 p-4 text-left">
            <p className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
              {variantSlug ? "—" : opening.eco || "—"}
            </p>
            <p className="text-foreground font-semibold text-base leading-snug">
              {/* Variants have no meaningful opening names (and Crazyhouse's
                  standard-chess name is misleading once captures/drops diverge),
                  so show the played move list for every variant. Standard uses
                  its real ECO + name. */}
              {variantSlug ? pgn || "Unnamed line" : opening.name || opening.pgn || "Unnamed line"}
            </p>

            {/* Move sequence */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {displayMoves.map((move, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-foreground/10 text-foreground/90 font-mono"
                >
                  {i % 2 === 0 && (
                    <span className="text-foreground/30">{Math.floor(i / 2) + 1}.</span>
                  )}
                  {move}
                </span>
              ))}
            </div>
          </div>

          {/* Lichess link */}
          <a
            href={lichessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors underline underline-offset-2"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 6v2H5v11h11v-5h2v7H3V6z" />
              <path d="M21 3l-6 6-1.5-1.5L19 3H15V1h8v8h-2z" />
            </svg>
            Study this opening on Lichess
          </a>

          {/* Play Again */}
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-6 rounded-xl font-semibold text-accent-contrast bg-accent hover:opacity-90 transition-opacity active:scale-95"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
