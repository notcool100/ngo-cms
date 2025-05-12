import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  posts: BlogPost[];
}

async function fetchCategory(slug: string): Promise<Category | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog/categories?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await fetchCategory(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }
  
  return {
    title: `${category.name} - Blog`,
    description: `Browse all posts in the ${category.name} category`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await fetchCategory(params.slug);
  
  if (!category) return notFound();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-center">
          Category: {category.name}
        </h1>
        <p className="text-center text-gray-600 mt-2">
          {category.posts.length} {category.posts.length === 1 ? 'post' : 'posts'} in this category
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {category.posts.map(post => (
            <div key={post.id} className="flex flex-col md:flex-row gap-6 border-b pb-8">
              <div className="md:w-1/3">
                <Link href={`/blog/${post.slug}`} className="block">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-lg hover:opacity-90 transition"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </Link>
              </div>
              <div className="md:w-2/3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">
                    {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  {post.author && (
                    <span className="text-xs text-gray-500">
                      • By {post.author.name}
                    </span>
                  )}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold mb-2 hover:text-primary transition">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-700 mb-3 line-clamp-2">
                  {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                </p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-primary font-medium hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {category.posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No posts found in this category</h3>
            <Link href="/blog" className="mt-4 inline-block text-primary hover:underline">
              Back to all posts
            </Link>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
          >
            Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}