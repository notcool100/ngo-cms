import React from 'react';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import AnimatedBlogPost from '@/components/AnimatedBlogPost';

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
  const post = await fetchPost(params.slug);

  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnimatedBlogPost post={post} />
    </div>
  );
}
