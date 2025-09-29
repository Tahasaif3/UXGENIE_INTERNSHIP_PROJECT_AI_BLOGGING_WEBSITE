// src/components/ai-rewriter.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Loader2, Check, Type, Briefcase, Palette, Scissors } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!geminiApiKey) throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
const gemini = new GoogleGenerativeAI(geminiApiKey);

type RewriteMode = "simplify" | "professional" | "creative" | "concise";

const MODES = [
  { 
    value: "simplify", 
    label: "Simplify", 
    icon: Type,
    description: "Clear & easy to understand"
  },
  { 
    value: "professional", 
    label: "Professional", 
    icon: Briefcase,
    description: "Polished for business"
  },
  { 
    value: "creative", 
    label: "Creative", 
    icon: Palette,
    description: "Fresh & engaging"
  },
  { 
    value: "concise", 
    label: "Concise", 
    icon: Scissors,
    description: "Shorter, same meaning"
  },
] as const;

export function AIRewriter() {
  const [inputText, setInputText] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
  const [mode, setMode] = useState<RewriteMode>("simplify");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateRewrite = async () => {
    if (!inputText.trim()) {
      setRewrittenText("Please enter text to rewrite.");
      return;
    }

    setIsCopied(false);
    setIsLoading(true);
    try {
      const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const instructions = {
        simplify: "Rewrite in simple, clear language for a general audience.",
        professional: "Rewrite in a polished, professional tone suitable for business communication.",
        creative: "Rewrite creatively with fresh phrasing, vivid language, and originality.",
        concise: "Rewrite to be significantly shorter while preserving all essential meaning.",
      };

      const prompt = `You are an expert editor. ${instructions[mode]}\n\nOriginal text:\n${inputText}`;
      const result = await geminiModel.generateContent(prompt);
      setRewrittenText(result.response.text().trim());
    } catch (error) {
      console.error("Rewrite error:", error);
      setRewrittenText("Sorry, I couldn't rewrite this. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenText);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const ModeIcon = MODES.find(m => m.value === mode)?.icon || Sparkles;

  return (
    <Card className="max-w-5xl mx-auto mb-16 border-border/30 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Tool
                </Badge>
              </div>
              <CardTitle className="font-heading text-2xl">Try Our AI Rewriter</CardTitle>
              <CardDescription>
                Transform your writing with AI-powered rewriting — clearer, more professional, or more creative.
              </CardDescription>
            </CardHeader>
      <CardContent>
       {/* Input + Rewriting Style */}
<div className="space-y-4 mb-6">
  {/* Input */}
  <div className="space-y-2">
    <Label className="text-sm font-medium">Your Text</Label>
    <Textarea
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      placeholder="Paste any paragraph, email, or draft you'd like to improve..."
      className="min-h-[160px] text-sm"
    />
    <p className="text-xs text-muted-foreground text-right">
      {inputText.length} characters
    </p>
  </div>

  {/* Rewriting Style */}
  <div className="space-y-2">
    <Label className="text-sm font-medium">Rewriting Style</Label>
    <Select value={mode} onValueChange={(v) => setMode(v as RewriteMode)}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <ModeIcon className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Choose a style" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <SelectItem key={m.value} value={m.value}>
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  </div>
</div>


        {/* Output */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Rewritten Output</Label>
            {rewrittenText && !isLoading && !rewrittenText.startsWith("Please") && (
              <Button
                size="sm"
                variant="outline"
                onClick={copyText}
                disabled={isCopied}
                className="h-8 gap-1.5"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="relative">
            <div className="min-h-[160px] w-full p-4 border rounded-lg bg-muted/30 text-sm whitespace-pre-wrap break-words font-sans">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rewriting in progress...
                </div>
              ) : rewrittenText ? (
                rewrittenText
              ) : (
                <span className="text-muted-foreground">
                  Your rewritten text will appear here...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={generateRewrite}
            disabled={!inputText.trim() || isLoading}
            size="lg"
            className="px-8 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rewriting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Rewrite Text
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}