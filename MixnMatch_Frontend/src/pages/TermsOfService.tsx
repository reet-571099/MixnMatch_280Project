import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle2, XCircle, AlertTriangle, Scale, Users } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      icon: CheckCircle2,
      title: "Acceptance of Terms",
      content: "By accessing and using Mix&Match, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of any changes."
    },
    {
      icon: Users,
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account. You agree to notify us immediately of any unauthorized use of your account."
    },
    {
      icon: FileText,
      title: "Use of Service",
      content: "Mix&Match provides AI-powered cooking assistance and recipe recommendations. You may use our service only for lawful purposes and in accordance with these terms. You agree not to use the service in any way that could damage, disable, or impair our servers or networks."
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: "All content, features, and functionality of Mix&Match, including but not limited to text, graphics, logos, and software, are owned by Mix&Match and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission."
    },
    {
      icon: AlertTriangle,
      title: "Disclaimer of Warranties",
      content: 'Mix&Match is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. Recipe recommendations are suggestions only, and we are not responsible for any dietary issues or allergic reactions.'
    },
    {
      icon: XCircle,
      title: "Limitation of Liability",
      content: "To the maximum extent permitted by law, Mix&Match shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. Our total liability shall not exceed the amount you paid us in the past twelve months."
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-mesh)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary mb-6">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms of{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: November 27, 2025
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              Please read these terms carefully before using Mix&Match.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card 
                key={index}
                className="p-8 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Additional Terms */}
          <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms of Service.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding shall be brought exclusively in the courts located in San Francisco, California.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@Mix&Match.com" className="text-primary hover:text-primary/80 font-medium">
                legal@Mix&Match.com
              </a>
            </p>
          </Card>

          {/* Agreement Notice */}
          <Card className="p-6 shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <p className="text-center text-muted-foreground">
              By using Mix&Match, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our{" "}
              <Link to="/privacy" className="text-primary hover:text-primary/80 font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Terms?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We want you to feel confident using Mix&Match. If you have any questions about these terms, reach out to us.
          </p>
          <Link to="/contact">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
