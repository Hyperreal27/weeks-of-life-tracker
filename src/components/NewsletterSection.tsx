import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Por favor, introduce un email válido");

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: "Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "¡Bienvenido!",
          description: data.message || "Te has suscrito exitosamente a Pieces of Life.",
        });
        setEmail("");
      } else {
        toast({
          title: "Error",
          description: data.error || "Hubo un problema al suscribirte.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al suscribirte. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-title">Únete a la comunidad</h2>
          <p className="text-muted-foreground font-serif text-lg leading-relaxed">
            Recibe reflexiones estoicas, herramientas para vivir con intención 
            y contenido exclusivo sobre cómo aprovechar cada semana de tu vida.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 input-minimal text-center sm:text-left"
              required
            />
            <Button 
              type="submit" 
              className="btn-stoic"
              disabled={isLoading}
            >
              {isLoading ? "Suscribiendo..." : "Suscribirme"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Sin spam. Solo contenido de valor. Puedes darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
