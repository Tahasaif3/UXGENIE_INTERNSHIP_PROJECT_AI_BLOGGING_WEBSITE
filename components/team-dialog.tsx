"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

export function JoinTeamDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 👇 Wrap your existing button inside DialogTrigger */}
      <DialogTrigger asChild>
        <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8 cta-button">
          Join our Team
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </DialogTrigger>

      {/* Dialog Box */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Join our Team</DialogTitle>
          <DialogDescription>
            Fill out the form below and we’ll get back to you soon.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input type="text" placeholder="Your name" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Why do you want to join?</label>
            <Textarea placeholder="Tell us a little about yourself..." required />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90">
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
