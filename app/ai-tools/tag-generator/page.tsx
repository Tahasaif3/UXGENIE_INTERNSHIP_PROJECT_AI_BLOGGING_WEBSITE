import { Header } from "@/components/header"
import { AITagGenerator } from "@/components/ai-tag-generator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TagGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/ai-tools"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to AI Tools
        </Link>

        <AITagGenerator />
      </div>
    </div>
  )
}
