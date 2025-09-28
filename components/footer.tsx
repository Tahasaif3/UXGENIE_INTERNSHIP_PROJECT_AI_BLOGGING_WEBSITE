"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="footer-column">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <Sparkles className="h-6 w-6 text-secondary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                AI Blog
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Empowering content creators with intelligent writing tools and
              AI-powered insights.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent p-2 hover:bg-secondary/10"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent p-2 hover:bg-secondary/10"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent p-2 hover:bg-secondary/10"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="footer-column">
            <h3 className="font-heading font-semibold mb-6 text-foreground">
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/ai-tools"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  AI Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h3 className="font-heading font-semibold mb-6 text-foreground">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3 className="font-heading font-semibold mb-6 text-foreground">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
