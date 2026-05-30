import { LotteryBall } from "./LotteryBall";

interface TicketDisplayProps {
  numbers: number[];
  matchedNumbers?: Set<number>;
  label: string;
  isWinning?: boolean;
}

export function TicketDisplay({
  numbers,
  matchedNumbers,
  label,
  isWinning = false,
}: TicketDisplayProps) {
  return (
    <div className="ticket-card flex flex-col items-center gap-4 p-6 rounded-2xl">
      <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-3 justify-center">
        {numbers.map((num) => (
          <LotteryBall
            key={num}
            number={num}
            size="md"
            isMatched={matchedNumbers?.has(num) ?? false}
            isWinning={isWinning && !(matchedNumbers?.has(num) ?? false)}
          />
        ))}
      </div>
    </div>
  );
}
