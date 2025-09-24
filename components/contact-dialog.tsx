"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Linkedin, Twitter } from "lucide-react";

export function ContactDialog({ triggerText = "Contact Us" }: { triggerText?: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Smooth GSAP entrance
  useEffect(() => {
    if (dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="px-8 bg-transparent">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={dialogRef}
        className="max-w-lg w-full rounded-2xl shadow-2xl bg-card border border-border p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Get in Touch
          </DialogTitle>
        </DialogHeader>

        {/* Contact Form */}
        <form className="space-y-4 mt-4">
          <Input placeholder="Your Name" required />
          <Input type="email" placeholder="Your Email" required />
          <Textarea placeholder="Your Message" rows={4} required />
          <Button className="w-full bg-secondary hover:bg-secondary/90">Send Message</Button>
        </form>

        {/* Social Links */}
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
