"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, BookOpen, PenTool, ArrowRight, CheckCircle } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const features = [
  {
    icon: BookOpen,
    title: "Smart Summarization",
    description: "Transform long content into engaging summaries that capture key insights.",
    benefits: ["Save 2-3 hours per article", "Improve readability", "Boost engagement", "SEO-friendly output"],
    demo: "Try Summarizer",
    href: "/ai-tools/summarizer",
  },
  {
    icon: Target,
    title: "Intelligent Tagging",
    description: "Generate relevant, SEO-optimized tags automatically from your content.",
    benefits: ["Increase discoverability", "Improve SEO rankings", "Save research time", "Trending tag suggestions"],
    demo: "Try Tag Generator",
    href: "/ai-tools/tag-generator",
  },
  {
    icon: PenTool,
    title: "Title Optimization",
    description: "Create compelling headlines that drive clicks and engagement.",
    benefits: ["Higher click-through rates", "A/B testing insights", "Emotional analysis", "Platform optimization"],
    demo: "Try Title Optimizer",
    href: "/ai-tools/title-optimizer",
  },
]

export function FeatureShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate feature cards with stagger effect
      gsap.fromTo(".feature-card",
        { 
          opacity: 0, 
          y: 80,
          rotationY: 45,
          transformOrigin: "center center"
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate icons with bounce effect
      gsap.fromTo(".feature-icon",
        { scale: 0, rotation: -90 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate benefits list items
      gsap.fromTo(".benefit-item",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Add hover animations for cards
      const cards = document.querySelectorAll(".feature-card")
      cards.forEach((card) => {
        const icon = card.querySelector(".feature-icon")
        const button = card.querySelector(".feature-button")
        
        const tl = gsap.timeline({ paused: true })
        tl.to(card, {
          y: -15,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(icon, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: "power2.out"
        }, 0)
        .to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        }, 0)

        card.addEventListener("mouseenter", () => tl.play())
        card.addEventListener("mouseleave", () => tl.reverse())
      })

      // Animate buttons with pulse effect
      gsap.fromTo(".feature-button",
        { scale: 0.95, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="container mx-auto px-4 py-16">
      <div ref={titleRef} className="text-center mb-12">
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Features
        </Badge>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Powerful AI Tools for Every Creator</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Streamline your content creation process with our suite of intelligent tools designed specifically for
          creators.
        </p>
      </div>

      <div ref={cardsRef} className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
              <CardHeader>
                <div className="feature-icon w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-sm mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="benefit-item flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="feature-button w-full bg-secondary hover:bg-secondary/90 group-hover:scale-105 transition-transform" asChild>
                  <a href={feature.href}>
                    {feature.demo}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

