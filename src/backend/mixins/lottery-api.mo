import Random "mo:core/Random";
import LotteryLib "../lib/lottery";
import Types "../types/lottery";

mixin () {
  /// Generate and return a Quick Pick ticket (6 unique numbers from 1-49).
  public func quickPick() : async Types.Ticket {
    let seed = await Random.blob();
    LotteryLib.quickPick(seed);
  };

  /// Run the simulation against the provided ticket.
  /// Returns try count and winning numbers.
  public func simulate(ticket : Types.Ticket) : async Types.SimulationResult {
    let seed = await Random.blob();
    LotteryLib.simulate(ticket, seed);
  };
};
