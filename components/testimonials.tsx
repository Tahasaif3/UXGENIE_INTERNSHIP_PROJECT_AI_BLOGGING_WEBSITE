"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    name: "Alex Rodriguez",
    role: "Content Creator",
    company: "TechBlog Pro",
    content:
      "AI Blog has completely transformed my writing workflow. The summarizer alone saves me 2-3 hours per article. The quality is incredible!",
    rating: 5,
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Jessica Kim",
    role: "Marketing Manager",
    company: "StartupGrow",
    content:
      "The tag generator is a game-changer for our SEO strategy. We've seen a 40% increase in organic traffic since using AI Blog tools.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "David Thompson",
    role: "Freelance Writer",
    company: "Independent",
    content:
      "As a freelancer, efficiency is everything. AI Blog helps me deliver better content faster, which means happier clients and more projects.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Maria Santos",
    role: "Blog Editor",
    company: "HealthWise Media",
    content:
      "The title optimizer has improved our click-through rates by 35%. It's like having a copywriting expert on our team 24/7.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/3783717/pexels-photo-3783717.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Ryan Chen",
    role: "Content Strategist",
    company: "Digital Agency",
    content:
      "We use AI Blog for all our client projects. The consistency and quality of output has impressed both our team and our clients.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Sophie Williams",
    role: "Blogger",
    company: "Lifestyle Blog",
    content:
      "I was skeptical about AI tools, but AI Blog feels like a natural extension of my creativity rather than a replacement. Love it!",
    rating: 5,
    avatar: "https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
]

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
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

      // Animate testimonial cards with stagger
      gsap.fromTo(".testimonial-card",
        { 
          opacity: 0, 
          y: 60,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Add hover animations
      const cards = document.querySelectorAll(".testimonial-card")
      cards.forEach((card) => {
        const tl = gsap.timeline({ paused: true })
        tl.to(card, {
          scale: 1.05,
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        })

        card.addEventListener("mouseenter", () => tl.play())
        card.addEventListener("mouseleave", () => tl.reverse())
      })

      // Animate stars individually
      gsap.fromTo(".star-rating",
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="container mx-auto px-4 py-16 bg-transparent">
      <div ref={titleRef} className="text-center mb-12">
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium mb-4">
          Testimonials
        </Badge>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What Creators Are Saying</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of content creators who are already transforming their workflow with AI Blog.
        </p>
      </div>

      <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="testimonial-card border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="star-rating h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-6 text-muted-foreground">"{testimonial.content}"</p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}