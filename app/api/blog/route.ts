import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      // Get single post by slug
      const post = await prisma.post.findUnique({
        where: { slug },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
        },
      });
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    } else {
      // Get all posts
      const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { id: true, name: true } },
          category: true,
          tags: true,
        },
      });
      return NextResponse.json(posts);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, slug, content, excerpt, featured, published, publishedAt, authorId, categoryId, tagIds, image } = data;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featured,
        published,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        authorId,
        categoryId,
        image,
        tags: tagIds ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, title, slug, content, excerpt, featured, published, publishedAt, authorId, categoryId, tagIds, image } = data;

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featured,
        published,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        authorId,
        categoryId,
        image,
        tags: tagIds ? { set: tagIds.map((id: string) => ({ id })) } : { set: [] },
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Post id is required' }, { status: 400 });
    }
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
