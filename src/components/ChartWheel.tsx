import { NatalChart, ZODIAC_SIGNS, PLANETS } from "@/lib/astrology";

interface ChartWheelProps {
  charts: NatalChart[];
  size?: number;
}

const ChartWheel = ({ charts, size = 400 }: ChartWheelProps) => {
  const center = size / 2;
  const outerR = size / 2 - 10;
  const zodiacR = outerR - 30;
  const innerR = zodiacR - 25;
  const planetR = innerR - 30;

  const polarToXY = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
      {/* Outer circle */}
      <circle cx={center} cy={center} r={outerR} fill="none" stroke="hsl(var(--gold) / 0.3)" strokeWidth="1.5" />
      <circle cx={center} cy={center} r={zodiacR} fill="none" stroke="hsl(var(--gold) / 0.2)" strokeWidth="1" />
      <circle cx={center} cy={center} r={innerR} fill="none" stroke="hsl(var(--gold) / 0.15)" strokeWidth="1" />
      <circle cx={center} cy={center} r={planetR - 15} fill="hsl(var(--midnight))" stroke="hsl(var(--gold) / 0.1)" strokeWidth="0.5" />

      {/* Zodiac divisions & labels */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const startAngle = i * 30;
        const midAngle = startAngle + 15;
        const start = polarToXY(startAngle, outerR);
        const end = polarToXY(startAngle, innerR);
        const labelPos = polarToXY(midAngle, (zodiacR + outerR) / 2);

        return (
          <g key={sign.name}>
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="hsl(var(--gold) / 0.2)" strokeWidth="0.5" />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="hsl(var(--gold) / 0.7)"
              fontSize="14"
              className="font-body"
            >
              {sign.symbol}
            </text>
          </g>
        );
      })}

      {/* House lines */}
      {charts[0] && Array.from({ length: 12 }, (_, i) => {
        const angle = (charts[0].ascendant + i * 30) % 360;
        const start = polarToXY(angle, innerR);
        const end = polarToXY(angle, planetR - 15);
        return (
          <line key={`house-${i}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="hsl(var(--gold) / 0.1)" strokeWidth="0.5" />
        );
      })}

      {/* Planet placements for each chart */}
      {charts.map((chart, chartIdx) => {
        const offset = chartIdx * 12; // offset planets slightly per chart
        return chart.placements.map((placement, i) => {
          const planet = PLANETS.find(p => p.name === placement.planet);
          if (!planet) return null;
          const adjustedR = planetR - offset;
          const pos = polarToXY(placement.degree, adjustedR);

          return (
            <g key={`${chart.id}-${placement.planet}`}>
              <circle cx={pos.x} cy={pos.y} r={4} fill={chart.color} opacity={0.3} />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={chart.color}
                fontSize={chartIdx === 0 ? "12" : "10"}
                className="font-body"
              >
                {planet.symbol}
              </text>
            </g>
          );
        });
      })}

      {/* Ascendant marker */}
      {charts[0] && (() => {
        const ascPos = polarToXY(charts[0].ascendant, outerR + 5);
        return (
          <text
            x={ascPos.x}
            y={ascPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="hsl(var(--gold))"
            fontSize="10"
            fontWeight="bold"
            className="font-body"
          >
            AC
          </text>
        );
      })()}
    </svg>
  );
};

export default ChartWheel;
