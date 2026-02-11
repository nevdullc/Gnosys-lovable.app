import { useState } from "react";
import { NatalChart, generateChart } from "@/lib/astrology";
import StarField from "@/components/StarField";
import ChartWheel from "@/components/ChartWheel";
import BirthDataForm from "@/components/BirthDataForm";
import ProfileList from "@/components/ProfileList";
import PlacementsList from "@/components/PlacementsList";
import AspectTable from "@/components/AspectTable";
import heroCosmos from "@/assets/hero-cosmos.jpg";

const Index = () => {
  const [charts, setCharts] = useState<NatalChart[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAddChart = (data: { name: string; birthDate: string; birthTime: string; birthPlace: string }) => {
    const chart = generateChart(data.name, data.birthDate, data.birthTime, data.birthPlace);
    setCharts((prev) => [...prev, chart]);
    setSelectedIds((prev) => [...prev, chart.id]);
  };

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRemove = (id: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const selectedCharts = charts.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-cosmos relative">
      <StarField />

      {/* Hero */}
      {charts.length === 0 && (
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroCosmos}
              alt="Cosmic sky"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] px-4 pt-20 pb-8">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gradient-gold mb-4 text-center leading-tight">
              Gnosys
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-body font-light text-center max-w-lg">
              Map the stars of your soul. Compare cosmic connections with those you love.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {charts.length > 0 && (
          <h1 className="text-3xl font-display font-bold text-gradient-gold mb-8 text-center">Gnosys</h1>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <BirthDataForm onSubmit={handleAddChart} />
            <ProfileList
              charts={charts}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onRemove={handleRemove}
            />
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-9">
            {selectedCharts.length > 0 ? (
              <div className="space-y-8">
                {/* Chart Wheel */}
                <div className="flex justify-center">
                  <div className="glow-gold-strong rounded-full p-4 bg-card/30 backdrop-blur-sm">
                    <ChartWheel
                      charts={selectedCharts}
                      size={Math.min(500, typeof window !== "undefined" ? window.innerWidth - 80 : 500)}
                    />
                  </div>
                </div>

                {/* Placements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCharts.map((chart) => (
                    <div key={chart.id} className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-gold/10">
                      <PlacementsList chart={chart} />
                    </div>
                  ))}
                </div>

                {/* Synastry / Comparisons */}
                {selectedCharts.length >= 2 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display text-gradient-gold text-center">Cosmic Connections</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedCharts.map((c1, i) =>
                        selectedCharts.slice(i + 1).map((c2) => (
                          <div key={`${c1.id}-${c2.id}`} className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-gold/10">
                            <AspectTable chart1={c1} chart2={c2} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-6xl mb-4 animate-pulse-soft">✦</div>
                <p className="text-muted-foreground font-body text-lg">
                  Add a birth chart to begin your celestial journey
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
