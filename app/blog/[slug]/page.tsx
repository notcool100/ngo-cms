import React from 'react';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  author?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  tags?: { id: string; name: string }[];
  image?: string;
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

interface Props {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <motion.h1
        className="text-5xl font-extrabold mb-6 text-center text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {post.title}
      </motion.h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        By {post.author?.name || 'Unknown'} on {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      {post.image && (
        <motion.img
          src={post.image}
          alt={post.title}
          className="mb-8 w-full h-auto rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      )}
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
