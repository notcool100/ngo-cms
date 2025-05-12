import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  _count?: {
    comments: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

interface BlogSettings {
  postsPerPage: number;
  featuredPostsCount: number;
  seoTitle: string;
  seoDescription: string;
}

async function fetchPosts(): Promise<BlogPost[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog`, { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

async function fetchCategories(): Promise<Category[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog/categories`, { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

async function fetchSettings(): Promise<BlogSettings> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog/settings`, { cache: 'no-store' });
  if (!res.ok) {
    return {
      postsPerPage: 10,
      featuredPostsCount: 3,
      seoTitle: 'Blog',
      seoDescription: 'Latest news and updates',
    };
  }
  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
  };
}

export default async function BlogPage() {
  const [posts, categories, settings] = await Promise.all([
    fetchPosts(),
    fetchCategories(),
    fetchSettings(),
  ]);

  const featuredPosts = posts.filter(post => post.featured).slice(0, settings.featuredPostsCount);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Blog</h1>
      
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map(post => (
              <FeaturedPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
          <div className="space-y-8">
            {regularPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="sticky top-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      href={`/blog/category/${category.slug}`}
                      className="text-gray-700 hover:text-primary flex justify-between items-center"
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {category._count.posts}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 mb-4">Stay updated with our latest news and articles.</p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
        <div className="relative h-48">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {post.category && (
            <span className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded">
              {post.category.name}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
            {post.author && ` • By ${post.author.name}`}
          </p>
          <p className="text-gray-700 line-clamp-2">
            {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
          </p>
        </div>
      </div>
    </Link>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 border-b pb-8">
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
          {post.category && (
            <Link 
              href={`/blog/category/${post.category.slug}`}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition"
            >
              {post.category.name}
            </Link>
          )}
          <span className="text-xs text-gray-500">
            {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-700 mb-3 line-clamp-2">
          {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
        </p>
        <div className="flex justify-between items-center">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-primary font-medium hover:underline"
          >
            Read More
          </Link>
          {post._count && (
            <span className="text-sm text-gray-500">
              {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
