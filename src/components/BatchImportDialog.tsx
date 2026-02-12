import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ListPlus } from "lucide-react";
import { toast } from "sonner";

interface BatchImportDialogProps {
  onImport: (entries: { name: string; birthDate: string; birthTime: string; birthPlace: string }[]) => void;
  isLoading?: boolean;
}

const PLACEHOLDER = `Luna, 1990-03-15, 14:30, New York NY
Sol, 1988-07-22, 08:00, Los Angeles CA
Nova, 1995-12-01, 23:15, Chicago IL`;

const BatchImportDialog = ({ onImport, isLoading }: BatchImportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleImport = () => {
    const lines = text.trim().split("\n").filter((l) => l.trim());
    if (lines.length === 0) {
      toast.error("No entries found. Add one person per line.");
      return;
    }

    const entries: { name: string; birthDate: string; birthTime: string; birthPlace: string }[] = [];
    const errors: string[] = [];

    lines.forEach((line, i) => {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length < 4) {
        errors.push(`Line ${i + 1}: expected 4 fields (name, date, time, place)`);
        return;
      }
      const [name, birthDate, birthTime, ...placeArr] = parts;
      const birthPlace = placeArr.join(", ");

      if (!name || !birthDate || !birthTime || !birthPlace) {
        errors.push(`Line ${i + 1}: missing fields`);
        return;
      }

      // Basic date validation (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        errors.push(`Line ${i + 1}: date must be YYYY-MM-DD`);
        return;
      }

      // Basic time validation (HH:MM)
      if (!/^\d{1,2}:\d{2}$/.test(birthTime)) {
        errors.push(`Line ${i + 1}: time must be HH:MM`);
        return;
      }

      entries.push({ name, birthDate, birthTime, birthPlace });
    });

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    onImport(entries);
    setText("");
    setOpen(false);
    toast.success(`Importing ${entries.length} chart${entries.length > 1 ? "s" : ""}…`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full border-gold/20 text-muted-foreground hover:text-primary hover:border-primary/50 font-body">
          <ListPlus className="h-4 w-4 mr-2" />
          Batch Import
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-card border-gold/20 w-[380px] sm:w-[440px]">
        <SheetHeader>
          <SheetTitle className="text-primary font-display">Batch Import</SheetTitle>
          <SheetDescription className="text-muted-foreground font-body text-sm">
            One person per line, comma-separated:<br />
            <code className="text-xs text-primary/70">Name, YYYY-MM-DD, HH:MM, City</code>
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            className="bg-secondary border-gold/20 focus:border-primary min-h-[200px] font-mono text-sm"
            rows={8}
          />
          <Button
            onClick={handleImport}
            disabled={isLoading || !text.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-body font-medium"
          >
            {isLoading ? "Importing…" : "Import All ✨"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BatchImportDialog;
