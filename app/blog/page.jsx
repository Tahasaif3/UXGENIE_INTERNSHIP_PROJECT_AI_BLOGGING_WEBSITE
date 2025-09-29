"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Header } from "@/components/header";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { getBlogPosts, getAllTags } from "@/lib/blog-data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Posts");
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const fetchedPosts = await getBlogPosts();
        const fetchedTags = await getAllTags();
        setPosts(fetchedPosts);
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!loading) {
      // Header animation
      gsap.fromTo(
        ".blog-header",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );

      // Search and filter animation
      gsap.fromTo(
        ".search-filter",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
        }
      );

      // Blog cards animation (staggered)
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blog-grid",
            start: "top 80%",
          },
        }
      );

      // Load more button animation
      gsap.fromTo(
        ".load-more",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".load-more",
            start: "top 90%",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading]);

  // Debounced search and filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content && post.content.includes(searchTerm.toLowerCase()));
      const matchesTag = selectedTag === "All Posts" || post.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          {/* Pulse effect */}
          <div className="absolute inset-0 -z-10 bg-blue-500/20 rounded-full animate-ping"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background" ref={sectionRef}>
      <Header />

      {/* Blog Header */}
      <section className="container mx-auto px-4 py-16 blog-header">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-black mb-6">AI <span className="text-secondary">Content </span>Creation Blog</h1>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
            Insights, tutorials, and best practices for creating better content with AI assistance. Stay updated with
            the latest trends and techniques.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12 search-filter">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10 transition-transform duration-300 hover:scale-[1.02]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="md:w-auto bg-transparent transition-transform duration-300 hover:scale-105"
              onClick={() => {
                setSelectedTag(selectedTag === "All Posts" ? tags[0] || "All Posts" : "All Posts");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === "All Posts" ? "secondary" : "outline"}
              className="cursor-pointer hover:bg-secondary/80 transition-transform duration-300 hover:scale-110"
              onClick={() => setSelectedTag("All Posts")}
            >
              All Posts
            </Badge>
            {tags.slice(0, 8).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "secondary" : "outline"}
                className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-transform duration-300 hover:scale-110"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 pb-16 blog-grid">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <div
                key={post.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="transition-transform duration-300 hover:scale-[1.03]"
              >
                <BlogCard post={post} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No articles found. Try adjusting your search or filter.
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12 load-more">
          <Button
            variant="outline"
            size="lg"
            disabled={filteredPosts.length === posts.length}
            className="transition-transform duration-300 hover:scale-105"
          >
            Load More Articles
          </Button>
        </div>
      </section>
    </div>
  );
}