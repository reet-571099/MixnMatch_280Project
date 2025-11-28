import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, UserCheck, Bell } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, including your name, email address, dietary preferences, and cooking habits. We also automatically collect certain information about your device and how you interact with Mix&Match, including your IP address, browser type, and usage patterns."
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, including personalizing your recipe recommendations. We also use your information to communicate with you, respond to your requests, and send you technical notices and updates."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is ever completely secure, and we cannot guarantee absolute security."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. You can also object to processing, request data portability, and withdraw consent where applicable. Contact us to exercise these rights."
    },
    {
      icon: Bell,
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings, but disabling them may affect your ability to use certain features of Mix&Match."
    },
    {
      icon: Shield,
      title: "Data Sharing",
      content: "We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, but only to the extent necessary and under strict confidentiality agreements."
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-mesh)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-6">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Privacy{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: November 27, 2025
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
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

          {/* Additional Information */}
          <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Mix&Match is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically for any changes.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@Mix&Match.com" className="text-primary hover:text-primary/80 font-medium">
                privacy@Mix&Match.com
              </a>
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're committed to protecting your data. If you have any concerns or questions, our team is here to help.
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

export default PrivacyPolicy;
