// Synastry interpretations for planet-aspect-planet combinations

const planetKeywords: Record<string, string> = {
  Sun: "identity and ego",
  Moon: "emotions and inner needs",
  Mercury: "communication and thinking",
  Venus: "love and values",
  Mars: "desire and drive",
  Jupiter: "growth and optimism",
  Saturn: "commitment and boundaries",
  Uranus: "excitement and unpredictability",
  Neptune: "dreams and spiritual connection",
  Pluto: "transformation and intensity",
};

const aspectEnergy: Record<string, { tone: "harmonious" | "challenging" | "intense"; verb: string }> = {
  Conjunction: { tone: "intense", verb: "merges with" },
  Trine: { tone: "harmonious", verb: "flows naturally with" },
  Sextile: { tone: "harmonious", verb: "gently supports" },
  Square: { tone: "challenging", verb: "challenges" },
  Opposition: { tone: "challenging", verb: "mirrors and polarises" },
};

// Notable pairings with custom flavor text
const specialPairings: Record<string, string> = {
  "Sun-Conjunction-Moon": "A profound soul bond — one person's core self illuminates the other's emotional world.",
  "Venus-Conjunction-Mars": "Magnetic physical and romantic attraction; passion runs deep between you.",
  "Venus-Trine-Mars": "An effortless romantic chemistry — affection and desire blend harmoniously.",
  "Venus-Square-Mars": "Intense attraction mixed with friction; sparks fly but so do arguments.",
  "Moon-Conjunction-Moon": "You feel emotionally at home with each other — deep mutual understanding.",
  "Moon-Trine-Venus": "Tender emotional warmth; you naturally comfort and nurture one another.",
  "Sun-Conjunction-Sun": "You recognise yourselves in each other — a powerful sense of kinship.",
  "Sun-Opposition-Moon": "A yin-yang dynamic; you balance each other but may pull in opposite directions.",
  "Venus-Conjunction-Venus": "You share the same love language — easy affection and mutual appreciation.",
  "Mars-Conjunction-Mars": "High energy together; you push each other forward but may clash over control.",
  "Sun-Square-Saturn": "Growth through friction — one may feel restricted by the other's expectations.",
  "Moon-Square-Saturn": "Emotional walls can arise; patience is needed to build lasting trust.",
  "Venus-Conjunction-Jupiter": "A joyful, generous connection — you uplift and celebrate each other.",
  "Sun-Trine-Jupiter": "Mutual encouragement and optimism; you bring out each other's confidence.",
  "Moon-Conjunction-Neptune": "A dreamy, almost psychic bond — you intuit each other's feelings deeply.",
  "Venus-Opposition-Pluto": "Obsessive attraction and deep emotional undercurrents; transformative love.",
  "Sun-Conjunction-Pluto": "An intense, life-changing connection — power dynamics require awareness.",
  "Mercury-Conjunction-Mercury": "You think alike and finish each other's sentences — easy communication.",
  "Mercury-Square-Mercury": "Different communication styles lead to misunderstandings; active listening helps.",
};

export function getAspectInterpretation(planet1: string, planet2: string, aspectType: string): string {
  // Check for special pairings (both orderings)
  const key1 = `${planet1}-${aspectType}-${planet2}`;
  const key2 = `${planet2}-${aspectType}-${planet1}`;
  if (specialPairings[key1]) return specialPairings[key1];
  if (specialPairings[key2]) return specialPairings[key2];

  // Generate a generic interpretation
  const energy = aspectEnergy[aspectType];
  const p1 = planetKeywords[planet1] || planet1.toLowerCase();
  const p2 = planetKeywords[planet2] || planet2.toLowerCase();

  if (!energy) return `${planet1} connects with ${planet2}.`;

  const prefix = energy.tone === "harmonious"
    ? "A supportive link:"
    : energy.tone === "challenging"
    ? "A growth edge:"
    : "A potent connection:";

  return `${prefix} ${planet1}'s ${p1} ${energy.verb} ${planet2}'s ${p2}.`;
}

export function getRelationshipSummary(
  aspects: { planet1: string; planet2: string; type: string; orb: number }[]
): string {
  const harmonious = aspects.filter(a => ["Trine", "Sextile", "Conjunction"].includes(a.type)).length;
  const challenging = aspects.filter(a => ["Square", "Opposition"].includes(a.type)).length;
  const total = aspects.length;

  if (total === 0) return "Not enough planetary connections to read — try adding birth times for more detail.";

  const ratio = harmonious / total;

  if (ratio > 0.7) return "A deeply harmonious connection — you naturally understand and uplift each other. This bond feels effortless and nurturing.";
  if (ratio > 0.5) return "A balanced relationship with strong compatibility and just enough creative tension to keep things interesting.";
  if (ratio > 0.3) return "A dynamic connection full of growth opportunities. The friction between you sparks transformation and deeper understanding.";
  return "An intense, catalytic bond. You challenge each other profoundly — this relationship demands growth and self-awareness.";
}
