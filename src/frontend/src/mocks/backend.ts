import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  quickPick: async () => [BigInt(7), BigInt(14), BigInt(22), BigInt(33), BigInt(41), BigInt(48)],
  simulate: async (ticket) => ({
    tries: BigInt(13983816),
    ticketNumbers: ticket,
    winningNumbers: ticket,
  }),
};
