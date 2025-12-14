import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MementoMoriCalendar from "@/components/MementoMoriCalendar";
import NewsletterSection from "@/components/NewsletterSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Pieces of Life - Calendario Memento Mori</title>
        <meta 
          name="description" 
          content="Visualiza tu vida en semanas con un calendario Memento Mori personalizado. Descarga e imprime tu calendario para vivir con intención." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          <HeroSection />
          
          <div id="calendar">
            <MementoMoriCalendar />
          </div>
          
          <NewsletterSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
