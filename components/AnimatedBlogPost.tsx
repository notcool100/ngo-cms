'use client';

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
  image?: string;
}

export default function AnimatedBlogPost({ post }: { post: BlogPost }) {
  return (
    <main>
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
