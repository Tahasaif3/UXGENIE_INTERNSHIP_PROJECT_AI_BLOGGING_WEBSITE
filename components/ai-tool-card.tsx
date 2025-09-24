import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type LucideIcon, ArrowRight, Clock } from "lucide-react";

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  features: string[];
  comingSoon: boolean;
}

interface AIToolCardProps {
  tool: AITool;
  onSelect?: (id: string) => void; // Add onSelect prop for click handling
  className?: string; // Add className as an optional prop

}

export function AIToolCard({ tool, onSelect }: AIToolCardProps) {
  const Icon = tool.icon;

  return (
    <Card
      className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => onSelect && !tool.comingSoon && onSelect(tool.id)} // Trigger selection if not coming soon
    >
      {tool.comingSoon && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-background">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
          <Icon className="h-6 w-6 text-secondary" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {tool.category}
          </Badge>
        </div>

        <CardTitle className="font-heading text-xl">{tool.title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium">Key Features:</h4>
          <ul className="space-y-1">
            {tool.features.map((feature) => (
              <li key={feature} className="text-xs text-muted-foreground flex items-center gap-2">
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full" variant={tool.comingSoon ? "outline" : "default"} disabled={tool.comingSoon}>
          {tool.comingSoon ? (
            "Available Soon"
          ) : (
            <>
              Try Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}