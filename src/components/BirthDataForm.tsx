import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface BirthDataFormProps {
  onSubmit: (data: { name: string; birthDate: string; birthTime: string; birthPlace: string }) => void;
  isLoading?: boolean;
}

const BirthDataForm = ({ onSubmit, isLoading }: BirthDataFormProps) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && birthDate && birthTime && birthPlace) {
      onSubmit({ name, birthDate, birthTime, birthPlace });
      setName("");
      setBirthDate("");
      setBirthTime("");
      setBirthPlace("");
    }
  };

  return (
    <Card className="border-gold glow-gold bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-display text-xl">
          <Sparkles className="h-5 w-5" />
          Add Birth Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground text-sm font-body">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Luna"
              className="bg-secondary border-gold/20 focus:border-primary"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-muted-foreground text-sm font-body">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-secondary border-gold/20 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthTime" className="text-muted-foreground text-sm font-body">Birth Time</Label>
              <Input
                id="birthTime"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="bg-secondary border-gold/20 focus:border-primary"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthPlace" className="text-muted-foreground text-sm font-body">Birth Place</Label>
            <Input
              id="birthPlace"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="e.g. New York, NY"
              className="bg-secondary border-gold/20 focus:border-primary"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-body font-medium">
            {isLoading ? "Mapping the stars…" : "Generate Chart ✨"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BirthDataForm;
