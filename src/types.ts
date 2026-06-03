/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LetterState = 'empty' | 'tbd' | 'absent' | 'present' | 'correct';

export interface Letter {
  char: string;
  state: LetterState;
}

export interface Guess {
  letters: Letter[];
}

export interface GameStats {
  played: number;
  won: number;
  guesses: { [key: number]: number }; // guess distribution: 1 to 5
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate?: string;
  lastWonDate?: string;
}

export interface GameState {
  boardState: string[]; // array of 5 strings, e.g. ["WATER", "STORM", "", "", ""]
  evaluations: (LetterState[] | null)[]; // status for each letter in each guessed row
  gameStatus: 'IN_PROGRESS' | 'WON' | 'LOST';
  lastPlayedDate: string; // YYYY-MM-DD
}
