"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.9, rotationX: 20 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      gsap.fromTo(".form-element",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, cardRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)

    gsap.to(".submit-button", { scale: 0.95, duration: 0.1, ease: "power2.out" })

    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)

      gsap.fromTo(cardRef.current,
        { scale: 1 },
        { scale: 1.05, duration: 0.3, ease: "back.out(1.7)", yoyo: true, repeat: 1 }
      )
    }, 1500)
  }

  if (isSubscribed) {
    return (
      <Card
        ref={cardRef}
        className="w-full max-w-md mx-auto bg-gradient-to-br from-background/80 to-secondary/10 border border-secondary/20 shadow-lg rounded-xl"
      >
        <CardContent className="p-6 text-center">
          <div className="success-icon">
            <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
          </div>
          <h3 className="font-heading text-lg font-semibold mb-2">Welcome aboard!</h3>
          <p className="text-sm text-muted-foreground">
            Thanks for subscribing. You'll receive our latest AI content tips and updates.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      ref={cardRef}
      className="w-full max-w-md mx-auto bg-gradient-to-br from-background/80 to-secondary/10 border border-secondary/20 shadow-lg rounded-xl hover:shadow-xl transition-all"
    >
      <CardHeader className="text-center">
        <div className="form-element flex justify-center mb-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Mail className="w-3 h-3 mr-1" />
            Newsletter
          </Badge>
        </div>
        <CardTitle className="form-element font-heading text-xl">Stay Updated</CardTitle>
        <CardDescription className="form-element">
          Get the latest AI content creation tips and tool updates.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            className="form-element focus:ring-2 focus:ring-secondary/20 transition-all"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="submit-button form-element w-full bg-secondary hover:bg-secondary/90 hover:scale-105 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>

          <p className="form-element text-xs text-muted-foreground text-center">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
