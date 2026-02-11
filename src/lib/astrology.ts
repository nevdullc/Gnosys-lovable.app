import * as Astronomy from "astronomy-engine";

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
  { name: "Sun", symbol: "☉", color: "hsl(40, 75%, 55%)", body: Astronomy.Body.Sun },
  { name: "Moon", symbol: "☽", color: "hsl(220, 20%, 80%)", body: Astronomy.Body.Moon },
  { name: "Mercury", symbol: "☿", color: "hsl(180, 40%, 60%)", body: Astronomy.Body.Mercury },
  { name: "Venus", symbol: "♀", color: "hsl(330, 50%, 65%)", body: Astronomy.Body.Venus },
  { name: "Mars", symbol: "♂", color: "hsl(0, 60%, 55%)", body: Astronomy.Body.Mars },
  { name: "Jupiter", symbol: "♃", color: "hsl(30, 50%, 55%)", body: Astronomy.Body.Jupiter },
  { name: "Saturn", symbol: "♄", color: "hsl(45, 20%, 50%)", body: Astronomy.Body.Saturn },
  { name: "Uranus", symbol: "♅", color: "hsl(190, 60%, 55%)", body: Astronomy.Body.Uranus },
  { name: "Neptune", symbol: "♆", color: "hsl(230, 60%, 60%)", body: Astronomy.Body.Neptune },
  { name: "Pluto", symbol: "♇", color: "hsl(280, 30%, 50%)", body: Astronomy.Body.Pluto },
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

function degToSign(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const idx = Math.floor(normalized / 30);
  return ZODIAC_SIGNS[idx].name;
}

function getEclipticLongitude(body: Astronomy.Body, date: Date): number {
  if (body === Astronomy.Body.Sun) {
    const sunPos = Astronomy.SunPosition(date);
    return ((sunPos.elon % 360) + 360) % 360;
  }
  const lon = Astronomy.EclipticLongitude(body, date);
  return ((lon % 360) + 360) % 360;
}

// Approximate ascendant from birth time and date using GMST
function calcAscendant(date: Date, latDeg: number): number {
  // Local Sidereal Time approximation
  const gmst = Astronomy.SiderealTime(date); // hours
  // Assume longitude 0 for simplicity (place isn't geocoded)
  const lst = gmst * 15; // convert hours to degrees
  // Ascendant ≈ LST + correction for latitude (simplified)
  const obliquity = 23.4393; // Earth's axial tilt
  const latRad = (latDeg * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;
  const lstRad = (lst * Math.PI) / 180;
  const asc = Math.atan2(
    Math.cos(lstRad),
    -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
  );
  let ascDeg = ((asc * 180) / Math.PI + 360) % 360;
  return ascDeg;
}

export function generateChart(name: string, birthDate: string, birthTime: string, birthPlace: string): NatalChart {
  // Parse birth datetime
  const [hours, minutes] = birthTime.split(":").map(Number);
  const dateObj = new Date(birthDate + "T00:00:00Z");
  dateObj.setUTCHours(hours, minutes, 0, 0);

  // Calculate accurate planetary positions
  const ascendant = calcAscendant(dateObj, 40); // default ~40° latitude

  const placements: PlanetPlacement[] = PLANETS.map((planet) => {
    const degree = getEclipticLongitude(planet.body, dateObj);
    const sign = degToSign(degree);
    const house = ((Math.floor(((degree - ascendant + 360) % 360) / 30)) % 12) + 1;
    return { planet: planet.name, sign, degree: Math.round(degree * 100) / 100, house };
  });

  const seed = hashString(`${name}${birthDate}${birthTime}${birthPlace}`);
  const rng = seededRandom(seed);
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
    ascendant: Math.round(ascendant * 100) / 100,
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
