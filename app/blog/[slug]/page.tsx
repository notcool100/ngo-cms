import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import AnimatedBlogPost from '@/components/AnimatedBlogPost';
import { Separator } from '@/components/ui/separator';

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
    slug: string;
  };
  tags?: { id: string; name: string; slug: string }[];
  image?: string;
}

interface Comment {
  id: string;
  content: string;
  name: string;
  email: string;
  website?: string;
  status: string;
  createdAt: string;
  replies: Comment[];
}

interface BlogSettings {
  allowComments: boolean;
  showAuthorInfo: boolean;
  showRelatedPosts: boolean;
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

async function fetchComments(postId: string): Promise<Comment[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog/comments?postId=${postId}`, { cache: 'no-store' });
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
      allowComments: true,
      showAuthorInfo: true,
      showRelatedPosts: true,
    };
  }
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160),
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  if (!post) return notFound();

  const [comments, settings] = await Promise.all([
    fetchComments(post.id),
    fetchSettings(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
            <span>/</span>
            {post.category && (
              <>
                <Link 
                  href={`/blog/category/${post.category.slug}`}
                  className="hover:text-primary"
                >
                  {post.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-700">{post.title}</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
            </span>
            {post.author && settings.showAuthorInfo && (
              <span>By {post.author.name}</span>
            )}
          </div>
          
          {post.image && (
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-auto rounded-lg mb-8 shadow-md"
            />
          )}
        </div>
        
        <article className="prose max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link 
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-8" />
        
        {settings.allowComments && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Comments ({comments.length})</h3>
            
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-4">Leave a Comment</h4>
              <CommentForm postId={post.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="border-l-4 border-gray-200 pl-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{comment.name}</h4>
          <p className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button className="text-sm text-primary hover:underline">Reply</button>
      </div>
      <div className="mt-2 text-gray-700">{comment.content}</div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-6 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentForm({ postId }: { postId: string }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email * (will not be published)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
          Website (optional)
        </label>
        <input
          type="url"
          id="website"
          name="website"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comment *
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={5}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          Post Comment
        </button>
        <p className="mt-2 text-sm text-gray-500">
          Your comment will be reviewed before it appears.
        </p>
      </div>
    </form>
  );
}
