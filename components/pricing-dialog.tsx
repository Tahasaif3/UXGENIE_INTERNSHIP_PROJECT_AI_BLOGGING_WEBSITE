"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
import { gsap } from "gsap";
import toast from "react-hot-toast";

interface PricingTier {
  name: string;
  price: { monthly: string; yearly: string };
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: "/month",
    features: ["Basic AI Summarizer (5 uses/day)", "Tag Generator (limited)", "Community Support"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: { monthly: "$19", yearly: "$15" },
    period: "/month",
    popular: true,
    features: [
      "Unlimited Summarizer & Tag Generator",
      "Title Optimizer (50/month)",
      "Priority Support",
      "Advanced Analytics",
    ],
    cta: "Choose Pro",
  },
  {
    name: "Enterprise",
    price: { monthly: "$99", yearly: "$79" },
    period: "/month",
    features: [
      "Everything in Pro",
      "Custom AI Models",
      "Dedicated Support",
      "API Access",
      "White-label Tools",
    ],
    cta: "Contact Sales",
  },
];

export function PricingDialog({ triggerText = "View Pricing" }: { triggerText?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent hover:bg-muted/50">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={dialogRef}
        className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl h-[90vh] sm:h-[85vh] p-0 overflow-hidden rounded-2xl shadow-2xl bg-card border border-border"
      >
        {/* Header */}
        <DialogHeader className="p-6 sm:p-8 bg-gradient-to-br from-secondary/20 via-background to-secondary/10 border-b border-border">
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-heading text-center font-bold text-foreground">
            Choose Your Perfect Plan
          </DialogTitle>
          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`px-4 py-1 ${!isYearly ? "bg-secondary text-white" : "bg-background"}`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`px-4 py-1 ${isYearly ? "bg-secondary text-white" : "bg-background"}`}
              onClick={() => setIsYearly(true)}
            >
              Yearly <span className="ml-1 text-green-500 font-bold">(Save 20%)</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Plans */}
        <CardContent className="p-6 sm:p-8 overflow-y-auto h-[calc(90vh-180px)] sm:h-[calc(85vh-200px)] scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  tier.popular ? "border-2 border-secondary ring-2 ring-secondary/30" : "border-border"
                }`}
              >
                {tier.popular && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-white shadow-md text-xs sm:text-sm"
                  >
                    <Crown className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center p-4 sm:p-6 bg-muted/10">
                  <h3 className="font-semibold text-lg sm:text-xl text-foreground">{tier.name}</h3>
                  <div className="text-3xl sm:text-4xl font-extrabold text-secondary mt-3">
                    {isYearly ? tier.price.yearly : tier.price.monthly}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tier.period}</p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm sm:text-base text-foreground">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <span className="flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
                      tier.popular
                        ? "bg-secondary hover:bg-secondary/90 text-white shadow-md"
                        : "bg-background border border-border hover:bg-muted text-foreground"
                    }`}
                    onClick={() => {
                      toast.success(`${tier.name} plan selected!`);
                      setIsOpen(false);
                    }}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-muted/20 border-t border-border text-center text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2">
          <p>Billed annually? Save 20% with yearly plans.</p>
          <Button variant="link" size="sm" className="p-0 h-auto text-secondary hover:underline">
            Contact Sales
          </Button>
          <span>for custom enterprise pricing.</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
