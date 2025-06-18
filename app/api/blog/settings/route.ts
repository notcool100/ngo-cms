import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get blog settings or create default if not exists
    let settings = await prisma.blogSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.blogSettings.create({
        data: {
          postsPerPage: 10,
          allowComments: true,
          moderateComments: true,
          featuredPostsCount: 3,
          showRelatedPosts: true,
          showAuthorInfo: true,
          seoTitle: 'Blog | INWOLAG',
          seoDescription: 'Latest news, stories, and updates from INWOLAG',
        },
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      id, 
      postsPerPage, 
      allowComments, 
      moderateComments, 
      featuredPostsCount,
      showRelatedPosts,
      showAuthorInfo,
      defaultCategory,
      seoTitle,
      seoDescription
    } = data;

    // Update settings or create if not exists
    const settings = await prisma.blogSettings.upsert({
      where: { id: id || 'default' },
      update: {
        postsPerPage,
        allowComments,
        moderateComments,
        featuredPostsCount,
        showRelatedPosts,
        showAuthorInfo,
        defaultCategory,
        seoTitle,
        seoDescription,
      },
      create: {
        postsPerPage,
        allowComments,
        moderateComments,
        featuredPostsCount,
        showRelatedPosts,
        showAuthorInfo,
        defaultCategory,
        seoTitle,
        seoDescription,
      },
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog settings' }, { status: 500 });
  }
}