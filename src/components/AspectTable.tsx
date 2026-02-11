import { NatalChart, getAspects, getCompatibilityScore } from "@/lib/astrology";
import { getAspectInterpretation, getRelationshipSummary } from "@/lib/synastry-interpretations";

interface AspectTableProps {
  chart1: NatalChart;
  chart2: NatalChart;
}

const aspectColors: Record<string, string> = {
  Conjunction: "text-primary",
  Trine: "text-green-400",
  Sextile: "text-blue-400",
  Square: "text-red-400",
  Opposition: "text-orange-400",
};

const aspectIcons: Record<string, string> = {
  Conjunction: "☌",
  Trine: "△",
  Sextile: "⚹",
  Square: "□",
  Opposition: "☍",
};

const AspectTable = ({ chart1, chart2 }: AspectTableProps) => {
  const aspects = getAspects(chart1, chart2);
  const score = getCompatibilityScore(chart1, chart2);
  const summary = getRelationshipSummary(aspects);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-foreground">
          <span style={{ color: chart1.color }}>{chart1.name}</span>
          {" "}×{" "}
          <span style={{ color: chart2.color }}>{chart2.name}</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-body">Harmony</span>
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-sm font-body text-primary font-medium">{score}%</span>
        </div>
      </div>

      {/* Relationship summary */}
      <p className="text-sm font-body text-muted-foreground italic leading-relaxed border-l-2 border-primary/30 pl-3">
        {summary}
      </p>

      {aspects.length > 0 ? (
        <div className="space-y-3">
          {aspects.slice(0, 10).map((aspect, i) => {
            const interpretation = getAspectInterpretation(aspect.planet1, aspect.planet2, aspect.type);
            return (
              <div key={i} className="rounded-lg bg-muted/30 p-3 space-y-1">
                <div className="flex items-center gap-2 text-sm font-body">
                  <span className="text-muted-foreground w-16 truncate">{aspect.planet1}</span>
                  <span className={`font-medium ${aspectColors[aspect.type] || "text-foreground"}`}>
                    {aspectIcons[aspect.type] || ""} {aspect.type}
                  </span>
                  <span className="text-muted-foreground w-16 truncate">{aspect.planet2}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{aspect.orb}°</span>
                </div>
                <p className="text-xs text-muted-foreground/80 font-body leading-relaxed pl-1">
                  {interpretation}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground font-body italic">No major aspects found.</p>
      )}
    </div>
  );
};

export default AspectTable;
