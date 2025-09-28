"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";

// Validate API key
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY in environment variables");
}
const gemini = new GoogleGenerativeAI(geminiApiKey);

interface Message {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

class AIAgent {
  name: string;
  instructions: string;

  constructor(name: string, instructions: string) {
    this.name = name;
    this.instructions = instructions;
  }

  async run(query: string): Promise<string> {
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `${this.instructions}\n\nUser query: ${query}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having trouble connecting right now. Please try again shortly! 🙏";
    }
  }
}

export default function BlogChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const blogChatAgent = new AIAgent(
    "AI Blog Website Assistant",
    `
You are an intelligent and helpful AI assistant for AI Blog website. You represent the company and help visitors learn about our services, team, and mission.

COMPANY INFORMATION:
- Company Name: AI Blog
- Mission: Empowering creators with intelligent tools
- Description: We believe that artificial intelligence should amplify human creativity, not replace it. Our mission is to build tools that help content creators write better, faster, and more effectively.

STATISTICS:
- 10,000+ Active Creators
- 1,000,000+ Content Pieces Enhanced
- 95% User Satisfaction Rate

TEAM MEMBERS:
1. Sarah Johnson - Founder & CEO
   - Former content strategist at leading tech companies
   - Passionate about democratizing AI for creators

2. Mike Chen - Head of AI
   - Machine learning expert with 10+ years in NLP
   - Previously at Google and OpenAI

3. Emma Davis - Product Designer
   - UX designer focused on making complex AI tools intuitive and accessible for everyone

CORE VALUES:
1. Creator-First: Every feature we build starts with understanding what content creators actually need
2. Quality Focus: We prioritize accuracy and usefulness over flashy features that don't deliver real value
3. Innovation: We're constantly exploring new AI capabilities to stay ahead of the curve

SERVICES & TOOLS:
- AI-powered content summarization
- Smart content analysis and optimization
- Automated tag generation
- Content enhancement tools
- Writing assistance and suggestions
- Headline optimization
- SEO content optimization

THE PROBLEM WE SOLVE:
Content creators were spending countless hours on repetitive tasks - writing summaries, generating tags, optimizing headlines. Meanwhile, powerful AI tools existed but were either too complex, too expensive, or simply not designed for content creators.

OUR SOLUTION:
We built AI Blog to bridge that gap. Our tools are specifically designed for content creators, with intuitive interfaces and practical features that actually save time and improve quality.

INSTRUCTIONS:
- Be friendly, professional, and helpful
- Answer questions about the company, team, services, values, and mission
- Keep responses concise but informative (2-4 sentences typically)
- If asked about specific pricing or technical details you don't have, politely mention they can contact the team directly
- Always maintain a positive, creator-focused tone
- Use emojis sparingly and appropriately
- If someone asks about getting started, guide them to explore our tools and join our community

RESPONSE GUIDELINES:
- Start responses naturally without "As an AI assistant" or similar phrases
- Be conversational and engaging
- Focus on how our tools benefit content creators
- Highlight our creator-first approach and user satisfaction
- Encourage engagement and questions
    `
  );

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          content:
            "Hello! 👋 Welcome to **AI Blog**! I'm here to help you learn about our AI-powered tools and team. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (isLoading || !inputValue.trim()) return;

    const userMessage: Message = {
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const botReply = await blogChatAgent.run(userMessage.content);
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: botReply, timestamp: new Date() },
      ]);
    } catch (error) {
      toast.error("Failed to get response.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) =>
    content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

  const clearChat = () =>
    setMessages([
      {
        type: "bot",
        content:
          "Hello! 👋 Welcome to **AI Blog**! I'm here to help you learn about our AI-powered tools and team. What would you like to know?",
        timestamp: new Date(),
      },
    ]);

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full h-12 w-12 shadow-lg hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
            aria-label="Open chat"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end sm:bottom-6 sm:right-6 bg-black/40 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md h-[90vh] sm:h-[85vh] bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="h-full flex flex-col border-0 bg-transparent shadow-none">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">AI Blog Assistant</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-[10px] bg-white/20 text-white px-1.5 py-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Online
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={clearChat} className="text-white">
                      ↺
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.type === "bot" && (
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                          msg.type === "user"
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none"
                            : "bg-card text-card-foreground border border-border rounded-bl-none"
                        }`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                      />
                      {msg.type === "user" && (
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                      <div className="bg-card border border-border px-3 py-2 rounded-2xl flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="flex-shrink-0 p-2 sm:p-3 border-t border-border bg-background">
                  <div className="flex gap-2 items-end min-h-[48px]">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about AI Blog..."
                      className="flex-1 resize-none border border-border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground min-h-[40px]"
                      rows={1}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      size="icon"
                      className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   MessageCircle,
//   Send,
//   X,
//   Bot,
//   User,
//   Loader2,
//   Sparkles,
// } from "lucide-react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import toast from "react-hot-toast";

// // 🔑 Validate API key
// const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// if (!geminiApiKey) {
//   throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY in environment variables");
// }
// const gemini = new GoogleGenerativeAI(geminiApiKey);

// interface Message {
//   type: "user" | "bot";
//   content: string;
//   timestamp: Date;
// }

// class AIAgent {
//   name: string;
//   instructions: string;

//   constructor(name: string, instructions: string) {
//     this.name = name;
//     this.instructions = instructions;
//   }

//   async run(query: string): Promise<string> {
//     try {
//       // ✅ Use a real, supported model (gemini-2.5-flash doesn't exist yet)
//       const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
//       const prompt = `${this.instructions}\n\nUser query: ${query}`;
//       const result = await model.generateContent(prompt);
//       return result.response.text().trim();
//     } catch (error) {
//       console.error("AI Error:", error);
//       return "I'm having trouble connecting right now. Please try again shortly! 🙏";
//     }
//   }
// }

// export default function BlogChatAgent() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const blogChatAgent = new AIAgent(
//     "AI Blog Website Assistant",
//     `
// You are an intelligent and helpful AI assistant for AI Blog website. You represent the company and help visitors learn about our services, team, and mission.

// COMPANY INFORMATION:
// - Company Name: AI Blog
// - Mission: Empowering creators with intelligent tools
// - Description: We believe that artificial intelligence should amplify human creativity, not replace it. Our mission is to build tools that help content creators write better, faster, and more effectively.

// STATISTICS:
// - 10,000+ Active Creators
// - 1,000,000+ Content Pieces Enhanced
// - 95% User Satisfaction Rate

// TEAM MEMBERS:
// 1. Sarah Johnson - Founder & CEO
//    - Former content strategist at leading tech companies
//    - Passionate about democratizing AI for creators

// 2. Mike Chen - Head of AI
//    - Machine learning expert with 10+ years in NLP
//    - Previously at Google and OpenAI

// 3. Emma Davis - Product Designer
//    - UX designer focused on making complex AI tools intuitive and accessible for everyone

// CORE VALUES:
// 1. Creator-First: Every feature we build starts with understanding what content creators actually need
// 2. Quality Focus: We prioritize accuracy and usefulness over flashy features that don't deliver real value
// 3. Innovation: We're constantly exploring new AI capabilities to stay ahead of the curve

// SERVICES & TOOLS:
// - AI-powered content summarization
// - Smart content analysis and optimization
// - Automated tag generation
// - Content enhancement tools
// - Writing assistance and suggestions
// - Headline optimization
// - SEO content optimization

// THE PROBLEM WE SOLVE:
// Content creators were spending countless hours on repetitive tasks - writing summaries, generating tags, optimizing headlines. Meanwhile, powerful AI tools existed but were either too complex, too expensive, or simply not designed for content creators.

// OUR SOLUTION:
// We built AI Blog to bridge that gap. Our tools are specifically designed for content creators, with intuitive interfaces and practical features that actually save time and improve quality.

// INSTRUCTIONS:
// - Be friendly, professional, and helpful
// - Answer questions about the company, team, services, values, and mission
// - Keep responses concise but informative (2-4 sentences typically)
// - If asked about specific pricing or technical details you don't have, politely mention they can contact the team directly
// - Always maintain a positive, creator-focused tone
// - Use emojis sparingly and appropriately
// - If someone asks about getting started, guide them to explore our tools and join our community

// RESPONSE GUIDELINES:
// - Start responses naturally without "As an AI assistant" or similar phrases
// - Be conversational and engaging
// - Focus on how our tools benefit content creators
// - Highlight our creator-first approach and user satisfaction
// - Encourage engagement and questions
//     `
//   );

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Show welcome message on open
//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       setMessages([
//         {
//           type: "bot",
//           content:
//             "Hello! 👋 Welcome to **AI Blog**! I'm here to help you learn about our AI-powered tools and team. What would you like to know?",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [isOpen]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const userMessage: Message = {
//       type: "user",
//       content: inputValue,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     const currentInput = inputValue;
//     setInputValue("");
//     setIsLoading(true);

//     try {
//       const botReply = await blogChatAgent.run(currentInput);
//       setMessages((prev) => [
//         ...prev,
//         {
//           type: "bot",
//           content: botReply,
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (error) {
//       toast.error("Failed to get response.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatMessage = (content: string) =>
//     content
//       .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//       .replace(/\n/g, "<br>");

//   const clearChat = () =>
//     setMessages([
//       {
//         type: "bot",
//         content:
//           "Hello! 👋 Welcome to **AI Blog**! I'm here to help you learn about our AI-powered tools and team. What would you like to know?",
//         timestamp: new Date(),
//       },
//     ]);

//   return (
//     <>
//       {/* Floating chat button - optimized for mobile */}
//       {!isOpen && (
//         <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
//           <Button
//             onClick={() => setIsOpen(true)}
//             size="lg"
//             className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-blue-500/30"
//             aria-label="Open chat"
//           >
//             <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
//           </Button>
//         </div>
//       )}

//       {/* Chat window - responsive sizing */}
//       {isOpen && (
//         <div 
//           className="
//             fixed inset-0 z-50 flex items-end sm:items-end 
//             sm:right-6 sm:bottom-6 sm:top-auto sm:left-auto
//             bg-black/40 backdrop-blur-sm
//             sm:bg-transparent sm:backdrop-blur-none
//           "
//           onClick={() => setIsOpen(false)}
//         >
//           <div 
//             className="
//               w-full max-w-md h-[90vh] sm:h-[85vh] sm:max-h-[600px] 
//               bg-background rounded-t-3xl sm:rounded-2xl 
//               shadow-2xl overflow-hidden
//               animate-in slide-in-from-bottom-2 duration-300
//               sm:shadow-2xl sm:border sm:border-border
//             "
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Card className="h-full flex flex-col border-0 bg-transparent shadow-none">
//               {/* ✅ Sticky header - always visible */}
//               <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 sticky top-0 z-10">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
//                       <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
//                     </div>
//                     <div>
//                       <CardTitle className="text-sm sm:text-base font-bold">AI Blog Assistant</CardTitle>
//                       <Badge variant="secondary" className="mt-1 text-[10px] sm:text-xs bg-white/20 text-white px-1.5 py-0.5">
//                         <Sparkles className="w-2.5 h-2.5 mr-1 sm:w-3 sm:h-3" /> Online
//                       </Badge>
//                     </div>
//                   </div>
//                   <div className="flex gap-1">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={clearChat}
//                       className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20"
//                       aria-label="Clear chat"
//                     >
//                       <span className="text-[10px] sm:text-xs">↺</span>
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => setIsOpen(false)}
//                       className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20"
//                       aria-label="Close chat"
//                     >
//                       <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>

//               {/* Scrollable messages area */}
//               <CardContent className="flex flex-col p-0 h-full">
//                 <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-background">
//                   {messages.map((message, index) => (
//                     <div
//                       key={index}
//                       className={`flex gap-2 sm:gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
//                     >
//                       {message.type === "bot" && (
//                         <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
//                           <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
//                         </div>
//                       )}

//                       <div
//                         className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
//                           message.type === "user"
//                             ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none shadow-sm"
//                             : "bg-card text-card-foreground border border-border rounded-bl-none shadow-sm"
//                         }`}
//                         dangerouslySetInnerHTML={{
//                           __html: formatMessage(message.content),
//                         }}
//                       />

//                       {message.type === "user" && (
//                         <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
//                           <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
//                         </div>
//                       )}
//                     </div>
//                   ))}

//                   {isLoading && (
//                     <div className="flex gap-2 sm:gap-3 justify-start">
//                       <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
//                         <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
//                       </div>
//                       <div className="bg-card border border-border px-3 py-2 sm:px-4 sm:py-3 rounded-2xl flex items-center gap-1.5 sm:gap-2 shadow-sm">
//                         <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary" />
//                         <span className="text-xs sm:text-sm text-muted-foreground">Thinking...</span>
//                       </div>
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input area — fixed at bottom */}
//                 <div className="p-2 sm:p-3 border-t border-border bg-background">
//                   <div className="flex gap-1.5 sm:gap-2 items-end">
//                     <textarea
//                       value={inputValue}
//                       onChange={(e) => setInputValue(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Ask me about AI Blog..."
//                       className="flex-1 resize-none border border-border rounded-full px-3 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground min-h-[36px] sm:min-h-[44px]"
//                       rows={1}
//                       disabled={isLoading}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && e.shiftKey) {
//                           // Allow multi-line with Shift+Enter
//                         }
//                       }}
//                     />
//                     <Button
//                       onClick={handleSendMessage}
//                       disabled={!inputValue.trim() || isLoading}
//                       size="icon"
//                       className="rounded-full h-9 w-9 sm:h-11 sm:w-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-md transition-shadow"
//                       aria-label="Send message"
//                     >
//                       <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }