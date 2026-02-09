export const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", element: "Fire", startDeg: 0 },
  { name: "Taurus", symbol: "♉", element: "Earth", startDeg: 30 },
  { name: "Gemini", symbol: "♊", element: "Air", startDeg: 60 },
  { name: "Cancer", symbol: "♋", element: "Water", startDeg: 90 },
  { name: "Leo", symbol: "♌", element: "Fire", startDeg: 120 },
  { name: "Virgo", symbol: "♍", element: "Earth", startDeg: 150 },
  { name: "Libra", symbol: "♎", element: "Air", startDeg: 180 },
  { name: "Scorpio", symbol: "♏", element: "Water", startDeg: 210 },
  { name: "Sagittarius", symbol: "♐", element: "Fire", startDeg: 240 },
  { name: "Capricorn", symbol: "♑", element: "Earth", startDeg: 270 },
  { name: "Aquarius", symbol: "♒", element: "Air", startDeg: 300 },
  { name: "Pisces", symbol: "♓", element: "Water", startDeg: 330 },
] as const;

export const PLANETS = [
  { name: "Sun", symbol: "☉", color: "hsl(40, 75%, 55%)" },
  { name: "Moon", symbol: "☽", color: "hsl(220, 20%, 80%)" },
  { name: "Mercury", symbol: "☿", color: "hsl(180, 40%, 60%)" },
  { name: "Venus", symbol: "♀", color: "hsl(330, 50%, 65%)" },
  { name: "Mars", symbol: "♂", color: "hsl(0, 60%, 55%)" },
  { name: "Jupiter", symbol: "♃", color: "hsl(30, 50%, 55%)" },
  { name: "Saturn", symbol: "♄", color: "hsl(45, 20%, 50%)" },
  { name: "Uranus", symbol: "♅", color: "hsl(190, 60%, 55%)" },
  { name: "Neptune", symbol: "♆", color: "hsl(230, 60%, 60%)" },
  { name: "Pluto", symbol: "♇", color: "hsl(280, 30%, 50%)" },
] as const;

export const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);

export interface PlanetPlacement {
  planet: string;
  sign: string;
  degree: number;
  house: number;
}

export interface NatalChart {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  color: string;
  placements: PlanetPlacement[];
  ascendant: number;
}

// Deterministic pseudo-random chart based on birth data
export function generateChart(name: string, birthDate: string, birthTime: string, birthPlace: string): NatalChart {
  const seed = hashString(`${name}${birthDate}${birthTime}${birthPlace}`);
  const rng = seededRandom(seed);

  const ascendant = Math.floor(rng() * 360);
  
  const placements: PlanetPlacement[] = PLANETS.map((planet, i) => {
    const degree = (ascendant + Math.floor(rng() * 360)) % 360;
    const signIndex = Math.floor(degree / 30);
    const house = ((Math.floor((degree - ascendant + 360) % 360 / 30)) % 12) + 1;
    return {
      planet: planet.name,
      sign: ZODIAC_SIGNS[signIndex].name,
      degree,
      house,
    };
  });

  const colors = [
    "hsl(40, 75%, 55%)",
    "hsl(200, 70%, 55%)",
    "hsl(330, 55%, 55%)",
    "hsl(150, 55%, 50%)",
    "hsl(280, 50%, 55%)",
    "hsl(15, 70%, 55%)",
  ];

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    birthDate,
    birthTime,
    birthPlace,
    color: colors[Math.floor(rng() * colors.length)],
    placements,
    ascendant,
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export function getAspects(chart1: NatalChart, chart2: NatalChart) {
  const aspects: { planet1: string; planet2: string; type: string; orb: number; chart1Name: string; chart2Name: string }[] = [];
  const aspectTypes = [
    { name: "Conjunction", angle: 0, orb: 8 },
    { name: "Sextile", angle: 60, orb: 6 },
    { name: "Square", angle: 90, orb: 7 },
    { name: "Trine", angle: 120, orb: 8 },
    { name: "Opposition", angle: 180, orb: 8 },
  ];

  for (const p1 of chart1.placements) {
    for (const p2 of chart2.placements) {
      const diff = Math.abs(p1.degree - p2.degree);
      const normalizedDiff = Math.min(diff, 360 - diff);
      
      for (const aspect of aspectTypes) {
        const orb = Math.abs(normalizedDiff - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            type: aspect.name,
            orb: Math.round(orb * 10) / 10,
            chart1Name: chart1.name,
            chart2Name: chart2.name,
          });
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb).slice(0, 15);
}

export function getCompatibilityScore(chart1: NatalChart, chart2: NatalChart): number {
  const aspects = getAspects(chart1, chart2);
  let score = 50;
  for (const aspect of aspects) {
    if (aspect.type === "Conjunction" || aspect.type === "Trine") score += 3;
    else if (aspect.type === "Sextile") score += 2;
    else if (aspect.type === "Square") score -= 1;
    else if (aspect.type === "Opposition") score += 1;
  }
  return Math.min(100, Math.max(0, score));
}
