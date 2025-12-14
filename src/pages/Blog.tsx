import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (data) {
        setPosts(data);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - Pieces of Life</title>
        <meta 
          name="description" 
          content="Reflexiones estoicas, herramientas para vivir con intención y contenido sobre filosofía y desarrollo personal." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">
              <p className="text-sm tracking-[0.4em] uppercase text-muted-foreground mb-4">
                Blog
              </p>
              <h1 className="text-display mb-6">Reflexiones</h1>
              <p className="font-serif text-xl text-muted-foreground leading-relaxed">
                Exploramos la filosofía estoica, el arte de vivir con intención 
                y cómo aprovechar cada momento de nuestra existencia.
              </p>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-elevated p-6 animate-pulse">
                    <div className="aspect-video bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <article 
                    key={post.id} 
                    className="card-elevated overflow-hidden group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {post.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      {post.published_at && (
                        <p className="text-xs text-muted-foreground tracking-wider uppercase">
                          {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                      )}
                      <h2 className="text-title group-hover:text-foreground/80 transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-block text-sm font-medium tracking-wider uppercase text-foreground hover:text-foreground/70 transition-colors pt-2"
                      >
                        Leer más →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-serif text-xl mb-4">
                  Próximamente...
                </p>
                <p className="text-muted-foreground">
                  Estamos preparando contenido de valor para ti. 
                  Suscríbete para ser el primero en enterarte.
                </p>
              </div>
            )}
          </div>
        </main>

        <NewsletterSection />
        <Footer />
      </div>
    </>
  );
};

export default Blog;
