import { Bot, Users, Zap, Shield } from "lucide-react";

export function About() {
  const features = [
    {
      icon: Bot,
      title: "Advanced AI",
      description: "Powered by state-of-the-art language models",
    },
    {
      icon: Users,
      title: "Human-like Text",
      description: "Natural and engaging content that connects",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process thousands of words in seconds",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Your content is always private and protected",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6">About AI Humanizer</h1>
          <p className="text-xl text-muted-foreground">
            We're on a mission to make AI-generated content more human, natural,
            and engaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
              >
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
