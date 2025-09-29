// src/components/seo-meta-generator.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Copy, Loader2, Check, Eye, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!geminiApiKey) throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
const gemini = new GoogleGenerativeAI(geminiApiKey);

export function SEOMetaGenerator() {
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<"title" | "description" | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Reset copied state on new generation
  useEffect(() => {
    if (!isLoading) setCopiedField(null);
  }, [isLoading]);

  const generateMeta = async () => {
    if (!keyword.trim()) {
      setTitle("⚠️ Please enter a focus keyword.");
      setDescription("");
      return;
    }

    setIsLoading(true);
    try {
      const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `You are an expert SEO specialist. Generate:
1. A compelling SEO title tag (max 60 characters) that includes "${keyword}".
2. A persuasive meta description (max 160 characters) that includes "${keyword}" and encourages clicks.

Content context: ${content || "None provided"}

Respond ONLY in this format:
TITLE: [your title here]
DESCRIPTION: [your description here]`;

      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text().trim();

      const titleMatch = text.match(/TITLE:\s*(.*)/i);
      const descMatch = text.match(/DESCRIPTION:\s*(.*)/i);

      setTitle(titleMatch ? titleMatch[1].trim() : "Could not generate title");
      setDescription(descMatch ? descMatch[1].trim() : "Could not generate description");
    } catch (error) {
      console.error("SEO error:", error);
      setTitle("❌ Error generating metadata. Try again.");
      setDescription("");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: "title" | "description") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field === "title" ? "Title" : "Description"} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getTitleColor = () => {
    if (title.startsWith("⚠️") || title.startsWith("❌")) return "text-destructive";
    if (title.length > 60) return "text-orange-500 dark:text-orange-400";
    return "text-foreground";
  };

  const getDescColor = () => {
    if (description.length > 160) return "text-orange-500 dark:text-orange-400";
    return "text-muted-foreground";
  };

  return (
    <Card className="max-w-5xl mx-auto mb-16 border-border/30 bg-card shadow-sm hover:shadow-md transition-shadow">
     <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Tool
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl font-bold">SEO Meta Tags Generator</CardTitle>
        <CardDescription className="max-w-2xl mx-auto">
          Create Google-ready titles and descriptions that boost visibility and clicks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5 mb-8">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Focus Keyword <span className="text-destructive">*</span></Label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., 'best CRM for small business'"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Content Context (Optional)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste a sentence or paragraph for better relevance..."
                className="min-h-[100px] text-sm"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={generateMeta}
              disabled={!keyword.trim() || isLoading}
              size="lg"
              className="px-8 text-base mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Generate SEO Meta
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">SEO Title Tag</Label>
              <span className={`text-xs ${title.length > 60 ? "text-orange-500" : "text-muted-foreground"}`}>
                {title.length}/60
              </span>
            </div>
            <div className="relative">
              <div className={`min-h-[60px] w-full p-4 border rounded-lg bg-muted/30 text-sm break-words ${getTitleColor()}`}>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating title...
                  </div>
                ) : title ? (
                  title
                ) : (
                  <span className="text-muted-foreground">Your SEO title will appear here...</span>
                )}
              </div>
              {title && !isLoading && !title.startsWith("⚠️") && !title.startsWith("❌") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(title, "title")}
                  disabled={copiedField === "title"}
                  className="absolute top-2 right-2 h-7"
                >
                  {copiedField === "title" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Meta Description</Label>
              <span className={`text-xs ${description.length > 160 ? "text-orange-500" : "text-muted-foreground"}`}>
                {description.length}/160
              </span>
            </div>
            <div className="relative">
              <div className={`min-h-[80px] w-full p-4 border rounded-lg bg-muted/30 text-sm break-words ${getDescColor()}`}>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating description...
                  </div>
                ) : description ? (
                  description
                ) : (
                  <span className="text-muted-foreground">Your meta description will appear here...</span>
                )}
              </div>
              {description && !isLoading && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(description, "description")}
                  disabled={copiedField === "description"}
                  className="absolute top-2 right-2 h-7"
                >
                  {copiedField === "description" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Google Preview Toggle */}
        <div className="mt-8 pt-6 border-t border-border/30 sm:flex sm:justify-center sm:items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2 text-sm"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Hide Google Preview" : "Show Google Preview"}
          </Button>

          {showPreview && (
            <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-secondary/10 max-w-2xl">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">https://uxgenie-internship-project-ai-blogg.vercel.app//blog/post</div>
              <div className={`text-lg font-medium mb-1 ${getTitleColor()}`}>
                {title || "Your SEO title will appear here..."}
              </div>
              <div className={`text-sm ${getDescColor()}`}>
                {description || "Your meta description will appear here..."}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}