import { useState } from "react";
import { NatalChart, PLANETS, ZODIAC_SIGNS } from "@/lib/astrology";
import { getNatalInterpretation } from "@/lib/natal-interpretations";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PlacementsListProps {
  chart: NatalChart;
}

const PlacementsList = ({ chart }: PlacementsListProps) => {
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  const toggle = (planet: string) => {
    setExpandedPlanet((prev) => (prev === planet ? null : planet));
  };

  return (
    <div className="space-y-2">
      <h3 className="font-display text-lg text-foreground mb-3" style={{ color: chart.color }}>
        {chart.name}'s Placements
      </h3>
      <div className="space-y-1.5">
        {chart.placements.map((p) => {
          const planet = PLANETS.find((pl) => pl.name === p.planet);
          const sign = ZODIAC_SIGNS.find((z) => z.name === p.sign);
          const isExpanded = expandedPlanet === p.planet;
          const interpretation = getNatalInterpretation(p.planet, p.sign);

          return (
            <div key={p.planet}>
              <button
                onClick={() => toggle(p.planet)}
                className="w-full flex items-center gap-2 text-sm font-body py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              >
                <span className="text-base" style={{ color: planet?.color }}>
                  {planet?.symbol}
                </span>
                <span className="text-muted-foreground">{p.planet}</span>
                <span className="ml-auto text-foreground">
                  {sign?.symbol} {p.sign}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {isExpanded && (
                <div className="px-3 py-2 mx-1 text-xs text-muted-foreground font-body leading-relaxed border-l-2 border-primary/20 mt-1 mb-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {interpretation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlacementsList;
