"use client"

import { useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Zap, Target, ArrowRight, Clock, User, Mail, Twitter, Linkedin } from "lucide-react"
import { FeatureShowcase } from "@/components/feature-showcase"
import { Testimonials } from "@/components/testimonials"
import { NewsletterSignup } from "@/components/newsletter-signup"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Mock blog posts data
const featuredPosts = [
  {
    id: 1,
    title: "How AI is Revolutionizing Content Creation",
    excerpt:
      "Discover the latest AI tools and techniques that are transforming how we create, edit, and optimize content for modern audiences.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    tags: ["AI", "Content", "Technology"],
    image: "https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    title: "The Future of SEO with Machine Learning",
    excerpt:
      "Learn how machine learning algorithms are changing SEO strategies and what content creators need to know to stay ahead.",
    author: "Mike Chen",
    date: "2024-01-12",
    readTime: "7 min read",
    tags: ["SEO", "Machine Learning", "Marketing"],
    image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    title: "Building Better Headlines with AI Assistance",
    excerpt:
      "Explore practical techniques for using AI to craft compelling headlines that drive engagement and improve click-through rates.",
    author: "Emma Davis",
    date: "2024-01-10",
    readTime: "4 min read",
    tags: ["Headlines", "AI Tools", "Writing"],
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
]

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const blogRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animations
      const heroTl = gsap.timeline()
      
     heroTl
      .fromTo(
        ".hero-badge",
        { scale: 0, opacity: 0, rotation: 20 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".hero-title",
        { opacity: 0, y: 50, rotationX: 20 },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".hero-description",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-buttons",
        { opacity: 0, y: 40, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      )
      // Features Section Animation
      gsap.fromTo(".features-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      gsap.fromTo(".feature-card-small",
        { 
          opacity: 0, 
          y: 60,
          rotationY: 25 
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Blog Section Animation
      gsap.fromTo(".blog-header",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: blogRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      gsap.fromTo(".blog-card",
        { 
          opacity: 0, 
          y: 80,
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
            trigger: blogRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // CTA Section Animation
      gsap.fromTo(ctaRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Add hover effects to blog cards
      const blogCards = document.querySelectorAll(".blog-card")
      blogCards.forEach((card) => {
        const image = card.querySelector(".blog-image")
        const tl = gsap.timeline({ paused: true })
        
        tl.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(image, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        }, 0)

        card.addEventListener("mouseenter", () => tl.play())
        card.addEventListener("mouseleave", () => tl.reverse())
      })

      // Footer animation
      gsap.fromTo("footer",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "footer",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge className="hero-badge px-4 py-2 text-sm font-medium" variant="secondary">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Content Creation
            </Badge>
          </div>

          <h1 className="hero-title font-heading text-4xl md:text-6xl font-black text-balance mb-6">
            Write Better Content with <span className="text-secondary">AI Assistance</span>
          </h1>

          <p className="hero-description text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your writing process with intelligent tools that help you create, optimize, and perfect your
            content. From headlines to full articles, let AI be your creative partner.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/ai-tools" passHref>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8 hover:scale-105 transition-all">
              Start Using Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
            <Link href="/blog" passHref>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent hover:scale-105 transition-all">
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Blogs
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Feature Showcase Component */}
      <FeatureShowcase />

      {/* Features Section */}
      <section ref={featuresRef} className="container mx-auto px-4 py-16 bg-transparent">
        <div className="features-title text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Powerful AI Tools for Content Creators</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create engaging, optimized content that resonates with your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="feature-card-small text-center border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="font-heading text-xl">Smart Summarization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Generate concise, engaging summaries of your long-form content to improve readability and engagement.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="feature-card-small text-center border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="font-heading text-xl">SEO Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Automatically generate SEO-friendly tags and optimize your titles for better search engine visibility.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="feature-card-small text-center border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="font-heading text-xl">Content Enhancement</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Improve your writing with AI-powered suggestions for better headlines, structure, and readability.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section ref={blogRef} className="container mx-auto px-4 py-16">
      <div className="blog-header flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Latest Insights
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest trends in AI-powered content creation.
          </p>
        </div>

        <Link href="/blog" className="w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full md:w-auto hover:scale-105 transition-all"
          >
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="blog-card overflow-hidden hover:shadow-lg transition-all cursor-pointer">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="blog-image w-full h-full object-cover transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="font-heading text-xl leading-tight hover:text-secondary transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed mb-4">{post.excerpt}</CardDescription>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                <span>{new Date(post.date).toLocaleDateString("en-US")}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the latest AI content creation tips, tool updates, and industry insights delivered to your inbox.
          </p>
        </div>
        <NewsletterSignup />
      </section>


     {/* Footer */}
<footer className="border-t bg-gradient-to-b from-muted/30 to-background">
  <div className="container mx-auto px-4 py-16 lg:py-20">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      {/* Logo & Description */}
      <div className="footer-column">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <Sparkles className="h-6 w-6 text-secondary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">AI Blog</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Empowering content creators with intelligent writing tools and AI-powered insights.
        </p>
        <div className="flex space-x-4">
          <Button variant="outline" size="sm" className="bg-transparent p-2 hover:bg-secondary/10">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent p-2 hover:bg-secondary/10">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent p-2 hover:bg-secondary/10">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product */}
      <div className="footer-column">
        <h3 className="font-heading font-semibold mb-6 text-foreground">Product</h3>
        <ul className="space-y-4">
          <li>
            <Link href="/ai-tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              AI Tools
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Pricing
            </Link>
          </li>
        </ul>
      </div>

      {/* Company */}
      <div className="footer-column">
        <h3 className="font-heading font-semibold mb-6 text-foreground">Company</h3>
        <ul className="space-y-4">
          <li>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Careers
            </Link>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div className="footer-column">
        <h3 className="font-heading font-semibold mb-6 text-foreground">Support</h3>
        <ul className="space-y-4">
          <li>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Help Center
            </Link>
          </li>
          <li>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Documentation
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
    </div>
  )
}