import { NatalChart, PLANETS, ZODIAC_SIGNS } from "@/lib/astrology";

interface PlacementsListProps {
  chart: NatalChart;
}

const PlacementsList = ({ chart }: PlacementsListProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-display text-lg text-foreground mb-3" style={{ color: chart.color }}>
        {chart.name}'s Placements
      </h3>
      <div className="grid grid-cols-2 gap-1.5">
        {chart.placements.map((p) => {
          const planet = PLANETS.find(pl => pl.name === p.planet);
          const sign = ZODIAC_SIGNS.find(z => z.name === p.sign);
          return (
            <div key={p.planet} className="flex items-center gap-2 text-sm font-body py-1.5 px-2 rounded bg-muted/30">
              <span className="text-base" style={{ color: planet?.color }}>{planet?.symbol}</span>
              <span className="text-muted-foreground">{p.planet}</span>
              <span className="ml-auto text-foreground">{sign?.symbol} {p.sign}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlacementsList;
