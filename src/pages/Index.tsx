import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MementoMoriCalendar from "@/components/MementoMoriCalendar";
import NewsletterSection from "@/components/NewsletterSection";

const Index = () => {
  return (
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
  );
};

export default Index;
