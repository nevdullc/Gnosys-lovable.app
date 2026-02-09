import { NatalChart, ZODIAC_SIGNS } from "@/lib/astrology";
import { Button } from "@/components/ui/button";
import { X, Eye, EyeOff } from "lucide-react";

interface ProfileListProps {
  charts: NatalChart[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const ProfileList = ({ charts, selectedIds, onToggle, onRemove }: ProfileListProps) => {
  if (charts.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-body text-muted-foreground uppercase tracking-widest mb-3">Charts</h3>
      {charts.map((chart) => {
        const isSelected = selectedIds.includes(chart.id);
        const sunSign = chart.placements.find(p => p.planet === "Sun")?.sign || "Unknown";
        const signData = ZODIAC_SIGNS.find(z => z.name === sunSign);

        return (
          <div
            key={chart.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              isSelected ? "bg-secondary border border-gold/30" : "bg-muted/30 border border-transparent hover:bg-muted/50"
            }`}
            onClick={() => onToggle(chart.id)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: chart.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-foreground truncate">{chart.name}</p>
              <p className="text-xs text-muted-foreground font-body">
                {signData?.symbol} {sunSign}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(chart.id); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSelected ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(chart.id); }}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileList;
