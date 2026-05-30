import { createActor } from "@/backend";
import type { SimulationResult as SimResult, Ticket } from "@/backend";
import { LotteryBall } from "@/components/LotteryBall";
import { SimulationResult } from "@/components/SimulationResult";
import { TicketDisplay } from "@/components/TicketDisplay";
import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { Loader2, PlayCircle, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";

export default function App() {
  const { actor, isFetching } = useActor(createActor);

  const [ticket, setTicket] = useState<number[] | null>(null);
  const [simResult, setSimResult] = useState<{
    tries: number;
    winningNumbers: number[];
    ticketNumbers: number[];
  } | null>(null);

  const quickPickMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result: Ticket = await actor.quickPick();
      return result.map(Number);
    },
    onMutate: () => {
      setTicket(null);
      setSimResult(null);
    },
    onSuccess: (numbers) => {
      setTicket(numbers);
    },
  });

  const simulateMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !ticket) throw new Error("Actor or ticket not ready");
      const ticketBigInt: Ticket = ticket.map(BigInt);
      const result: SimResult = await actor.simulate(ticketBigInt);
      return {
        tries: Number(result.tries),
        winningNumbers: result.winningNumbers.map(Number),
        ticketNumbers: result.ticketNumbers.map(Number),
      };
    },
    onSuccess: (result) => {
      setSimResult(result);
    },
  });

  const matchedSet = simResult
    ? new Set(
        simResult.ticketNumbers.filter((n) =>
          simResult.winningNumbers.includes(n),
        ),
      )
    : undefined;

  const isLoading = isFetching || quickPickMutation.isPending;
  const isSimulating = simulateMutation.isPending;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="app.page"
    >
      {/* Header */}
      <header
        className="bg-card border-b border-border shadow-sm py-4 px-6 flex items-center justify-center"
        data-ocid="app.header"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎰</span>
          <span className="font-display font-black text-xl text-primary tracking-tight">
            CA Lottery Simulator
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 py-10 gap-8">
        {/* Title section */}
        <div className="text-center max-w-xl">
          <h1 className="font-display font-black text-4xl md:text-5xl text-foreground leading-tight mb-3">
            Can You Beat the Odds?
          </h1>
          <p className="text-muted-foreground text-base">
            Generate a Quick Pick ticket, then run the simulation to see how
            many draws it takes to match all 6 numbers.
          </p>
        </div>

        {/* Odds callout */}
        <div className="odds-badge flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold">
          <Sparkles className="w-4 h-4" />1 in 13,983,816 odds of winning
        </div>

        {/* Ticket section */}
        <div className="w-full max-w-md">
          {ticket ? (
            <div className="flex flex-col items-center gap-6">
              {/* Ticket display */}
              <div
                className="ticket-card w-full rounded-2xl p-6 flex flex-col items-center gap-4"
                data-ocid="ticket.card"
              >
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  Your Ticket
                </span>
                <div className="flex flex-wrap gap-3 justify-center">
                  {ticket.map((num) => (
                    <LotteryBall
                      key={num}
                      number={num}
                      size="lg"
                      isMatched={matchedSet?.has(num) ?? false}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="ticket-empty-card w-full rounded-2xl p-8 flex flex-col items-center gap-3"
              data-ocid="ticket.empty_state"
            >
              <div className="flex gap-2 opacity-40">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-full border-2 border-dashed border-border"
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm text-center">
                Hit Quick Pick to generate your lucky numbers!
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
          data-ocid="actions.section"
        >
          <Button
            onClick={() => quickPickMutation.mutate()}
            disabled={isLoading}
            className="flex-1 btn-quick-pick font-display font-black text-base tracking-wide py-6 rounded-xl"
            data-ocid="quickpick.primary_button"
          >
            {quickPickMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" /> Quick Pick
              </>
            )}
          </Button>

          <Button
            onClick={() => simulateMutation.mutate()}
            disabled={!ticket || isSimulating || isLoading}
            className="flex-1 btn-simulate font-display font-black text-base tracking-wide py-6 rounded-xl"
            data-ocid="simulate.primary_button"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Simulating…
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" /> Run Simulation
              </>
            )}
          </Button>
        </div>

        {/* Simulation running state */}
        {isSimulating && (
          <div
            className="sim-running-card w-full max-w-md rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
            data-ocid="simulate.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-display font-bold text-foreground">
              Running millions of draws…
            </p>
            <p className="text-xs text-muted-foreground">
              The backend is testing every combination
            </p>
          </div>
        )}

        {/* Error state */}
        {(quickPickMutation.isError || simulateMutation.isError) && (
          <div
            className="w-full max-w-md rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-center"
            data-ocid="app.error_state"
          >
            <p className="text-destructive text-sm font-medium">
              {quickPickMutation.isError
                ? "Failed to generate ticket. Please try again."
                : "Simulation failed. Please try again."}
            </p>
          </div>
        )}

        {/* Results section */}
        {simResult && !isSimulating && (
          <div
            className="w-full max-w-2xl flex flex-col gap-6"
            data-ocid="results.section"
          >
            {/* Try count */}
            <SimulationResult tries={simResult.tries} />

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TicketDisplay
                numbers={simResult.ticketNumbers}
                matchedNumbers={matchedSet}
                label="Your Ticket"
              />
              <TicketDisplay
                numbers={simResult.winningNumbers}
                matchedNumbers={matchedSet}
                label="Winning Draw"
                isWinning
              />
            </div>

            {/* New pick CTA */}
            <Button
              variant="outline"
              onClick={() => {
                quickPickMutation.mutate();
              }}
              className="w-full py-5 rounded-xl font-display font-bold tracking-wide border-primary/40 text-primary hover:bg-primary/5"
              data-ocid="newpick.secondary_button"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Get New Quick Pick
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-border py-5 px-6 text-center"
        data-ocid="app.footer"
      >
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>{" "}
          &mdash; This app is a simulation only and is not affiliated with the
          California State Lottery.
        </p>
      </footer>
    </div>
  );
}
