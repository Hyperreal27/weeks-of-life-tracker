import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Pieces of Life" className="h-10" />
        </Link>
        
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="font-sans text-sm tracking-wider uppercase text-foreground/80 hover:text-foreground transition-colors"
          >
            Calendario
          </Link>
          <Link 
            to="/blog" 
            className="font-sans text-sm tracking-wider uppercase text-foreground/80 hover:text-foreground transition-colors"
          >
            Blog
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
