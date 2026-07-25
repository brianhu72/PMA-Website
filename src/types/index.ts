export interface NavLink {
  label: string;
  href: string;
}

export interface Era {
  numeral: string;       // "I", "II", "III"
  label: string;         // "ERA I · 1909–1987"
  title: string;         // "The Founding Years"
  description: string;
  startYear: number;
  endYear: number | null; // null = present
  productions: Production[];
}

export interface HeroStat {
  value: string;         // "300+"
  label: string;         // "PRODUCTIONS"
}

export interface Production {
  year: number;
  title: string;
  director: string;
}
