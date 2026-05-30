module {
  public type Ticket = [Nat];

  public type SimulationResult = {
    tries : Nat;
    winningNumbers : Ticket;
    ticketNumbers : Ticket;
  };
};
