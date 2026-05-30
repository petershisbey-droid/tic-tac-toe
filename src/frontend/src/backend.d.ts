import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SimulationResult {
    tries: bigint;
    ticketNumbers: Ticket;
    winningNumbers: Ticket;
}
export type Ticket = Array<bigint>;
export interface backendInterface {
    quickPick(): Promise<Ticket>;
    simulate(ticket: Ticket): Promise<SimulationResult>;
}
