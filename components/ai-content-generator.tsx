"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Loader2, Check, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Initialize Gemini
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
}
const gemini = new GoogleGenerativeAI(geminiApiKey);

// Types
type ContentType = "blog" | "twitter" | "linkedin" | "instagram";
type Tone = "professional" | "casual" | "witty" | "inspirational";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "blog", label: "Blog Post" },
  { value: "twitter", label: "Twitter/X Thread" },
  { value: "linkedin", label: "LinkedIn Article" },
  { value: "instagram", label: "Instagram Caption" },
];

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "inspirational", label: "Inspirational" },
];

interface SavedIdea {
  id: string;
  topic: string;
  contentType: ContentType;
  tone: Tone;
  content: string;
  timestamp: number;
}

export function AIContentGenerator() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [tone, setTone] = useState<Tone>("professional");
  const [ideas, setIdeas] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load saved ideas from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aiContentIdeas");
    if (saved) {
      try {
        setSavedIdeas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved ideas");
      }
    }
  }, []);

  // Save to localStorage whenever savedIdeas changes
  useEffect(() => {
    localStorage.setItem("aiContentIdeas", JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  const getInstructions = () => {
    const platformGuides: Record<ContentType, string> = {
      blog: "5-7 detailed blog post ideas with catchy titles and 1-sentence descriptions.",
      twitter: "5 engaging Twitter/X thread ideas (each with a hook and 3-5 tweet outline).",
      linkedin: "4 thought-leadership LinkedIn post ideas with professional insights.",
      instagram: "6 short, punchy Instagram caption ideas with relevant hashtags.",
    };

    const toneGuides: Record<Tone, string> = {
      professional: "Use a polished, authoritative tone suitable for business audiences.",
      casual: "Keep it conversational, friendly, and relatable—like chatting with a friend.",
      witty: "Add clever wordplay, humor, or light sarcasm to make it memorable.",
      inspirational: "Uplift and motivate—use empowering language and positive framing.",
    };

    return `
You are a world-class content strategist. Generate ${platformGuides[contentType]}

${toneGuides[tone]}

- Be original and avoid clichés.
- Tailor ideas specifically to: "${topic}"
- Format clearly with numbered items.
- If the topic is too vague, respond: "Please specify a clearer niche (e.g., 'budget travel in Europe' instead of just 'travel')."
    `;
  };

  const generateIdeas = async () => {
    if (!topic.trim()) {
      setIdeas("Please enter a topic or niche.");
      return;
    }

    setIsCopied(false);
    setIsLoading(true);
    try {
      const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = getInstructions();
      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text().trim();
      setIdeas(text);
    } catch (error) {
      console.error("Generation error:", error);
      setIdeas("Sorry, I couldn’t generate ideas right now. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const copyIdeas = async () => {
    try {
      await navigator.clipboard.writeText(ideas);
      setIsCopied(true);
      toast.success("Ideas copied!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const saveIdea = () => {
    if (!ideas.trim() || ideas.startsWith("Please") || ideas.startsWith("Sorry")) return;

    const newIdea: SavedIdea = {
      id: Date.now().toString(),
      topic,
      contentType,
      tone,
      content: ideas,
      timestamp: Date.now(),
    };

    setSavedIdeas((prev) => [newIdea, ...prev.slice(0, 19)]); // Keep last 20
    toast.success("Idea saved! 💾");
  };

  const deleteSavedIdea = (id: string) => {
    setSavedIdeas((prev) => prev.filter((idea) => idea.id !== id));
    toast.success("Idea removed");
  };

  return (
    <Card className="max-w-4xl mx-auto mb-16 border-secondary/20 bg-secondary/5">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Content Generator
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl">Fresh Content Ideas On Demand</CardTitle>
        <CardDescription>
          Generate platform-specific, tone-perfect content ideas in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Topic or Niche</Label>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'sustainable fashion', 'AI for teachers'..."
              className="w-full h-24 p-3 border rounded-lg resize-none text-sm"
            />
          </div>
  {/* Flex container to place Content Type and Tone in one line */}
       <div className="flex">
               <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Content Type</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Your AI Ideas</Label>
            <div className="w-full h-48 p-3 border rounded-lg bg-muted/50 relative overflow-auto flex flex-col">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                </div>
              ) : ideas ? (
                <div className="flex flex-col h-full justify-between">
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans break-words">
                    {ideas}
                  </pre>
                  {ideas && !isLoading && !ideas.startsWith("Please") && !ideas.startsWith("Sorry") && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyIdeas}
                        disabled={isCopied}
                        className="flex-1"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 mr-1" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={saveIdea}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Click "Generate Ideas" to begin
                </div>
              )}
            </div>
          </div>

          {/* Saved Ideas Panel */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">Saved Ideas ({savedIdeas.length})</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaved(!showSaved)}
                className="h-auto p-0"
              >
                {showSaved ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show
                  </>
                )}
              </Button>
            </div>
            {showSaved ? (
              <div className="w-full h-48 border rounded-lg bg-muted/30 p-3 overflow-y-auto">
                {savedIdeas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No saved ideas yet. ❤️ an idea to store it!</p>
                ) : (
                  <div className="space-y-3">
                    {savedIdeas.map((idea) => (
                      <div key={idea.id} className="text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{idea.topic}</p>
                            <p className="text-muted-foreground">
                              {idea.contentType} · {idea.tone}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSavedIdea(idea.id)}
                            className="h-auto p-0 text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap break-words">{idea.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-48 border rounded-lg bg-muted/30 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Click "Show" to view saved ideas</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={generateIdeas}
            disabled={!topic.trim() || isLoading}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Ideas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}