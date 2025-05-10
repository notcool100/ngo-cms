
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

async function fetchPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog`, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">Blog</h1>
      {posts.length === 0 && <p className="text-center text-gray-600">No blog posts found.</p>}
      <ul className="space-y-8">
        {posts.map((post: any, index: number) => (
          <motion.div
            key={post.id}
            className="border-b pb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
          >
            <Link href={`/blog/${post.slug}`} className="text-3xl font-semibold text-blue-700 hover:underline">
              {post.title}
            </Link>
            <p className="text-gray-700 mt-3">{post.excerpt}</p>
            <p className="text-sm text-gray-500 mt-2">
              By {post.author?.name || 'Unknown'} on {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </ul>
    </main>
  );
}
