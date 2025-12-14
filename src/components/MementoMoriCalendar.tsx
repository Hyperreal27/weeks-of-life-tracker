import { useState, useMemo, useRef } from "react";
import { differenceInWeeks } from "date-fns";
import { Download, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import marcusAurelius from "@/assets/marcus-aurelius.png";

const WEEKS_PER_YEAR = 52;

const MementoMoriCalendar = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [showFilled, setShowFilled] = useState(true);
  const [totalYears, setTotalYears] = useState<number>(80);
  const [boxSize, setBoxSize] = useState<number>(14);
  const [bgOpacity, setBgOpacity] = useState<number>(20);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const totalWeeks = totalYears * WEEKS_PER_YEAR;

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
    return ((weeksLived / totalWeeks) * 100).toFixed(1);
  }, [weeksLived, totalWeeks]);

  const weeksRemaining = useMemo(() => {
    return Math.max(0, totalWeeks - weeksLived);
  }, [weeksLived, totalWeeks]);

  const handleClear = () => {
    setBirthDate("");
    setShowFilled(true);
    setTotalYears(80);
    setBoxSize(14);
    setBgOpacity(20);
    toast({
      title: "Limpiado",
      description: "Se han restablecido todos los valores.",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Imprimiendo calendario",
      description: "Se abrirá el diálogo de impresión.",
    });
  };

  const handleDownloadSVG = () => {
    if (!calendarRef.current) return;

    const gap = 2;
    const yearLabelWidth = 30;
    const rightLabelWidth = 30;
    const headerHeight = 60;
    const weekHeaderHeight = 20;
    const footerHeight = 80;
    const padding = 20;
    
    const gridWidth = WEEKS_PER_YEAR * (boxSize + gap);
    const gridHeight = totalYears * (boxSize + gap);
    
    const svgWidth = padding + yearLabelWidth + gridWidth + rightLabelWidth + padding;
    const svgHeight = padding + headerHeight + weekHeaderHeight + gridHeight + footerHeight + padding;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">`;
    
    // Background
    svgContent += `<rect width="100%" height="100%" fill="white"/>`;
    
    // Marcus Aurelius background image (centered)
    const imgWidth = gridWidth * 0.6;
    const imgHeight = gridHeight * 0.8;
    const imgX = padding + yearLabelWidth + (gridWidth - imgWidth) / 2;
    const imgY = padding + headerHeight + weekHeaderHeight + (gridHeight - imgHeight) / 2;
    svgContent += `<image href="${marcusAurelius}" x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" opacity="${bgOpacity / 100}" preserveAspectRatio="xMidYMid meet"/>`;
    
    // Title
    svgContent += `<text x="${svgWidth / 2}" y="${padding + 35}" text-anchor="middle" font-family="serif" font-size="28" letter-spacing="12" fill="#1a1a1a">MEMENTO MORI</text>`;
    
    // Week numbers header
    for (let week = 0; week < WEEKS_PER_YEAR; week++) {
      if ((week + 1) % 5 === 0 || week === 0) {
        const x = padding + yearLabelWidth + week * (boxSize + gap) + boxSize / 2;
        const y = padding + headerHeight + 12;
        svgContent += `<text x="${x}" y="${y}" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#888">${week + 1}</text>`;
      }
    }
    
    // Grid
    for (let year = 0; year < totalYears; year++) {
      const y = padding + headerHeight + weekHeaderHeight + year * (boxSize + gap);
      
      for (let week = 0; week < WEEKS_PER_YEAR; week++) {
        const weekNumber = year * WEEKS_PER_YEAR + week;
        const isLived = showFilled && weekNumber < weeksLived;
        const x = padding + yearLabelWidth + week * (boxSize + gap);
        
        svgContent += `<rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" fill="${isLived ? '#333' : 'white'}" stroke="#ccc" stroke-width="0.5"/>`;
      }
      
      // Year labels on the right (every 5 years)
      if ((year + 1) % 5 === 0) {
        const labelX = padding + yearLabelWidth + gridWidth + 8;
        const labelY = y + boxSize / 2 + 3;
        svgContent += `<text x="${labelX}" y="${labelY}" font-family="sans-serif" font-size="8" fill="#888">${year + 1}</text>`;
      }
    }
    
    // Footer quote
    const quoteY = padding + headerHeight + weekHeaderHeight + gridHeight + 30;
    svgContent += `<text x="${svgWidth / 2}" y="${quoteY}" text-anchor="middle" font-family="serif" font-size="11" font-style="italic" fill="#666">"No es la muerte lo que un hombre debe temer,</text>`;
    svgContent += `<text x="${svgWidth / 2}" y="${quoteY + 16}" text-anchor="middle" font-family="serif" font-size="11" font-style="italic" fill="#666">sino nunca comenzar a vivir."</text>`;
    svgContent += `<text x="${svgWidth / 2}" y="${quoteY + 36}" text-anchor="middle" font-family="sans-serif" font-size="9" letter-spacing="3" fill="#888">— MARCUS AURELIUS —</text>`;
    
    svgContent += `</svg>`;
    
    // Download
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "memento-mori-calendar.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Descarga completada",
      description: "Tu calendario se ha descargado como SVG.",
    });
  };

  const renderWeekGrid = () => {
    const rows = [];
    
    for (let year = 0; year < totalYears; year++) {
      const weekBoxes = [];
      
      for (let week = 0; week < WEEKS_PER_YEAR; week++) {
        const weekNumber = year * WEEKS_PER_YEAR + week;
        const isLived = showFilled && weekNumber < weeksLived;
        
        weekBoxes.push(
          <div
            key={`${year}-${week}`}
            style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
            className={`border transition-all duration-150 ${
              isLived 
                ? "bg-foreground/80 border-foreground/60" 
                : "bg-transparent border-foreground/20"
            }`}
          />
        );
      }
      
      rows.push(
        <div key={year} className="flex gap-[2px] items-center">
          <div className="flex gap-[2px]">{weekBoxes}</div>
          {(year + 1) % 5 === 0 && (
            <span className="w-8 text-[10px] text-muted-foreground text-left pl-2">
              {year + 1}
            </span>
          )}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <section className="py-20 bg-background print-calendar">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-12">
          {/* Controls Panel */}
          <div className="space-y-6 no-print">
            <div className="card-elevated p-6 space-y-6">
              <h3 className="text-title">Tu información</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm text-muted-foreground">
                    Fecha de nacimiento
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="input-minimal w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Años a mostrar
                    </Label>
                    <Input
                      type="number"
                      value={totalYears}
                      onChange={(e) => setTotalYears(Math.max(1, Math.min(120, parseInt(e.target.value) || 80)))}
                      className="input-minimal"
                      min={1}
                      max={120}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Tamaño cuadro
                    </Label>
                    <Input
                      type="number"
                      value={boxSize}
                      onChange={(e) => setBoxSize(Math.max(6, Math.min(24, parseInt(e.target.value) || 14)))}
                      className="input-minimal"
                      min={6}
                      max={24}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 py-2 px-3 border border-border rounded-md">
                  <input
                    type="checkbox"
                    id="showFilled"
                    checked={showFilled}
                    onChange={(e) => setShowFilled(e.target.checked)}
                    className="w-4 h-4 accent-foreground"
                  />
                  <Label htmlFor="showFilled" className="text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Rellenar semanas vividas
                  </Label>
                </div>

                <Button 
                  variant="outline"
                  onClick={handleClear}
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Limpiar todo
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="card-elevated p-6 space-y-4">
              <h3 className="text-title">Estadísticas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-3xl font-serif font-bold">{weeksLived.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Semanas vividas
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-3xl font-serif font-bold">{weeksRemaining.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Semanas restantes
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-3xl font-serif font-bold">{yearsLived}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Años vividos
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-3xl font-serif font-bold">{percentageLived}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Vida transcurrida
                  </p>
                </div>
              </div>
            </div>

            {/* Background Opacity */}
            <div className="card-elevated p-6 space-y-4">
              <h3 className="text-title">Opacidad del fondo</h3>
              <Slider
                value={[bgOpacity]}
                onValueChange={(value) => setBgOpacity(value[0])}
                min={0}
                max={50}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">{bgOpacity}%</p>
            </div>
          </div>

          {/* Calendar Display */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 no-print">
              <Button 
                variant="outline"
                onClick={handleDownloadSVG}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar SVG
              </Button>
              <Button 
                onClick={handlePrint}
                className="btn-stoic flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir (35×45cm)
              </Button>
            </div>

            <div 
              ref={calendarRef}
              className="card-elevated p-8 bg-card relative overflow-hidden"
            >
              {/* Background Marcus Aurelius */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: bgOpacity / 100 }}
              >
                <img 
                  src={marcusAurelius} 
                  alt="Marcus Aurelius" 
                  className="w-[60%] h-[80%] object-contain"
                />
              </div>
              
              {/* Header */}
              <div className="relative z-10 text-center mb-6">
                <h2 className="text-display tracking-[0.3em]">MEMENTO MORI</h2>
              </div>

              {/* Week Numbers Header */}
              <div className="relative z-10 flex gap-[2px] mb-2">
                {Array.from({ length: WEEKS_PER_YEAR }, (_, i) => (
                  <div 
                    key={i} 
                    className="text-center"
                    style={{ width: `${boxSize}px` }}
                  >
                    {((i + 1) % 5 === 0 || i === 0) && (
                      <span className="text-[8px] text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="relative z-10 space-y-[2px]">
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
      </div>
    </section>
  );
};

export default MementoMoriCalendar;
