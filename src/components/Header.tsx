import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Calendar, Newspaper } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Pieces of Life" className="h-10" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-background border border-border shadow-lg"
            >
              <DropdownMenuItem asChild>
                <Link 
                  to="/" 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-sans text-sm tracking-wider uppercase">Calendario</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/blog" 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <Newspaper className="h-4 w-4" />
                  <span className="font-sans text-sm tracking-wider uppercase">Blog</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
