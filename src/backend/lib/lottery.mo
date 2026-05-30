import Types "../types/lottery";
import Nat8 "mo:core/Nat8";

module {
  // --- LCG pseudo-random helper -----------------------------------------------
  // Seed the LCG from the bytes of a Blob, then advance it to produce Nats.
  // We use a 64-bit Mulberry32-style LCG: x = x * 6364136223846793005 + 1.
  // All arithmetic is Nat (positive), masked to 64-bit via `% (2**64)`.

  let M64 : Nat = 18446744073709551616; // 2^64
  let A   : Nat = 6364136223846793005;

  func seedFromBlob(b : Blob) : Nat {
    let bytes = b.vals();
    var s : Nat = 1; // non-zero default
    for (byte in bytes) {
      s := (s * 256 + byte.toNat()) % M64;
      if (s == 0) { s := 1 };
    };
    s;
  };

  func nextRng(state : Nat) : (Nat, Nat) {
    let next = (state * A + 1) % M64;
    (next, next);
  };

  // Returns a number in [1, 49] from an rng state.
  func randNum(state : Nat) : (Nat, Nat) {
    let (next, _) = nextRng(state);
    (next, (next % 49) + 1);
  };

  // ---- Public API -------------------------------------------------------------

  /// Generate 6 unique random numbers from 1 to 49.
  public func quickPick(seed : Blob) : Types.Ticket {
    var rng = seedFromBlob(seed);
    var picked : [var Nat] = [var 0, 0, 0, 0, 0, 0];
    var count = 0;
    label outer while (count < 6) {
      let (newRng, n) = randNum(rng);
      rng := newRng;
      // Check uniqueness
      var dup = false;
      var i = 0;
      while (i < count) {
        if (picked[i] == n) { dup := true };
        i += 1;
      };
      if (not dup) {
        picked[count] := n;
        count += 1;
      };
    };
    [picked[0], picked[1], picked[2], picked[3], picked[4], picked[5]];
  };

  /// Check whether two tickets have the same 6 numbers (order-independent).
  func ticketsMatch(a : Types.Ticket, b : Types.Ticket) : Bool {
    // Both tickets are exactly 6 numbers from 1-49.
    // Build a simple presence check: for each number in `a`, confirm it appears in `b`.
    if (a.size() != b.size()) { return false };
    var i = 0;
    while (i < a.size()) {
      var found = false;
      var j = 0;
      while (j < b.size()) {
        if (a[i] == b[j]) { found := true };
        j += 1;
      };
      if (not found) { return false };
      i += 1;
    };
    true;
  };

  /// Run simulation: draw random tickets until all 6 match the target ticket.
  /// Returns number of tries and the winning drawn numbers.
  public func simulate(ticket : Types.Ticket, seed : Blob) : Types.SimulationResult {
    var rng = seedFromBlob(seed);
    var tries : Nat = 0;
    var winning : Types.Ticket = [];
    label loop_ while (true) {
      tries += 1;
      // Draw 6 unique numbers using current rng state
      var picked : [var Nat] = [var 0, 0, 0, 0, 0, 0];
      var count = 0;
      while (count < 6) {
        let (newRng, n) = randNum(rng);
        rng := newRng;
        var dup = false;
        var i = 0;
        while (i < count) {
          if (picked[i] == n) { dup := true };
          i += 1;
        };
        if (not dup) {
          picked[count] := n;
          count += 1;
        };
      };
      let drawn : Types.Ticket = [picked[0], picked[1], picked[2], picked[3], picked[4], picked[5]];
      if (ticketsMatch(drawn, ticket)) {
        winning := drawn;
        break loop_;
      };
    };
    { tries; winningNumbers = winning; ticketNumbers = ticket };
  };
};
