"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PenTool, Copy, RefreshCw, Loader2, Eye, Sparkles } from "lucide-react"
import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from "@google/generative-ai"
import toast from "react-hot-toast"

interface TitleSuggestion {
  title: string
  score: number
  type: "emotional" | "curiosity" | "benefit" | "urgency"
  reason: string
}

// --- Gemini Setup ---
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY in environment variables")
}
const gemini = new GoogleGenerativeAI(geminiApiKey)

class AIAgent {
  name: string
  instructions: string
  model: any

  constructor(name: string, instructions: string, model: { generateContent({ prompt }: { prompt: any }): Promise<GenerateContentResult | { response: { text: () => string } }> }) {
    this.name = name
    this.instructions = instructions
    this.model = model
  }

  async run(query: string) {
    try {
      const response = await this.model.generateContent({
        prompt: `${this.instructions}\n\nUser title: ${query}`,
      })
      return response.response.text().trim()
    } catch (error) {
      console.error(`Error in ${this.name}:`, error)
      throw error
    }
  }
}

// --- Improved Runner with better JSON parsing ---
const runSync = async (agent: AIAgent, query: string) => {
  try {
    const raw = await agent.run(query)
    console.log("Raw AI response:", raw) // Debug log
    
    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = raw.replace(/```(?:json)?\s*([\s\S]*?)```/, '$1').trim()

    
    // Try to parse JSON
    try {
      const parsed = JSON.parse(cleanedResponse) as TitleSuggestion[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Validate structure
        const isValidStructure = parsed.every(item => 
          item.title && 
          typeof item.score === 'number' && 
          item.type && 
          item.reason
        )
        
        if (isValidStructure) {
          return parsed
        }
      }
    } catch (parseError) {
      console.log("JSON parse failed, trying alternative parsing:", parseError)
    }

    // Improved fallback parsing
    const lines = raw.split('\n').filter((line:string) => line.trim())
    const titles: string[] = []
    
    for (const line of lines) {
      let extractedTitle = ""
      
      // Handle "title": "..." format
      if (line.includes('"Title"')) {
        const match = line.match(/"title":\s*"([^"]+)"/)
        if (match) {
          extractedTitle = match[1]
        }
      }
      // Handle title: ... format (without quotes)
      else if (line.toLowerCase().includes('title:')) {
        extractedTitle = line.substring(line.toLowerCase().indexOf('title:') + 6).trim()
      }
      // Handle numbered list format
      else if (/^\d+\./.test(line.trim())) {
        extractedTitle = line.replace(/^\d+\.\s*/, '').trim()
      }
      // Handle lines that look like titles (no JSON syntax)
      else if (line.trim() && !line.includes('{') && !line.includes('}') && !line.includes('[') && !line.includes(']') && !line.includes(':') && line.length > 10) {
        extractedTitle = line.trim()
      }
      
      // Clean up the extracted title
      if (extractedTitle) {
        // Remove any remaining JSON artifacts
        extractedTitle = extractedTitle
          .replace(/^["']|["']$/g, '') // Remove quotes at start/end
          .replace(/,$/, '') // Remove trailing comma
          .replace(/^title:\s*/i, '') // Remove "title: " prefix
          .replace(/^"title":\s*/i, '') // Remove "title": prefix
          .replace(/[{}[\]]/g, '') // Remove any brackets
          .trim()
        
        if (extractedTitle.length > 5 && !titles.includes(extractedTitle)) {
          titles.push(extractedTitle)
        }
      }
    }

    if (titles.length > 0) {
      return titles.slice(0, 5).map((title, i) => ({
        title: title,
        score: Math.floor(75 + Math.random() * 20), // 75-95 range
        type: ["emotional", "curiosity", "benefit", "urgency"][i % 4] as TitleSuggestion["type"],
        reason: "AI-generated optimization suggestion",
      }))
    }

    // Final fallback - return empty array
    return []
  } catch (error: any) {
    console.error("Error in runSync:", error)
    return [
      {
        title: "Error generating titles - please try again",
        score: 0,
        type: "benefit",
        reason: error?.message ?? "Unknown error occurred",
      },
    ]
  }
}

export function AITitleOptimizer() {
  const [originalTitle, setOriginalTitle] = useState("")
  const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const aiAgent = new AIAgent(
    "Title Optimizer Agent",
    `
You are an AI assistant that generates optimized, high-converting titles for content. 

Instructions:
- Provide exactly 5 alternative title suggestions.
- Return ONLY a valid JSON array, no markdown formatting or extra text.
- Each object must have exactly these keys: title, score, type, reason
- Score should be between 75-100
- Type must be one of: "emotional", "curiosity", "benefit", "urgency"
- Keep titles under 100 characters
- Make titles engaging and click-worthy

Example format:
[
  {
    "title": "Your optimized title here",
    "score": 85,
    "type": "benefit",
    "reason": "Brief explanation of why this works"
  }
]
    `,
    {
      async generateContent({ prompt }) {
        setIsLoading(true)
        try {
          const geminiModel: GenerativeModel = gemini.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
          const result = await geminiModel.generateContent(prompt)
          return result
        } catch (error) {
          console.error("Agent error:", error)
          return { response: { text: () => "[]" } }
        } finally {
          setIsLoading(false)
        }
      },
    }
  )

  const generateTitles = async () => {
    if (!originalTitle.trim()) return
    setIsLoading(true)
    try {
      const result = await runSync(aiAgent, originalTitle)
      setSuggestions(result.map(item => ({
        ...item,
        type: item.type as "emotional" | "curiosity" | "benefit" | "urgency",
      })))
    } catch (error) {
      console.error("Error generating titles:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title)
    toast.success("Title copied to clipboard!")
  }

  const getTypeColor = (type: TitleSuggestion["type"]) => {
    switch (type) {
      case "emotional":
        return "bg-red-100 text-red-800"
      case "curiosity":
        return "bg-blue-100 text-blue-800"
      case "benefit":
        return "bg-green-100 text-green-800"
      case "urgency":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader >
           <div className="flex justify-center mb-2">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Tool
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl sm:mt-2 flex justify-center">
          Title Optimizer
        </CardTitle>
        <CardDescription className="flex justify-center sm:text-sm">
          Create compelling headlines that drive engagement and improve click-through rates with AI analysis.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Original Title</label>
          <Input
            value={originalTitle}
            onChange={(e) => setOriginalTitle(e.target.value)}
            placeholder="Enter your current title or topic..."
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            {originalTitle.length} characters • Optimal length: 50-60 characters
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={generateTitles}
            disabled={!originalTitle.trim() || isLoading}
            className="bg-secondary hover:bg-secondary/90"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenTool className="mr-2 h-4 w-4" />}
            Optimize Title
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing and generating optimized title variations...
            </div>
          </div>
        )}

        {suggestions.length > 0 && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Optimized Titles ({suggestions.length})</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSuggestions([])
                  setOriginalTitle("")
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>

            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="border-l-4 border-l-secondary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getTypeColor(suggestion.type)}`}>{suggestion.type}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            Score: {suggestion.score}/100
                          </div>
                        </div>

                        <h5 className="font-medium text-base leading-tight">{suggestion.title}</h5>
                        <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                      </div>

                      <Button variant="outline" size="sm" onClick={() => copyTitle(suggestion.title)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2 text-secondary">Title Optimization Tips:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Higher scores indicate better predicted performance</li>
                <li>• Test different title types for your specific audience</li>
                <li>• Consider your platform - social media vs. blog vs. email</li>
                <li>• A/B test your top 2-3 favorites for best results</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}