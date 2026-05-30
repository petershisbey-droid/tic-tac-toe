import { Trophy, Zap } from "lucide-react";

interface SimulationResultProps {
  tries: number;
}

export function SimulationResult({ tries }: SimulationResultProps) {
  const isLucky = tries < 1_000_000;
  const isInsane = tries > 10_000_000;

  const formatTries = (n: number) => n.toLocaleString();

  return (
    <div className="result-card flex flex-col items-center gap-3 p-8 rounded-2xl text-center animate-result-pop">
      <div className="flex items-center gap-2">
        {isInsane ? (
          <Zap className="w-7 h-7 text-accent" />
        ) : (
          <Trophy className="w-7 h-7 text-accent" />
        )}
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
          Simulation Complete
        </span>
      </div>
      <div className="tries-count font-display font-black text-primary">
        {formatTries(tries)}
      </div>
      <p className="text-sm text-muted-foreground">
        {isLucky
          ? "draws to match all 6 numbers! 🍀 You got lucky!"
          : isInsane
            ? "draws — the odds are brutal! 😅"
            : "draws until all numbers matched"}
      </p>
    </div>
  );
}
