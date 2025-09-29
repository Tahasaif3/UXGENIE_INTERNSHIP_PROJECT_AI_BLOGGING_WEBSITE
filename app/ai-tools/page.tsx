"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header } from "@/components/header";
import { AIToolCard } from "@/components/ai-tool-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Search } from "lucide-react";
import { AISummarizer } from "@/components/ai-summarizer";
import { AITagGenerator } from "@/components/ai-tag-generator";
import { AITitleOptimizer } from "@/components/ai-title-optimizer";
import { PricingDialog } from "@/components/pricing-dialog";
import { Toast } from "@/components/toast";
import { AIContentGenerator } from "@/components/ai-content-generator";
import { AIRewriter } from "@/components/ai-rewriter";
import { SEOMetaGenerator } from "@/components/seo-meta-generator";

gsap.registerPlugin(ScrollTrigger);

const aiTools = [
  {
    id: "summarizer",
    title: "Content Summarizer",
    description: "Generate concise, engaging summaries of your long-form content to improve readability.",
    icon: Sparkles,
    category: "Content",
    features: ["TL;DR Generation", "Key Points Extraction", "Multiple Length Options", "SEO-Friendly Output"],
    comingSoon: false,
  },
  {
    id: "tag-generator",
    title: "Smart Tag Generator",
    description: "Automatically generate SEO-friendly tags and categories for your content.",
    icon: Sparkles,
    category: "SEO",
    features: ["Keyword Analysis", "Trending Tags", "Category Suggestions", "Relevance Scoring"],
    comingSoon: false,
  },
  {
    id: "title-optimizer",
    title: "Title Optimizer",
    description: "Create compelling headlines that drive engagement and improve click-through rates.",
    icon: Sparkles,
    category: "Optimization",
    features: ["A/B Testing", "Emotional Analysis", "Length Optimization", "Platform-Specific"],
    comingSoon: false,
  },
  {
  id: "content-generator",
  title: "Content Idea Generator",
  description: "Get a constant stream of fresh, unique content ideas for blogs, social media, and more.",
  icon: Sparkles,
  category: "Ideation",
  features: ["Blog Post Ideas", "Social Media Prompts", "Trending Angles", "Niche-Specific Suggestions"],
  comingSoon: false,
},
{
  id: "rewriter",
  title: "AI Rewriter",
  description: "Rephrase text to be clearer, more engaging, or plagiarism-free.",
  icon: Sparkles,
  category: "Editing",
  features: ["Simplify", "Professionalize", "Humanize", "Shorten"],
  comingSoon: false,
},
{
  id: "seo-meta",
  title: "SEO Meta Generator",
  description: "Create click-worthy titles and descriptions optimized for search.",
  icon: Search,
  category: "SEO",
  features: ["Title Tags", "Meta Descriptions", "Keyword Optimization", "CTR Boost"],
  comingSoon: false,
},
];

export default function AIToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
    const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setShowToast(true);
  };

  const toolComponents: Record<string, React.ReactNode> = {
    summarizer: <AISummarizer />,
    "tag-generator": <AITagGenerator />,
    "title-optimizer": <AITitleOptimizer />,
    "content-generator": <AIContentGenerator />,
    "rewriter": <AIRewriter />,
    "seo-meta": <SEOMetaGenerator />,
  };

  const handleToolSelect = (toolId: string) => {
    gsap.to(toolRef.current, {
      x: "-100%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setSelectedTool(toolId);
        gsap.fromTo(
          toolRef.current,
          { x: "100%", opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      },
    });
  };

  const handleBackToGrid = () => {
    gsap.to(toolRef.current, {
      x: "100%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setSelectedTool(null);
        gsap.fromTo(
          toolRef.current,
          { x: "-100%", opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      },
    });
  };

  // Hero Section Animation
  useGSAP(() => {
    gsap.from(".hero-badge", {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.from(".hero-title", {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
      delay: 0.2,
    });
    gsap.from(".hero-text", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      delay: 0.4,
    });
    gsap.from(".hero-btn", {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 0.6,
    });
  }, { scope: containerRef });

  // Toolkit Cards Animation
  useGSAP(() => {
    if (gridRef.current) {
      gsap.fromTo(
        ".tool-card",
        { opacity: 0, scale: 0.85, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }
  }, { scope: containerRef });

  // How It Works Animation
  useGSAP(() => {
    if (!selectedTool) {
      ScrollTrigger.create({
        trigger: ".how-it-works-section",
        start: "top 80%",
        onEnter: () => {
          gsap.from(".how-step", {
            opacity: 0,
            y: 40,
            rotateX: -10,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
          });
        },
      });
    }
  }, { scope: containerRef });

  // CTA Section Animation
  useGSAP(() => {
    if (!selectedTool) {
      ScrollTrigger.create({
        trigger: ".cta-section",
        start: "top 85%",
        onEnter: () => {
          gsap.from(".cta-heading", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          });
          gsap.from(".cta-text", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
          });
          gsap.from(".cta-btn", {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: 0.4,
            ease: "back.out(1.7)",
            stagger: 0.2,
          });
        },
      });
    }
  }, { scope: containerRef });

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-6 hero-badge">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Tools
            </Badge>
          </div>

          <h1 className="hero-title font-heading text-4xl md:text-6xl font-black mb-6">
            Supercharge Your Content with <span className="text-secondary">AI Tools</span>
          </h1>

          <p className="hero-text text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your content creation workflow with our suite of AI-powered tools. From summarization to SEO
            optimization, we've got everything you need to create better content faster.
          </p>

          <Button size="lg" className="hero-btn bg-secondary hover:bg-secondary/90 text-lg px-8">
            Try Tools Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Conditional Rendering: Tool Grid or Selected Tool */}
        {selectedTool ? (
          <div className="max-w-4xl mx-auto" ref={toolRef}>
            <Button variant="outline" onClick={handleBackToGrid} className="mb-6">
              ← Back to Tools
            </Button>
            {toolComponents[selectedTool] || <p>Tool not available yet.</p>}
          </div>
        ) : (
          <>
            {/* Featured Demo */}
            {toolComponents["summarizer"] || <AISummarizer />}            
            {/* AI Tools Grid */}
            <section className="container mx-auto px-4 pb-16">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Complete AI Toolkit</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to create, optimize, and analyze your content with the power of artificial
                  intelligence.
                </p>
              </div>

              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                ref={gridRef}
              >
                {aiTools.map((tool) => (
                  <AIToolCard
                    key={tool.id}
                    tool={tool}
                    onSelect={handleToolSelect}
                    className="tool-card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/20"
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </section>

      <hr className="border-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

      {/* How It Works */}
      {!selectedTool && (
        <section className="container mx-auto px-4 py-16 how-it-works-section">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with our AI tools in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {["Input Your Content", "AI Processing", "Get Results"].map((title, i) => (
              <div className="text-center how-step" key={i}>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">{i + 1}</span>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {i === 0
                    ? "Paste your article, blog post, or any text content into our AI-powered tools."
                    : i === 1
                    ? "Our advanced AI analyzes your content and generates optimized results in seconds."
                    : "Copy, refine, and use the AI-generated content to enhance your writing workflow."}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="border-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

      {/* CTA Section */}
      {!selectedTool && (
        <section className="cta-section container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="cta-heading font-heading text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="cta-text text-lg text-muted-foreground mb-8 leading-relaxed">
              Join thousands of content creators who are already using our AI tools to write better, faster, and more
              effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
        size="lg"
        className="cta-btn bg-secondary hover:bg-secondary/90 text-lg px-8"
        onClick={handleClick}
      >
        Start Free Trial
        <Sparkles className="ml-2 h-5 w-5" />
      </Button>

      {showToast && (
        <Toast message="🎉 Free Trial Activated!" onClose={() => setShowToast(false)} />
      )}
              <PricingDialog triggerText="View Pricing" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
