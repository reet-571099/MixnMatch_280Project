import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Sparkles, Heart, Lightbulb, Utensils, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";


const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Mix&Match
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-foreground font-medium">
                About
              </Link>
              <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6" style={{ background: 'var(--gradient-primary)' }}>
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Your AI Cooking Companion</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Meet Your
            <br />
            <span className="text-white">Sous-Chef</span> Assistant
          </h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto">
            Transforming everyday ingredients into extraordinary meals with the power of AI
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We believe cooking should be joyful, creative, and accessible to everyone. Mix&Match was born from a simple idea: 
              what if AI could help you create delicious meals from whatever you have in your kitchen, reducing waste and sparking culinary creativity?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-2 hover:border-primary transition-all duration-300" style={{ boxShadow: 'var(--shadow-glow)' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reduce Waste</h3>
              <p className="text-muted-foreground">
                Turn forgotten ingredients into culinary masterpieces. Every meal is a step toward a more sustainable kitchen.
              </p>
            </Card>

            <Card className="p-8 text-center border-2 hover:border-accent transition-all duration-300" style={{ boxShadow: 'var(--shadow-glow)' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Inspire Creativity</h3>
              <p className="text-muted-foreground">
                Discover unexpected flavor combinations and cooking techniques tailored to your unique pantry.
              </p>
            </Card>

            <Card className="p-8 text-center border-2 hover:border-secondary transition-all duration-300" style={{ boxShadow: 'var(--shadow-glow-secondary)' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary mx-auto mb-4 flex items-center justify-center">
                <Utensils className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Cooking</h3>
              <p className="text-muted-foreground">
                Get recipes adapted to your dietary preferences, skill level, and available time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              From pantry to plate in three simple steps
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Tell Us What You Have</h3>
                <p className="text-muted-foreground text-lg">
                  Simply list your ingredients, and our AI will understand what's possible. No need for exact measurements – 
                  we work with what you've got.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Get Personalized Recipes</h3>
                <p className="text-muted-foreground text-lg">
                  Our AI chef analyzes your ingredients and creates custom recipes tailored to your preferences, 
                  dietary needs, and cooking skill level.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Cook with Confidence</h3>
                <p className="text-muted-foreground text-lg">
                  Follow step-by-step instructions with helpful tips and substitution suggestions. 
                  Have questions? Chat with your AI sous-chef anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">Choose</span> Mix&Match
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Star, title: "100% Personalized", desc: "Every recipe is crafted specifically for you" },
              { icon: Sparkles, title: "Instant Results", desc: "Get creative recipes in seconds, not hours" },
              { icon: Heart, title: "Reduce Food Waste", desc: "Use what you have, waste nothing" },
              { icon: ChefHat, title: "Learn & Grow", desc: "Improve your cooking skills with every meal" },
            ].map((feature, i) => (
              <Card key={i} className="p-6 flex gap-4 transition-all duration-300 hover:shadow-[0_8px_32px_hsl(280_65%_68%_/_0.35)]">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: 'var(--gradient-primary)' }}>
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Kitchen?
          </h2>
          <p className="text-xl text-white/95 mb-8">
            Join thousands of home cooks who are turning pantry chaos into chef-level meals
          </p>
          <Link to="/">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/95 text-lg px-8 py-6 rounded-full"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Cooking Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-background border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Mix&Match
            </span>
          </div>
          <p className="text-muted-foreground">
            Your AI-powered cooking companion
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
