import { useState, useMemo, useRef } from "react";
import { differenceInWeeks } from "date-fns";
import { Download, Printer, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import marcusAurelius from "@/assets/marcus-aurelius.png";

const TOTAL_YEARS = 80;
const WEEKS_PER_YEAR = 52;
const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR;

const MementoMoriCalendar = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [showFilled, setShowFilled] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const weeksLived = useMemo(() => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    return Math.max(0, differenceInWeeks(today, birth));
  }, [birthDate]);

  const yearsLived = useMemo(() => {
    return (weeksLived / WEEKS_PER_YEAR).toFixed(1);
  }, [weeksLived]);

  const percentageLived = useMemo(() => {
    return ((weeksLived / TOTAL_WEEKS) * 100).toFixed(1);
  }, [weeksLived]);

  const weeksRemaining = useMemo(() => {
    return Math.max(0, TOTAL_WEEKS - weeksLived);
  }, [weeksLived]);

  const handlePrint = () => {
    window.print();
    toast({
      title: "Imprimiendo calendario",
      description: "Se abrirá el diálogo de impresión.",
    });
  };

  const renderWeekGrid = () => {
    const rows = [];
    
    for (let year = 0; year < TOTAL_YEARS; year++) {
      const weekBoxes = [];
      
      for (let week = 0; week < WEEKS_PER_YEAR; week++) {
        const weekNumber = year * WEEKS_PER_YEAR + week;
        const isLived = showFilled && weekNumber < weeksLived;
        
        weekBoxes.push(
          <div
            key={`${year}-${week}`}
            className={`w-2 h-2 border transition-all duration-150 ${
              isLived 
                ? "bg-foreground/80 border-foreground/60" 
                : "bg-transparent border-foreground/20"
            }`}
          />
        );
      }
      
      rows.push(
        <div key={year} className="flex gap-[1px] items-center">
          <span className="w-6 text-[8px] text-muted-foreground text-right pr-1">
            {year + 1}
          </span>
          <div className="flex gap-[1px]">{weekBoxes}</div>
        </div>
      );
    }
    
    return rows;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-12">
          {/* Controls Panel */}
          <div className="space-y-8 no-print">
            <div className="card-elevated p-6 space-y-6">
              <h3 className="text-title">Tu información</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm text-muted-foreground">
                    Fecha de nacimiento
                  </Label>
                  <div className="relative">
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="input-minimal w-full"
                    />
                    <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showFilled"
                    checked={showFilled}
                    onChange={(e) => setShowFilled(e.target.checked)}
                    className="w-4 h-4 accent-foreground"
                  />
                  <Label htmlFor="showFilled" className="text-sm">
                    Rellenar semanas vividas
                  </Label>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="card-elevated p-6 space-y-4">
              <h3 className="text-title">Estadísticas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-3xl font-serif font-bold">{weeksLived.toLocaleString()}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    Semanas vividas
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-3xl font-serif font-bold">{weeksRemaining.toLocaleString()}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    Semanas restantes
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-3xl font-serif font-bold">{yearsLived}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    Años vividos
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-3xl font-serif font-bold">{percentageLived}%</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    Vida transcurrida
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handlePrint}
                className="btn-stoic flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir (35x45cm)
              </Button>
            </div>
          </div>

          {/* Calendar Display */}
          <div 
            ref={calendarRef}
            className="card-elevated p-8 bg-card relative overflow-hidden"
          >
            {/* Background Marcus Aurelius */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <img 
                src={marcusAurelius} 
                alt="Marcus Aurelius" 
                className="w-auto h-[80%] object-contain"
              />
            </div>
            
            {/* Header */}
            <div className="relative z-10 text-center mb-8">
              <h2 className="text-display tracking-[0.3em]">MEMENTO MORI</h2>
            </div>

            {/* Week Numbers Header */}
            <div className="relative z-10 flex gap-[1px] mb-2 ml-7">
              {Array.from({ length: WEEKS_PER_YEAR }, (_, i) => (
                <div key={i} className="w-2 text-center">
                  {(i + 1) % 5 === 0 && (
                    <span className="text-[6px] text-muted-foreground">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="relative z-10 space-y-[1px]">
              {renderWeekGrid()}
            </div>

            {/* Footer Quote */}
            <div className="relative z-10 text-center mt-8 space-y-2">
              <p className="font-serif text-sm italic text-muted-foreground">
                "No es la muerte lo que un hombre debe temer,
              </p>
              <p className="font-serif text-sm italic text-muted-foreground">
                sino nunca comenzar a vivir."
              </p>
              <p className="text-xs tracking-widest text-muted-foreground mt-2">
                — MARCUS AURELIUS —
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MementoMoriCalendar;
