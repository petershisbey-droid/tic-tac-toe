interface LotteryBallProps {
  number: number;
  isMatched?: boolean;
  isWinning?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LotteryBall({
  number,
  isMatched = false,
  isWinning = false,
  size = "md",
}: LotteryBallProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-16 h-16 text-xl",
  };

  const displayNum = String(number).padStart(2, "0");

  const ballStyle = isMatched
    ? "ball-matched"
    : isWinning
      ? "ball-winning"
      : "ball-default";

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${ballStyle}
        rounded-full flex items-center justify-center
        font-display font-bold
        select-none relative
        transition-all duration-300
      `}
    >
      {displayNum}
    </div>
  );
}
