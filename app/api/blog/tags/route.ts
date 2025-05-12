import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Get single tag by slug
      const tag = await prisma.tag.findUnique({
        where: { slug },
        include: {
          posts: {
            where: { published: true },
            include: {
              author: { select: { id: true, name: true } },
            },
          },
        },
      });
      if (!tag) {
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
      }
      return NextResponse.json(tag);
    } else {
      // Get all tags
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: { posts: true },
          },
        },
      });
      return NextResponse.json(tags);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, slug } = data;

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json({ error: 'Tag with this slug already exists' }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, name, slug } = data;

    // Check if slug already exists for another tag
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag && existingTag.id !== id) {
      return NextResponse.json({ error: 'Tag with this slug already exists' }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Tag id is required' }, { status: 400 });
    }

    await prisma.tag.delete({ where: { id } });
    return NextResponse.json({ message: 'Tag deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}