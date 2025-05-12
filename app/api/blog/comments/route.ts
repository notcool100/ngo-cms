import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const commentId = searchParams.get('id');

    if (commentId) {
      // Get single comment by id
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          replies: {
            where: { status: 'APPROVED' },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      if (!comment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }
      return NextResponse.json(comment);
    } else if (postId) {
      // Get comments for a specific post
      const comments = await prisma.comment.findMany({
        where: { 
          postId,
          parentId: null, // Only get top-level comments
          status: 'APPROVED', // Only get approved comments for public view
        },
        orderBy: { createdAt: 'desc' },
        include: {
          replies: {
            where: { status: 'APPROVED' },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      return NextResponse.json(comments);
    } else {
      // Get all comments (admin only)
      const comments = await prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          post: { select: { id: true, title: true, slug: true } },
        },
      });
      return NextResponse.json(comments);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { content, name, email, website, postId, parentId } = data;

    // Get blog settings to check if comments need moderation
    const blogSettings = await prisma.blogSettings.findFirst();
    const status = blogSettings?.moderateComments ? 'PENDING' : 'APPROVED';

    const comment = await prisma.comment.create({
      data: {
        content,
        name,
        email,
        website,
        status,
        postId,
        parentId,
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, status } = data;

    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Comment id is required' }, { status: 400 });
    }
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ message: 'Comment deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}