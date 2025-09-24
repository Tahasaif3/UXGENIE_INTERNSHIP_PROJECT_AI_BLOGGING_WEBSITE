"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const gemini = new GoogleGenerativeAI(geminiApiKey);

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

const runSync = async (agent: AIAgent, query: string) => {
  try {
    const result = await agent.run(query);
    return { final_output: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { final_output: `Error: ${errorMessage}` };
  }
};

export function SummaryChat({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const aiAgent = new AIAgent(
    "Content Summarizer Agent",
    `
You are a highly intelligent and helpful AI assistant designed to summarize content. Your task is to:
- Generate concise, engaging summaries of the input content.
- Highlight key points and maintain the original meaning.
- Keep the summary under 150 words.
- Respond in a friendly and professional tone.
- The summarized content must not exceed 4-5 lines.

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

  useEffect(() => {
    if (isOpen && content && content.length >= 50 && !summary) {
      generateSummary();
    }
  }, [isOpen, content, summary]);

  const generateSummary = async () => {
    if (!content.trim() || content.length < 50) {
      setSummary("Please provide valid content to summarize.");
      return;
    }

    const result = await runSync(aiAgent, content);
    setSummary(result.final_output);
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    toast.success("Summary copied to clipboard!");
  };

  return (
    <div>
      <Button
        variant="outline"
        className="bg-secondary/10 hover:bg-secondary/20 text-foreground mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {isOpen ? "Hide Summary" : "Summarize This Article"}
      </Button>

      {isOpen && (
        <Card className="max-w-4xl mx-auto mb-8 border-secondary/20 bg-secondary/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Chat Summary
              </Badge>
            </div>
            <CardTitle className="font-heading text-2xl">AI-Powered Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg shadow-sm border border-muted/30">
                <p className="text-sm text-muted-foreground italic">AI Assistant:</p>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating summary...
                  </div>
                ) : summary ? (
                  <p className="text-sm leading-relaxed break-words mt-2">{summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Click "Summarize" to generate a summary.</p>
                )}
              </div>
              {summary && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySummary}
                  className="mt-2 bg-transparent"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Summary
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}