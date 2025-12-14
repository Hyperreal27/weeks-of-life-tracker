import { ArrowDown } from "lucide-react";
import marcusAurelius from "@/assets/marcus-aurelius.png";

const HeroSection = () => {
  const scrollToCalendar = () => {
    const calendarSection = document.getElementById("calendar");
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img 
          src={marcusAurelius} 
          alt="" 
          className="w-auto h-[90%] object-contain"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
          <p className="text-sm tracking-[0.4em] uppercase text-muted-foreground">
            Memento Mori
          </p>
          
          <h1 className="text-display leading-tight">
            Visualiza tu vida
            <span className="block text-muted-foreground">en semanas</span>
          </h1>
          
          <p className="font-serif text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Cada cuadro representa una semana de tu vida. 
            ¿Cuántas has vivido? ¿Cuántas te quedan? 
            Crea tu calendario Memento Mori personal.
          </p>

          <div className="pt-8">
            <button
              onClick={scrollToCalendar}
              className="group flex flex-col items-center gap-3 mx-auto text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm tracking-widest uppercase">Comenzar</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
