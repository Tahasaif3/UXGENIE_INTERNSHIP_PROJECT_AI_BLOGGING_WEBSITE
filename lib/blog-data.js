import { client, urlFor } from './sanity';

function mapPost(post) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug.current,
    excerpt: post.excerpt || '',
    content: post.content || [], // Portable Text array
    publishedAt: post.publishedAt,
    readTime: post.readTime || '',
    tags: post.tags || [],
    image: post.image ? urlFor(post.image) : '/placeholder.svg', // Matches "image": mainImage
    featured: post.featured || false,
    aiSummary: post.aiSummary,
    aiTags: post.aiTags || [],
    seoTitle: post.seoTitle,
    author: {
      name: post.author?.name || 'Unknown Author',
      avatar: post.author?.avatar ? urlFor(post.author.avatar) : '/placeholder.svg', // Matches "avatar": avatar
      bio: post.author?.bio || '',
    },
  };
}

export async function getBlogPosts() {
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      "content": body,
      publishedAt,
      readTime,
      tags,
      "image": mainImage,
      featured,
      aiSummary,
      aiTags,
      seoTitle,
      author-> {
        name,
        "avatar": image,
        "bio": array::join(string::split(coalesce(bio[0].children[0].text, ''), ' '), ' ')
      }
    }
  `);
  return posts.map(mapPost);
}

export async function getFeaturedPosts() {
  const posts = await client.fetch(`
    *[_type == "post" && featured == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      "content": content,
      publishedAt,
      readTime,
      tags,
      "image": mainImage,
      featured,
      aiSummary,
      aiTags,
      seoTitle,
      author-> {
        name,
        "avatar": avatar,
        "bio": array::join(string::split(coalesce(bio[0].children[0].text, ''), ' '), ' ')
      }
    }
  `);
  return posts.map(mapPost);
}

export async function getBlogPost(slug) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      "content": content,
      publishedAt,
      readTime,
      tags,
      "image": mainImage,
      featured,
      aiSummary,
      aiTags,
      seoTitle,
      author-> {
        name,
        "avatar": avatar,
        "bio": array::join(string::split(coalesce(bio[0].children[0].text, ''), ' '), ' ')
      }
    }`,
    { slug }
  );
  if (!post) return undefined;
  return mapPost(post);
}

export async function getBlogPostsByTag(tag) {
  const params = { tag };
  const posts = await client.fetch(
    `
      *[_type == "post" && $tag in tags] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        "content": content,
        publishedAt,
        readTime,
        tags,
        "image": mainImage,
        featured,
        aiSummary,
        aiTags,
        seoTitle,
        author-> {
          name,
          "avatar": avatar,
          "bio": array::join(string::split(coalesce(bio[0].children[0].text, ''), ' '), ' ')
        }
      }
    `,
    params
  );
  return posts.map(mapPost);
}

export async function getAllTags() {
  const tags = await client.fetch(`
    array::unique(*[_type == "post"].tags[])
  `);
  return tags.sort();
}