export interface Skull {
  id: number;
  name: string;
  dna: number;
  level: number;
  rarity: number;
  maxHpPoints: number;
  hpPoints: number;
  attackPoints: number;
  owner?: string;
  createdAt?: number;
}

export interface TreeBoss {
  name: string;
  maxHpPoints: number;
  hpPoints: number;
  attackPoints: number;
  imageURI: string;
}

export interface Boss extends TreeBoss {
  id: number;
  difficulty: number;
  reward: number;
  isDefeated: boolean;
}

export interface UserStats {
  totalSkulls: number;
  totalBattles: number;
  victories: number;
  defeats: number;
  totalEarnings: string;
}

export interface Transaction {
  hash: string;
  type: 'mint' | 'levelUp' | 'revive' | 'attack' | 'claimReward';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  gasUsed?: string;
  blockNumber?: number;
}

export type RarityTier = 'common' | 'rare' | 'legendary' | 'mythic';

export interface SkullMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
    display_type?: string;
  }[];
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorer: string;
  symbol: string;
  decimals: number;
}

export interface GameState {
  currentScreen: ScreenType;
  selectedSkull: Skull | null;
  bossFight: BossFightState | null;
  isLoading: boolean;
  error: string | null;
}

export type ScreenType =
  | 'connect'
  | 'home'
  | 'mint'
  | 'inventory'
  | 'bossFight'
  | 'victory'
  | 'defeat';

export interface BossFightState {
  boss: Boss;
  playerSkull: Skull;
  turn: 'player' | 'boss';
  isPlayerTurn: boolean;
  battleLog: BattleLogEntry[];
  isFinished: boolean;
}

export interface BattleLogEntry {
  turn: number;
  attacker: 'player' | 'boss';
  damage: number;
  targetHp: number;
  isCritical: boolean;
  timestamp: number;
}

export interface GameConfig {
  mintCost: string;
  levelUpCost: number;
  reviveCost: number;
  attackCost: number;
  bossRespawnTime: number;
  maxSkullsPerUser: number;
}
