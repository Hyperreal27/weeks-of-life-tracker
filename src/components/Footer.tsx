import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={logo} alt="Pieces of Life" className="h-8 opacity-70" />
          
          <p className="font-serif text-muted-foreground text-center italic">
            "No es la muerte lo que un hombre debe temer, sino nunca comenzar a vivir."
          </p>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pieces of Life
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
