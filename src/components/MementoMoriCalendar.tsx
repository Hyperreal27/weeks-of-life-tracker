import { useState, useMemo, useRef, useEffect } from "react";
import { differenceInWeeks } from "date-fns";
import { Download, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import marcusAurelius from "@/assets/marcus-aurelius.png";
import piecesOfLifeLogo from "@/assets/pieces-of-life-logo.png";

const WEEKS_PER_YEAR = 52;
const HALF_YEAR_WEEKS = 26;

// Convert image to base64 for SVG embedding
const imageToBase64 = (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

const MementoMoriCalendar = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [showFilled, setShowFilled] = useState(true);
  const [totalYears, setTotalYears] = useState<number>(80);
  const [boxSize, setBoxSize] = useState<number>(14);
  const [bgOpacity, setBgOpacity] = useState<number>(20);
  const [isMobile, setIsMobile] = useState(false);
  const [marcusBase64, setMarcusBase64] = useState<string>("");
  const [logoBase64, setLogoBase64] = useState<string>("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check for mobile and preload base64 images
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Preload images as base64
    imageToBase64(marcusAurelius).then(setMarcusBase64).catch(console.error);
    imageToBase64(piecesOfLifeLogo).then(setLogoBase64).catch(console.error);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleDownloadSVG = async () => {
    if (!calendarRef.current) return;

    const gap = 2;
    const midGap = 8; // Gap between first and second half of year
    const yearLabelWidth = 30;
    const rightLabelWidth = 30;
    const headerHeight = 60;
    const weekHeaderHeight = 20;
    const footerHeight = 120;
    const padding = 20;
    
    const gridWidth = WEEKS_PER_YEAR * (boxSize + gap) + midGap;
    const gridHeight = totalYears * (boxSize + gap);
    
    const svgWidth = padding + yearLabelWidth + gridWidth + rightLabelWidth + padding;
    const svgHeight = padding + headerHeight + weekHeaderHeight + gridHeight + footerHeight + padding;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">`;
    
    // Background
    svgContent += `<rect width="100%" height="100%" fill="white"/>`;
    
    // Marcus Aurelius background image (centered) - use base64
    if (marcusBase64) {
      const imgWidth = gridWidth * 0.6;
      const imgHeight = gridHeight * 0.8;
      const imgX = padding + yearLabelWidth + (gridWidth - imgWidth) / 2;
      const imgY = padding + headerHeight + weekHeaderHeight + (gridHeight - imgHeight) / 2;
      svgContent += `<image href="${marcusBase64}" x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" opacity="${bgOpacity / 100}" preserveAspectRatio="xMidYMid meet"/>`;
    }
    
    // Title
    svgContent += `<text x="${svgWidth / 2}" y="${padding + 35}" text-anchor="middle" font-family="serif" font-size="28" letter-spacing="12" fill="#1a1a1a">MEMENTO MORI</text>`;
    
    // Week numbers header
    for (let week = 0; week < WEEKS_PER_YEAR; week++) {
      if ((week + 1) % 5 === 0 || week === 0) {
        const extraGap = week >= HALF_YEAR_WEEKS ? midGap : 0;
        const x = padding + yearLabelWidth + week * (boxSize + gap) + extraGap + boxSize / 2;
        const y = padding + headerHeight + 12;
        svgContent += `<text x="${x}" y="${y}" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#888">${week + 1}</text>`;
      }
    }
    
    // Grid with mid-year separation
    for (let year = 0; year < totalYears; year++) {
      const y = padding + headerHeight + weekHeaderHeight + year * (boxSize + gap);
      
      for (let week = 0; week < WEEKS_PER_YEAR; week++) {
        const weekNumber = year * WEEKS_PER_YEAR + week;
        const isLived = showFilled && weekNumber < weeksLived;
        const extraGap = week >= HALF_YEAR_WEEKS ? midGap : 0;
        const x = padding + yearLabelWidth + week * (boxSize + gap) + extraGap;
        
        svgContent += `<rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" fill="${isLived ? '#333' : 'white'}" stroke="#ccc" stroke-width="0.5"/>`;
      }
      
      // Year labels on the right (every 5 years)
      if ((year + 1) % 5 === 0) {
        const labelX = padding + yearLabelWidth + gridWidth + 8;
        const labelY = y + boxSize / 2 + 3;
        svgContent += `<text x="${labelX}" y="${labelY}" font-family="sans-serif" font-size="8" fill="#888">${year + 1}</text>`;
      }
    }
    
    // Footer quote (Seneca)
    const quoteY = padding + headerHeight + weekHeaderHeight + gridHeight + 25;
    const quoteText = "No es que tengamos poco tiempo para vivir, sino que desperdiciamos mucho de él. La vida es bastante larga y nos ha sido dada en medida suficientemente generosa para permitirnos lograr las mayores cosas si toda ella se invierte bien.";
    
    const fontSize = 9;
    svgContent += `<text x="${svgWidth / 2}" y="${quoteY}" text-anchor="middle" font-family="serif" font-size="${fontSize}" fill="#666">`;
    svgContent += quoteText;
    svgContent += `</text>`;
    
    svgContent += `<text x="${svgWidth / 2}" y="${quoteY + 18}" text-anchor="middle" font-family="sans-serif" font-size="9" letter-spacing="2" fill="#888">SENECA</text>`;
    
    // Logo - use base64
    if (logoBase64) {
      const logoY = quoteY + 40;
      const logoWidth = 80;
      const logoHeight = 40;
      const logoX = (svgWidth - logoWidth) / 2;
      svgContent += `<image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet"/>`;
    }
    
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

  // Calculate responsive box size for mobile - fits 52 weeks + mid-year gap
  const mobileBoxSize = isMobile ? Math.max(3, Math.floor((window.innerWidth - 60) / (WEEKS_PER_YEAR + 3))) : boxSize;

  const renderWeekGrid = (customBoxSize: number) => {
    const rows = [];
    
    for (let year = 0; year < totalYears; year++) {
      const firstHalfWeeks = [];
      const secondHalfWeeks = [];
      
      for (let week = 0; week < WEEKS_PER_YEAR; week++) {
        const weekNumber = year * WEEKS_PER_YEAR + week;
        const isLived = showFilled && weekNumber < weeksLived;
        
        const weekBox = (
          <div
            key={`${year}-${week}`}
            style={{ 
              width: `${customBoxSize}px`, 
              height: `${customBoxSize}px`,
              minWidth: `${customBoxSize}px`,
              minHeight: `${customBoxSize}px`
            }}
            className={`border transition-all duration-150 flex-shrink-0 ${
              isLived 
                ? "bg-foreground/80 border-foreground/60" 
                : "bg-transparent border-foreground/20"
            }`}
          />
        );
        
        if (week < HALF_YEAR_WEEKS) {
          firstHalfWeeks.push(weekBox);
        } else {
          secondHalfWeeks.push(weekBox);
        }
      }
      
      rows.push(
        <div key={year} className="flex items-center justify-center">
          {/* First half (weeks 1-26) */}
          <div className="flex gap-[1px]">{firstHalfWeeks}</div>
          {/* Mid-year gap */}
          <div className={isMobile ? "w-1" : "w-2"} />
          {/* Second half (weeks 27-52) */}
          <div className="flex gap-[1px]">{secondHalfWeeks}</div>
          {/* Year label */}
          {(year + 1) % 5 === 0 && !isMobile && (
            <span className="w-8 text-[10px] text-muted-foreground text-left pl-2 flex-shrink-0">
              {year + 1}
            </span>
          )}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <section className="py-10 md:py-20 bg-background print-calendar overflow-x-hidden">
      <div className="container mx-auto px-3 md:px-6 max-w-full overflow-x-hidden">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 md:gap-12">
          {/* Controls Panel */}
          <div className="space-y-4 md:space-y-6 no-print w-full max-w-full overflow-hidden">
            <div className="card-elevated p-4 md:p-6 space-y-4 md:space-y-6">
              <h3 className="text-title text-lg md:text-xl text-center md:text-left">Tu información</h3>
              
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm text-muted-foreground">
                    Fecha de nacimiento
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="input-minimal w-full max-w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs md:text-sm text-muted-foreground">
                    Años a mostrar
                  </Label>
                  <Input
                    type="number"
                    value={totalYears}
                    onChange={(e) => setTotalYears(Math.max(1, Math.min(120, parseInt(e.target.value) || 80)))}
                    className="input-minimal w-full max-w-full"
                    min={1}
                    max={120}
                  />
                </div>
                
                {!isMobile && (
                  <div className="space-y-2">
                    <Label className="text-xs md:text-sm text-muted-foreground">
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
                )}
                
                <div className="flex items-center gap-3 py-2 px-3 border border-border rounded-md">
                  <input
                    type="checkbox"
                    id="showFilled"
                    checked={showFilled}
                    onChange={(e) => setShowFilled(e.target.checked)}
                    className="w-4 h-4 accent-foreground flex-shrink-0"
                  />
                  <Label htmlFor="showFilled" className="text-xs md:text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    Rellenar semanas vividas
                  </Label>
                </div>

                <Button 
                  variant="outline"
                  onClick={handleClear}
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 text-sm"
                >
                  Limpiar todo
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="card-elevated p-4 md:p-6 space-y-3 md:space-y-4">
              <h3 className="text-title text-lg md:text-xl text-center md:text-left">Estadísticas</h3>
              
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="text-center p-3 md:p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-xl md:text-3xl font-serif font-bold">{weeksLived.toLocaleString()}</p>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Semanas vividas
                  </p>
                </div>
                <div className="text-center p-3 md:p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-xl md:text-3xl font-serif font-bold">{weeksRemaining.toLocaleString()}</p>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Semanas restantes
                  </p>
                </div>
                <div className="text-center p-3 md:p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-xl md:text-3xl font-serif font-bold">{yearsLived}</p>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Años vividos
                  </p>
                </div>
                <div className="text-center p-3 md:p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-xl md:text-3xl font-serif font-bold">{percentageLived}%</p>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    Vida transcurrida
                  </p>
                </div>
              </div>
            </div>

            {/* Background Opacity - Hidden on mobile */}
            {!isMobile && (
              <div className="card-elevated p-4 md:p-6 space-y-3 md:space-y-4">
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
            )}
          </div>

          {/* Calendar Display */}
          <div className="space-y-3 md:space-y-4 w-full max-w-full overflow-hidden">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-2 md:gap-3 no-print">
              <Button 
                variant="outline"
                onClick={handleDownloadSVG}
                className="flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Descargar SVG
              </Button>
              <Button 
                onClick={handlePrint}
                className="btn-stoic flex items-center justify-center gap-2 text-sm"
              >
                <Printer className="w-4 h-4" />
                Imprimir (35×45cm)
              </Button>
            </div>

            <div 
              ref={calendarRef}
              data-printable
              className="card-elevated p-3 md:p-8 bg-card relative overflow-hidden print-area"
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
              <div className="relative z-10 text-center mb-3 md:mb-6">
                <h2 className="text-lg md:text-3xl font-serif tracking-[0.15em] md:tracking-[0.3em]">MEMENTO MORI</h2>
              </div>

              {/* Week Numbers Header - Hidden on mobile for cleaner look */}
              {!isMobile && (
                <div className="relative z-10 flex justify-center gap-[2px] mb-2">
                  <div className="flex gap-[1px]">
                    {Array.from({ length: HALF_YEAR_WEEKS }, (_, i) => (
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
                  <div className="w-2" />
                  <div className="flex gap-[1px]">
                    {Array.from({ length: HALF_YEAR_WEEKS }, (_, i) => (
                      <div 
                        key={i + HALF_YEAR_WEEKS} 
                        className="text-center"
                        style={{ width: `${boxSize}px` }}
                      >
                        {((i + HALF_YEAR_WEEKS + 1) % 5 === 0) && (
                          <span className="text-[8px] text-muted-foreground">{i + HALF_YEAR_WEEKS + 1}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="w-8" />
                </div>
              )}

              {/* Calendar Grid */}
              <div className="relative z-10 space-y-[1px] flex flex-col items-center">
                {renderWeekGrid(mobileBoxSize)}
              </div>

              {/* Footer Quote */}
              <div className="relative z-10 text-center mt-4 md:mt-8 space-y-1 print-footer">
                <p className="font-serif text-[10px] md:text-xs text-muted-foreground leading-relaxed px-2">
                  No es que tengamos poco tiempo para vivir, sino que desperdiciamos mucho de él.
                </p>
                <p className="text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground mt-2 uppercase">
                  SENECA
                </p>
                <div className="mt-3 md:mt-4 flex justify-center">
                  <img 
                    src={piecesOfLifeLogo} 
                    alt="Pieces of Life" 
                    className="h-6 md:h-8 object-contain print-logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MementoMoriCalendar;
