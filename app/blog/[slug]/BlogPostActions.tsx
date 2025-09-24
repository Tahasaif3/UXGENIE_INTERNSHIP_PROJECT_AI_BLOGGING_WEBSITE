'use client';

import { Button } from "@/components/ui/button";
import { Share2, Bookmark, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any[];
  publishedAt: string;
  readTime: string;
  tags: string[];
  image: string;
  featured: boolean;
  aiSummary: string;
  aiTags: string[];
  seoTitle: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  likeCount?: number; // Optional, initialized from localStorage
  saved?: boolean;    // Optional, for consistency
}

interface BlogPostActionsProps {
  post: Post;
}

export default function BlogPostActions({ post }: BlogPostActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Generate or retrieve a unique user ID for this session
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = Math.random().toString(36).substr(2, 9); // Generate a random ID
      localStorage.setItem('userId', userId);
    }

    // Initialize saved state from localStorage
    const savedState = localStorage.getItem(`saved_${post.id}`);
    setIsSaved(savedState === "true");

    // Initialize liked state and like count from localStorage
    const likedKey = `liked_${post.id}_${userId}`;
    const likedState = localStorage.getItem(likedKey) === "true";
    setIsLiked(likedState);

    const storedLikeCount = localStorage.getItem(`likeCount_${post.id}`);
    setLikeCount(storedLikeCount ? parseInt(storedLikeCount, 10) : (post.likeCount || 0));
  }, [post.id, post.likeCount]);

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `${window.location.origin}/blog/${post.slug}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
      alert("Link copied to clipboard!");
    }
  };

  // Save functionality
  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    localStorage.setItem(`saved_${post.id}`, String(newSavedState));
  };

  // Like functionality with toggle
  const handleLike = () => {
    let newLikeCount = likeCount;
    const userId = localStorage.getItem('userId');
    const likedKey = `liked_${post.id}_${userId}`;

    if (!isLiked) {
      // Like the post
      newLikeCount = likeCount + 1;
      setIsLiked(true);
      localStorage.setItem(likedKey, "true");
    } else {
      // Unlike the post
      newLikeCount = likeCount > 0 ? likeCount - 1 : 0;
      setIsLiked(false);
      localStorage.setItem(likedKey, "false");
    }

    setLikeCount(newLikeCount);
    localStorage.setItem(`likeCount_${post.id}`, newLikeCount.toString());
  };

  return (
    <div className="flex items-center gap-2 mt-6">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Bookmark className="h-4 w-4 mr-2" />
        {isSaved ? "Unsave" : "Save"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleLike}>
        <ThumbsUp className="h-4 w-4 mr-2" />
        {isLiked ? "Unlike" : "Like"} ({likeCount})
      </Button>
    </div>
  );
}