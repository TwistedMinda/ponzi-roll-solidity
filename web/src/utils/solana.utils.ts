import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from 'constants/addresses';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import idl from '../constants/SolanaIDL.json';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export const GAME_PRICE = 0.001 * LAMPORTS_PER_SOL;
export const ROUND_DURATION = 3 * 1000;
export const sleep = async (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

/**
 * Seeds
 */
const CURRENT_ROUND_SEED = 'current_round';
const LAST_ROUND_SEED = 'last_round';
const STATS_SEED = 'stats';
const PLAYER_STATE_SEED = 'player_state';

export const toSol = (lamports: number) => {
  return lamports / LAMPORTS_PER_SOL;
};

/**
 * Helpers
 */
export const getProgram = (provider: anchor.Provider) =>
  new Program(idl as anchor.Idl, PROGRAM_ID, provider);

export const getProvider = (connection: Connection, wallet: AnchorWallet) =>
  new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: 'recent'
  });

export const addressForSeed = (seed: string, pubKey?: PublicKey) => {
  const seeds = [anchor.utils.bytes.utf8.encode(seed)];
  if (pubKey) {
    seeds.push(pubKey.toBuffer());
  }
  const [pda, _] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
  return pda;
};
export const getCurrentRound = async (program: Program) =>
  await program.account.currentRound.fetch(addressForSeed(CURRENT_ROUND_SEED));
export const getLastRound = async (program: Program) =>
  await program.account.lastRound.fetch(addressForSeed(LAST_ROUND_SEED));
export const getStats = async (program: Program) =>
  await program.account.stats.fetch(addressForSeed(STATS_SEED));
export const getPlayerState = async (pubKey: PublicKey, program: Program) =>
  await program.account.playerState.fetch(
    addressForSeed(PLAYER_STATE_SEED, pubKey)
  );

export const getValueForKey = async (request: Promise<any>, key: string) => {
  const val = await request;
  return val[key];
};
export const initAppState = async (pubKey: PublicKey, program: Program) => {
  const currentRound = addressForSeed(CURRENT_ROUND_SEED);
  const lastRound = addressForSeed(LAST_ROUND_SEED);
  const stats = addressForSeed(STATS_SEED);

  return await program.methods
    .initAppState()
    .accounts({
      player: pubKey,
      currentRound,
      lastRound,
      stats,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc();
};

export const initPlayer = async (pubKey: PublicKey, program: Program) => {
  const playerState = addressForSeed(PLAYER_STATE_SEED, pubKey);
  return await program.methods
    .initPlayer()
    .accounts({
      player: pubKey,
      playerState,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc();
};

export const play = async (
  pubKey: PublicKey,
  bet: number,
  program: Program
) => {
  const currentRound = addressForSeed(CURRENT_ROUND_SEED);
  const lastRound = addressForSeed(LAST_ROUND_SEED);
  const stats = addressForSeed(STATS_SEED);
  const playerState = addressForSeed(PLAYER_STATE_SEED, pubKey);

  return await program.methods
    .play(bet)
    .accounts({
      currentRound,
      lastRound,
      stats,
      playerState,
      player: pubKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc();
};

export const claim = async (pubKey: PublicKey, program: Program) => {
  const currentRound = addressForSeed(CURRENT_ROUND_SEED);
  const lastRound = addressForSeed(LAST_ROUND_SEED);
  const playerState = addressForSeed(PLAYER_STATE_SEED, pubKey);
  const stats = addressForSeed(STATS_SEED);

  return await program.methods
    .claim()
    .accounts({
      currentRound,
      lastRound,
      playerState,
      stats,
      player: pubKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc();
};
