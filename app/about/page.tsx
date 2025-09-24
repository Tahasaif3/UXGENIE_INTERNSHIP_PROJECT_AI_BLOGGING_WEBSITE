"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JoinTeamDialog } from "@/components/team-dialog";
import {
  Sparkles,
  Users,
  Target,
  Zap,
  ArrowRight,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import { ContactDialog } from "@/components/contact-dialog";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Former content strategist at leading tech companies. Passionate about democratizing AI for creators.",
    avatar:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400?height=120&width=120&text=SJ",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Mike Chen",
    role: "Head of AI",
    bio: "Machine learning expert with 10+ years in NLP. Previously at Google and OpenAI.",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400?height=120&width=120&text=MC",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Emma Davis",
    role: "Product Designer",
    bio: "UX designer focused on making complex AI tools intuitive and accessible for everyone.",
    avatar:
      "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=400?height=120&width=120&text=ED",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
];

const values = [
  {
    icon: Users,
    title: "Creator-First",
    description: "Every feature we build starts with understanding what content creators actually need.",
  },
  {
    icon: Target,
    title: "Quality Focus",
    description: "We prioritize accuracy and usefulness over flashy features that don't deliver real value.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We're constantly exploring new AI capabilities to stay ahead of the curve.",
  },
];

// Stats configuration for counting animation
const statsConfig = [
  { target: 10000, suffix: "+", label: "Active Creators" },
  { target: 1000000, suffix: "+", label: "Content Pieces Enhanced", format: "M" },
  { target: 95, suffix: "%", label: "User Satisfaction" }
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Function to format numbers for display
  const formatNumber = (value: number, config: { target: number, suffix: string, format?: string }) => {
    if (config.format === "M" && value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M${config.suffix}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 0)}k${config.suffix}`;
    }
    return `${Math.floor(value)}${config.suffix}`;
  };

  // Hero Section Animation
  useGSAP(() => {
    if (heroRef.current) {
      gsap.fromTo(
        ".hero-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, { scope: containerRef });

  // Stats Section Animation with Counting Effect
  useGSAP(() => {
    if (statsRef.current) {
      const statElements = statsRef.current.querySelectorAll(".stat-number");
      
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          // Scale and opacity animation for cards
          gsap.fromTo(
            ".stat-item",
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "back.out(1.2)",
            }
          );

          // Counting animation for each stat
          statElements.forEach((element, index) => {
            const config = statsConfig[index];
            const counter = { value: 0 };
            
            gsap.to(counter, {
              value: config.target,
              duration: 2,
              delay: index * 0.2,
              ease: "power2.out",
              onUpdate: () => {
                (element as HTMLElement).textContent = formatNumber(counter.value, config);
              }
            });
          });
        },
      });
    }
  }, { scope: containerRef });

  // Story Section Animation with ScrollTrigger
  useGSAP(() => {
    if (storyRef.current) {
      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            ".story-text",
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
          );
          gsap.fromTo(
            ".story-image",
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
          );
        },
      });
    }
  }, { scope: containerRef });

  // Values Section Animation with Stagger
  useGSAP(() => {
    if (valuesRef.current) {
      ScrollTrigger.create({
        trigger: valuesRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            ".value-card",
            { scale: 0.9, opacity: 0, y: 50 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: "back.out(1.5)",
            }
          );
        },
      });
    }
  }, { scope: containerRef });

  // Team Section Smooth Animation
  useGSAP(() => {
    if (teamRef.current) {
      const teamCards = teamRef.current.querySelectorAll(".team-card");
      if (teamCards.length === 0) return;

      ScrollTrigger.create({
        trigger: teamRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(teamCards, {
            opacity: 0,
            y: 30,
            scale: 0.95,
            rotationX: 10,
          }, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
          });
        },
      });
    }
  }, { scope: containerRef });

  // CTA Section Animation with Pulse
  useGSAP(() => {
    if (ctaRef.current) {
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            ".cta-button",
            { scale: 1, opacity: 0, y: 20 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
            }
          );
        },
      });
    }
  }, { scope: containerRef });

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16" ref={heroRef}>
          <div className="flex justify-center mb-6 hero-item">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              About AI Blog
            </Badge>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-balance mb-6 hero-item">
            Empowering Creators with <span className="text-secondary">Intelligent Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto leading-relaxed hero-item">
            We believe that artificial intelligence should amplify human creativity, not replace it. Our mission is to
            build tools that help content creators write better, faster, and more effectively.
          </p>
        </div>

        {/* Stats with Counting Animation */}
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16" ref={statsRef}>
          {statsConfig.map((stat, index) => (
            <div key={index} className="text-center stat-item">
              <div className="text-3xl font-bold text-secondary mb-2 stat-number">
                0{stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16 bg-transparent" ref={storyRef}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="story-text">
              <h3 className="font-heading text-2xl font-semibold mb-4">The Problem We Saw</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Content creators were spending countless hours on repetitive tasks - writing summaries, generating tags,
                optimizing headlines. Meanwhile, powerful AI tools existed but were either too complex, too expensive,
                or simply not designed for content creators.
              </p>
              <h3 className="font-heading text-2xl font-semibold mb-4">Our Solution</h3>
              <p className="text-muted-foreground leading-relaxed">
                We built AI Blog to bridge that gap. Our tools are specifically designed for content creators, with
                intuitive interfaces and practical features that actually save time and improve quality.
              </p>
            </div>
            <div className="relative story-image">
              <img
                src="/about.jpg?height=400&width=500&text=Our+Journey"
                alt="Our journey"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16" ref={valuesRef}>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do and every decision we make.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-lg value-card">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16 bg-transparent" ref={teamRef}>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The passionate people behind AI Blog, working to make content creation better for everyone.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center overflow-hidden team-card">
              <CardContent className="p-8">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-heading text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-secondary font-medium mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16" ref={ctaRef}>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Join thousands of content creators who are already using AI Blog to enhance their writing workflow and
            create better content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="cta-button">
              <JoinTeamDialog />
            </div>
            <div className="cta-button">
              <ContactDialog triggerText="Contact us"/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// "use client";

// import { useRef } from "react";
// import { useGSAP } from "@gsap/react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { Header } from "@/components/header";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { JoinTeamDialog } from "@/components/team-dialog";
// import {
//   Sparkles,
//   Users,
//   Target,
//   Zap,
//   ArrowRight,
//   Mail,
//   Linkedin,
//   Twitter,
// } from "lucide-react";
// import { ContactDialog } from "@/components/contact-dialog";


// // Register ScrollTrigger
// gsap.registerPlugin(ScrollTrigger);

// const teamMembers = [
//   {
//     name: "Sarah Johnson",
//     role: "Founder & CEO",
//     bio: "Former content strategist at leading tech companies. Passionate about democratizing AI for creators.",
//     avatar:
//       "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400?height=120&width=120&text=SJ",
//     social: {
//       linkedin: "#",
//       twitter: "#",
//     },
//   },
//   {
//     name: "Mike Chen",
//     role: "Head of AI",
//     bio: "Machine learning expert with 10+ years in NLP. Previously at Google and OpenAI.",
//     avatar:
//       "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400?height=120&width=120&text=MC",
//     social: {
//       linkedin: "#",
//       twitter: "#",
//     },
//   },
//   {
//     name: "Emma Davis",
//     role: "Product Designer",
//     bio: "UX designer focused on making complex AI tools intuitive and accessible for everyone.",
//     avatar:
//       "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=400?height=120&width=120&text=ED",
//     social: {
//       linkedin: "#",
//       twitter: "#",
//     },
//   },
// ];

// const values = [
//   {
//     icon: Users,
//     title: "Creator-First",
//     description: "Every feature we build starts with understanding what content creators actually need.",
//   },
//   {
//     icon: Target,
//     title: "Quality Focus",
//     description: "We prioritize accuracy and usefulness over flashy features that don't deliver real value.",
//   },
//   {
//     icon: Zap,
//     title: "Innovation",
//     description: "We're constantly exploring new AI capabilities to stay ahead of the curve.",
//   },
// ];

// export default function AboutPage() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const heroRef = useRef<HTMLDivElement>(null);
//   const statsRef = useRef<HTMLDivElement>(null);
//   const storyRef = useRef<HTMLDivElement>(null);
//   const valuesRef = useRef<HTMLDivElement>(null);
//   const teamRef = useRef<HTMLDivElement>(null);
//   const ctaRef = useRef<HTMLDivElement>(null);

//   // Hero Section Animation
//   useGSAP(() => {
//     if (heroRef.current) {
//       gsap.fromTo(
//         ".hero-item",
//         { opacity: 0, y: 20 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//           stagger: 0.2,
//           ease: "power2.out",
//         }
//       );
//     }
//   }, { scope: containerRef });

//   // Stats Section Animation with ScrollTrigger
//   useGSAP(() => {
//     if (statsRef.current) {
//       ScrollTrigger.create({
//         trigger: statsRef.current,
//         start: "top 80%",
//         onEnter: () => {
//           gsap.fromTo(
//             ".stat-item",
//             { scale: 0.8, opacity: 0 },
//             {
//               scale: 1,
//               opacity: 1,
//               duration: 1,
//               stagger: 0.2,
//               ease: "elastic.out(1, 0.5)",
//             }
//           );
//         },
//       });
//     }
//   }, { scope: containerRef });

//   // Story Section Animation with ScrollTrigger
//   useGSAP(() => {
//     if (storyRef.current) {
//       ScrollTrigger.create({
//         trigger: storyRef.current,
//         start: "top 80%",
//         onEnter: () => {
//           gsap.fromTo(
//             ".story-text",
//             { opacity: 0, x: -50 },
//             { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
//           );
//           gsap.fromTo(
//             ".story-image",
//             { opacity: 0, x: 50 },
//             { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
//           );
//         },
//       });
//     }
//   }, { scope: containerRef });

//   // Values Section Animation with Stagger
//   useGSAP(() => {
//     if (valuesRef.current) {
//       gsap.fromTo(
//         ".value-card",
//         { scale: 0.9, opacity: 0, y: 50 },
//         {
//           scale: 1,
//           opacity: 1,
//           y: 0,
//           duration: 0.7,
//           stagger: 0.15,
//           ease: "back.out(1.5)",
//         }
//       );
//     }
//   }, { scope: containerRef });

//   // Team Section Animation with Stagger
//  // Team Section Smooth Animation
// useGSAP(() => {
//   if (teamRef.current) {
//     const teamCards = teamRef.current.querySelectorAll(".team-card");
//     if (teamCards.length === 0) return;

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: teamRef.current,
//         start: "top 80%",
//       },
//     });

//     tl.from(teamCards, {
//       opacity: 1,
//       y: 20,
//       scale: 0.95,
//       rotationX: 10,
//       duration: 0.8,
//       stagger: 0.15,
//       ease: "power2.out",
//     });
//   }
// }, { scope: containerRef });


//   // CTA Section Animation with Pulse
//   useGSAP(() => {
//     if (ctaRef.current) {
//       gsap.fromTo(
//         ".cta-button",
//         { scale: 1 },
//         {
//           scale: 1.05,
//           duration: 1.2,
//           yoyo: true,
//           repeat: -1,
//           ease: "power1.inOut",
//         }
//       );
//     }
//   }, { scope: containerRef });

//   return (
//     <div className="min-h-screen bg-background" ref={containerRef}>
//       <Header />

//       {/* Hero Section */}
//       <section className="container mx-auto px-4 py-16">
//         <div className="text-center max-w-4xl mx-auto mb-16" ref={heroRef}>
//           <div className="flex justify-center mb-6 hero-item">
//             <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
//               <Sparkles className="w-4 h-4 mr-2" />
//               About AI Blog
//             </Badge>
//           </div>
//           <h1 className="font-heading text-4xl md:text-6xl font-black text-balance mb-6 hero-item">
//             Empowering Creators with <span className="text-secondary">Intelligent Tools</span>
//           </h1>
//           <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto leading-relaxed hero-item">
//             We believe that artificial intelligence should amplify human creativity, not replace it. Our mission is to
//             build tools that help content creators write better, faster, and more effectively.
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16" ref={statsRef}>
//           <div className="text-center stat-item">
//             <div className="text-3xl font-bold text-secondary mb-2">10,000+</div>
//             <div className="text-sm text-muted-foreground">Active Creators</div>
//           </div>
//           <div className="text-center stat-item">
//             <div className="text-3xl font-bold text-secondary mb-2">1M+</div>
//             <div className="text-sm text-muted-foreground">Content Pieces Enhanced</div>
//           </div>
//           <div className="text-center stat-item">
//             <div className="text-3xl font-bold text-secondary mb-2">95%</div>
//             <div className="text-sm text-muted-foreground">User Satisfaction</div>
//           </div>
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className="container mx-auto px-4 py-16 bg-transparent" ref={storyRef}>
//         <div className="max-w-4xl mx-auto">
//           <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div className="story-text">
//               <h3 className="font-heading text-2xl font-semibold mb-4">The Problem We Saw</h3>
//               <p className="text-muted-foreground leading-relaxed mb-6">
//                 Content creators were spending countless hours on repetitive tasks - writing summaries, generating tags,
//                 optimizing headlines. Meanwhile, powerful AI tools existed but were either too complex, too expensive,
//                 or simply not designed for content creators.
//               </p>
//               <h3 className="font-heading text-2xl font-semibold mb-4">Our Solution</h3>
//               <p className="text-muted-foreground leading-relaxed">
//                 We built AI Blog to bridge that gap. Our tools are specifically designed for content creators, with
//                 intuitive interfaces and practical features that actually save time and improve quality.
//               </p>
//             </div>
//             <div className="relative story-image">
//               <img
//                 src="/about.jpg?height=400&width=500&text=Our+Journey"
//                 alt="Our journey"
//                 className="rounded-lg shadow-lg w-full"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="container mx-auto px-4 py-16" ref={valuesRef}>
//         <div className="text-center mb-12">
//           <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             The principles that guide everything we do and every decision we make.
//           </p>
//         </div>
//         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           {values.map((value, index) => {
//             const Icon = value.icon;
//             return (
//               <Card key={index} className="text-center border-0 shadow-lg value-card">
//                 <CardContent className="p-8">
//                   <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//                     <Icon className="h-8 w-8 text-secondary" />
//                   </div>
//                   <h3 className="font-heading text-xl font-semibold mb-4">{value.title}</h3>
//                   <p className="text-muted-foreground leading-relaxed">{value.description}</p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="container mx-auto px-4 py-16 bg-transparent" ref={teamRef}>
//         <div className="text-center mb-12">
//           <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             The passionate people behind AI Blog, working to make content creation better for everyone.
//           </p>
//         </div>
//         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           {teamMembers.map((member, index) => (
//             <Card key={index} className="text-center overflow-hidden team-card">
//               <CardContent className="p-8">
//                 <img
//                   src={member.avatar || "/placeholder.svg"}
//                   alt={member.name}
//                   className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
//                 />
//                 <h3 className="font-heading text-xl font-semibold mb-2">{member.name}</h3>
//                 <p className="text-secondary font-medium mb-4">{member.role}</p>
//                 <p className="text-sm text-muted-foreground leading-relaxed mb-6">{member.bio}</p>
//                 <div className="flex justify-center gap-3">
//                   <Button variant="outline" size="sm" className="bg-transparent">
//                     <Linkedin className="h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" size="sm" className="bg-transparent">
//                     <Twitter className="h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" size="sm" className="bg-transparent">
//                     <Mail className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="container mx-auto px-4 py-16" ref={ctaRef}>
//         <div className="text-center max-w-3xl mx-auto">
//           <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
//           <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
//             Join thousands of content creators who are already using AI Blog to enhance their writing workflow and
//             create better content.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <JoinTeamDialog />
//             <ContactDialog triggerText="Contact us"/>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }