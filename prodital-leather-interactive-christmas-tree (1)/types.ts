
export enum TreeState {
  FORMED = 'FORMED',
  CHAOS = 'CHAOS'
}

export interface OrnamentData {
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  type: 'gem' | 'pearl' | 'light';
  color: string;
  weight: number;
}

export interface ParticleData {
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  size: number;
}
