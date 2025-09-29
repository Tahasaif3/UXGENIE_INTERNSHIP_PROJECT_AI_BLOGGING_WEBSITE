'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Copy, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from "@google/generative-ai";
import toast from "react-hot-toast";

// Initialize Gemini SDK with API key from environment variables
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY in environment variables");
}

const gemini = new GoogleGenerativeAI(geminiApiKey);


// AI Agent Class
class AIAgent {
  name: string;
  instructions: string;
  model: any;
  
  constructor(name: string, instructions: string, model: { generateContent({ prompt }: { prompt: string; }): Promise<GenerateContentResult | { response: { text: () => string; }; }>; }) {
    this.name = name;
    this.instructions = instructions;
    this.model = model;
  }

  async run(query: any){
    try {
      const response = await this.model.generateContent({
        prompt: `${this.instructions}\n\nUser query: ${query}`,
      });
      return response.response.text().trim();
    } catch (error) {
      console.error(`Error in ${this.name}:`, error);
      throw error;
    }
  }
}

// Runner function to execute the agent
const runSync = async (agent: AIAgent, query: string) => {
  try {
    const result = await agent.run(query);
    // Parse the response into an array of tags
    const tagText = result.replace(/[\[\]']+/g, "").trim();
    const tags = tagText
      .split(",")
      //@ts-ignore
      .map((tag) => tag.trim())
      //@ts-ignore
      .filter((tag) => tag.length > 0);
    return { final_output: tags.length > 0 ? tags : ["No relevant tags generated."] };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { final_output: [`Error: Unable to generate tags. (${errorMessage})`] };
  }
};

export function AITagGenerator() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the AI Tag Generator Agent with Gemini
  const aiAgent = new AIAgent(
    "Tag Generator Agent",
    `
You are a highly intelligent AI assistant designed to generate SEO-friendly tags for content. Your task is to:
- Analyze the input content (title, excerpt, or full text) and extract relevant keywords.
- Generate 5-10 tags that are SEO-optimized, including a mix of broad and specific terms.
- Return the tags as a comma-separated list (e.g., "tag1, tag2, tag3").
- Ensure tags are concise, unique, and relevant to the content.
- If the input is too short or invalid, return: "Please provide more content for tag generation (at least 50 words)."
    `,
    {
      async generateContent({ prompt }: { prompt: string }) {
        setIsLoading(true);
        try {
          const geminiModel: GenerativeModel = gemini.getGenerativeModel({ model:"gemini-2.5-flash" });
          const result = await geminiModel.generateContent(prompt);
          return result;
        } catch (error) {
          console.error("Agent error:", error);
          return { response: { text: () => "Sorry, an error occurred while generating tags." } };
        } finally {
          setIsLoading(false);
        }
      },
    }
  );

  const generateTags = async () => {
    if (!content.trim() || content.length < 50) {
      setTags(["Please provide more content for tag generation (at least 50 words)."]);
      return;
    }
    const result = await runSync(aiAgent, content);
    setTags(result.final_output);
  };

  const copyTags = () => {
    navigator.clipboard.writeText(tags.join(", "));
    toast.success("Tags copied to clipboard!");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
           <div className="flex justify-center mb-2">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Tool
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl">Smart Tag Generator</CardTitle>
        <CardDescription>
          Automatically generate SEO-friendly tags and categories for your content based on AI analysis.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content to Analyze</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article title, excerpt, or full content here for tag analysis..."
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {content.length} characters • Better results with more content (min 50)
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={generateTags}
            disabled={!content.trim() || isLoading || content.length < 50}
            className="bg-secondary hover:bg-secondary/90"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
            Generate Tags
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing content and generating relevant tags...
            </div>
          </div>
        )}

        {tags.length > 0 && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Generated Tags ({tags.length})</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyTags}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTags([]);
                    setContent("");
                  }}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 group"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                </Badge>
              ))}
            </div>

            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2 text-secondary">Tag Optimization Tips:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use 5-10 tags for optimal SEO performance</li>
                <li>• Mix broad and specific tags to reach different audiences</li>
                <li>• Click on any tag to remove it from the list</li>
                <li>• Consider your target audience when selecting final tags</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


