export class RankingRaces {
  position: string;
  points: number;
  grandPrix: string;
  laps: string;
  time: string;
  date: Date;
  circuit: string;
  driver: string;
  team: string;
}

export class RankingRacesDetail {
  grandPrix: string;
  date: Date;
  circuit: string;
  title: string;
  rank: Omit<RankingRaces, 'circuit' | 'date' | 'grandPrix'>[];
}
