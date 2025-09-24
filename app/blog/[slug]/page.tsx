
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPost, getBlogPosts } from "@/lib/blog-data";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import BlogPostActions from "./BlogPostActions"; // Client component for actions
import { SummaryChat } from "../../../components/SummaryChat"; // New client component

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-heading text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading text-2xl font-bold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-xl font-semibold mt-6 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-secondary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 pl-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 pl-6 space-y-2">{children}</ol>
    ),
  },
  listItem: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  //@ts-ignore
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // Convert Portable Text content to plain text for summarization
  const contentText = Array.isArray(post.content)
    ? post.content
        .map((block: any) =>
          block.children
            ? block.children.map((child: any) => child.text).join(" ")
            : ""
        )
        .join(" ")
    : post.content || "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Article Header */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: any) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-black text-balance mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground text-pretty mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b">
              <div className="flex items-center gap-4">
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">{post.author.bio}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons - Delegated to client component */}
            <BlogPostActions post={post} />
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          {/* AI Summary Card (if available) */}
          {post.aiSummary && (
            <Card className="mb-8 bg-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium text-secondary">AI Summary</span>
                </div>
                <p className="text-sm leading-relaxed">{post.aiSummary}</p>
              </CardContent>
            </Card>
          )}

          {/* Toggleable Summary Chat Button */}
          <div className="mb-8">
            <SummaryChat content={contentText} />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content && Array.isArray(post.content) && post.content.length > 0 ? (
              <PortableText value={post.content} components={portableTextComponents} />
            ) : (
              <p className="text-muted-foreground">No content available for this post.</p>
            )}
          </div>

          {/* AI-Generated Tags */}
          {post.aiTags && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium text-secondary">AI-Generated Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.aiTags.map((tag: any) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Author Bio */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-2">About {post.author.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>
    </div>
  );
}

// import { Header } from "@/components/header";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { getBlogPost, getBlogPosts } from "@/lib/blog-data";
// import { ArrowLeft, Clock } from "lucide-react";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { PortableText, PortableTextComponents } from '@portabletext/react';
// import BlogPostActions from "./BlogPostActions"; // Client component for actions

// interface BlogPostPageProps {
//   params: {
//     slug: string;
//   };
// }

// export const portableTextComponents: PortableTextComponents = {
//   block: {
//     h1: ({ children }) => (
//       <h1 className="font-heading text-3xl font-bold mt-8 mb-4">{children}</h1>
//     ),
//     h2: ({ children }) => (
//       <h2 className="font-heading text-2xl font-bold mt-8 mb-4">{children}</h2>
//     ),
//     h3: ({ children }) => (
//       <h3 className="font-heading text-xl font-semibold mt-6 mb-3">{children}</h3>
//     ),
//     normal: ({ children }) => (
//       <p className="mb-4 leading-relaxed">{children}</p>
//     ),
//     blockquote: ({ children }) => (
//       <blockquote className="border-l-4 border-secondary pl-4 italic my-6 text-muted-foreground">
//         {children}
//       </blockquote>
//     ),
//   },
//   list: {
//     bullet: ({ children }) => (
//       <ul className="mb-4 pl-6 space-y-2">{children}</ul>
//     ),
//     number: ({ children }) => (
//       <ol className="mb-4 pl-6 space-y-2">{children}</ol>
//     ),
//   },
//   listItem: ({ children }) => (
//     <li className="leading-relaxed">{children}</li>
//   ),
// };

// export async function generateStaticParams() {
//   const posts = await getBlogPosts();
//   //@ts-ignore
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }

// export default async function BlogPostPage({ params }: BlogPostPageProps) {
//   const post = await getBlogPost(params.slug);

//   if (!post) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       {/* Article Header */}
//       <article className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Back Button */}
//           <Link
//             href="/blog"
//             className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Blog
//           </Link>

//           {/* Article Meta */}
//           <div className="mb-8">
//             <div className="flex flex-wrap gap-2 mb-4">
//               {post.tags.map((tag: any) => (
//                 <Badge key={tag} variant="secondary">
//                   {tag}
//                 </Badge>
//               ))}
//             </div>

//             <h1 className="font-heading text-3xl md:text-5xl font-black text-balance mb-6">{post.title}</h1>

//             <p className="text-xl text-muted-foreground text-pretty mb-6 leading-relaxed">{post.excerpt}</p>

//             {/* Author and Meta Info */}
//             <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={post.author.avatar || "/placeholder.svg"}
//                   alt={post.author.name}
//                   className="w-12 h-12 rounded-full"
//                 />
//                 <div>
//                   <div className="font-medium">{post.author.name}</div>
//                   <div className="text-sm text-muted-foreground">{post.author.bio}</div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                 <span className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" />
//                   {post.readTime}
//                 </span>
//                 <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
//               </div>
//             </div>

//             {/* Action Buttons - Delegated to client component */}
//             <BlogPostActions post={post} />

//           </div>

//           {/* Featured Image */}
//           <div className="mb-8 rounded-lg overflow-hidden">
//             <img
//               src={post.image}
//               alt={post.title}
//               className="w-full h-64 md:h-96 object-cover"
//             />
//           </div>

//           {/* AI Summary Card */}
//           {post.aiSummary && (
//             <Card className="mb-8 bg-secondary/5 border-secondary/20">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-2 h-2 bg-secondary rounded-full"></div>
//                   <span className="text-sm font-medium text-secondary">AI Summary</span>
//                 </div>
//                 <p className="text-sm leading-relaxed">{post.aiSummary}</p>
//               </CardContent>
//             </Card>
//           )}

//           {/* Article Content */}
//           <div className="prose prose-lg max-w-none mb-12">
//             {post.content && Array.isArray(post.content) && post.content.length > 0 ? (
//               <PortableText value={post.content} components={portableTextComponents} />
//             ) : (
//               <p className="text-muted-foreground">No content available for this post.</p>
//             )}
//           </div>

//           {/* AI-Generated Tags */}
//           {post.aiTags && (
//             <Card className="mb-8">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-2 h-2 bg-secondary rounded-full"></div>
//                   <span className="text-sm font-medium text-secondary">AI-Generated Tags</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {post.aiTags.map((tag: any) => (
//                     <Badge key={tag} variant="outline" className="text-xs">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Author Bio */}
//           <Card className="mb-8">
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <img
//                   src={post.author.avatar || "/placeholder.svg"}
//                   alt={post.author.name}
//                   className="w-16 h-16 rounded-full"
//                 />
//                 <div>
//                   <h3 className="font-heading text-lg font-semibold mb-2">About {post.author.name}</h3>
//                   <p className="text-muted-foreground leading-relaxed">{post.author.bio}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </article>
//     </div>
//   );
// }

