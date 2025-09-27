'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Loader2, Check } from "lucide-react";
import { GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";

// Initialize Gemini SDK with API key from environment variables
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const gemini = new GoogleGenerativeAI(geminiApiKey);

// AI Agent Class
class AIAgent {
  model: any;
  instructions: any;
  name: any;
  constructor(name: string, instructions: string, model: { generateContent({ prompt }: { prompt: string; }): Promise<GenerateContentResult | { response: { text: () => string; }; }>; }) {
    this.name = name;
    this.instructions = instructions;
    this.model = model;
  }

  async run(query: any) {
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
    return { final_output: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { final_output: `Error: ${errorMessage}` };
  }
};

export function AISummarizer() {
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize the AI Summarizer Agent with Gemini
  const aiAgent = new AIAgent(
    "Content Summarizer Agent",
    `
You are a highly intelligent and helpful AI assistant designed to summarize content. Your task is to:
- Generate concise, engaging summaries of the input content.
- Highlight key points and maintain the original meaning.
- Keep the summary under 150 words.
- Respond in a friendly and professional tone.
- The Summarized content must not more than 4-5 lines.

If the input is invalid or insufficient, return: "Please provide valid content to summarize."
    `,
    {
      async generateContent({ prompt }: { prompt: string }) {
        setIsLoading(true);
        try {
          const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
          const result = await geminiModel.generateContent(prompt);
          return result;
        } catch (error) {
          console.error("Agent error:", error);
          return { response: { text: () => "Sorry, an error occurred while generating the summary." } };
        } finally {
          setIsLoading(false);
        }
      },
    }
  );

  const generateSummary = async () => {
    if (!content.trim()) {
      setSummary("Please provide valid content to summarize.");
      return;
    }
    
    // Reset copy state when generating new summary
    setIsCopied(false);

    const result = await runSync(aiAgent, content);
    setSummary(result.final_output);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      toast.success("Summary copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy summary");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mb-16 border-secondary/20 bg-secondary/5">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Tool
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl">Try Our Content Summarizer</CardTitle>
        <CardDescription>
          Paste your content below and see how our AI creates a perfect summary in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your article or content here..."
              className="w-full h-32 p-3 border rounded-lg resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Characters: {content.length} (Min 50 for summary)</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">AI Summary</label>
            <div className="w-full h-32 p-3 border rounded-lg bg-muted/50 relative overflow-auto flex flex-col">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating summary...
                  </div>
                </div>
              ) : summary ? (
                <div className="flex flex-col h-full justify-between">
                  <p className="text-sm leading-relaxed break-words">{summary}</p>
                  {summary && !isLoading && summary !== "Please provide valid content to summarize." && (
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copySummary}
                        disabled={isCopied}
                        className="transition-all duration-200 hover:bg-muted/50 border-border text-foreground hover:border-muted-foreground/50 disabled:opacity-100 dark:hover:bg-secondary/10 dark:border-secondary/30 dark:text-secondary-foreground dark:hover:border-secondary/50"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 mr-2 text-green-600 dark:text-green-400" />
                            <span className="text-green-600 dark:text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Click "Generate Summary" to see AI magic in action
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            onClick={generateSummary}
            disabled={!content.trim() || isLoading || content.length < 50}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-colors duration-200 rounded-md"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}