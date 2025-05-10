import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBlogData() {
  console.log('Seeding blog data...');

  // Check if we already have blog categories
  const existingCategories = await prisma.category.count();
  const existingTags = await prisma.tag.count();
  const existingPosts = await prisma.post.count();
  const existingBlogSettings = await prisma.blogSettings.count();

  // Get admin user for author reference
  const admin = await prisma.user.findUnique({
    where: { email: "admin@empowertogether.org" },
  });

  if (!admin) {
    console.error('Admin user not found. Please run the main seed first.');
    return;
  }

  // Create blog categories if they don't exist
  if (existingCategories === 0) {
    console.log('Creating blog categories...');
    
    const categories = [
      {
        name: 'News',
        slug: 'news',
      },
      {
        name: 'Success Stories',
        slug: 'success-stories',
      },
      {
        name: 'Events',
        slug: 'events',
      },
      {
        name: 'Resources',
        slug: 'resources',
      },
      {
        name: 'Announcements',
        slug: 'announcements',
      }
    ];

    for (const category of categories) {
      await prisma.category.create({
        data: category,
      });
    }
    console.log(`Created ${categories.length} blog categories`);
  }

  // Create blog tags if they don't exist
  if (existingTags === 0) {
    console.log('Creating blog tags...');
    
    const tags = [
      {
        name: 'Education',
        slug: 'education',
      },
      {
        name: 'Empowerment',
        slug: 'empowerment',
      },
      {
        name: 'Leadership',
        slug: 'leadership',
      },
      {
        name: 'Women\'s Rights',
        slug: 'womens-rights',
      },
      {
        name: 'Community',
        slug: 'community',
      },
      {
        name: 'Entrepreneurship',
        slug: 'entrepreneurship',
      },
      {
        name: 'Health',
        slug: 'health',
      },
      {
        name: 'Advocacy',
        slug: 'advocacy',
      }
    ];

    for (const tag of tags) {
      await prisma.tag.create({
        data: tag,
      });
    }
    console.log(`Created ${tags.length} blog tags`);
  }

  // Create blog posts if they don't exist
  if (existingPosts === 0 && admin) {
    console.log('Creating blog posts...');

    // Get categories and tags for reference
    const newsCategory = await prisma.category.findUnique({ where: { slug: 'news' } });
    const storiesCategory = await prisma.category.findUnique({ where: { slug: 'success-stories' } });
    const eventsCategory = await prisma.category.findUnique({ where: { slug: 'events' } });
    const resourcesCategory = await prisma.category.findUnique({ where: { slug: 'resources' } });
    
    const educationTag = await prisma.tag.findUnique({ where: { slug: 'education' } });
    const empowermentTag = await prisma.tag.findUnique({ where: { slug: 'empowerment' } });
    const leadershipTag = await prisma.tag.findUnique({ where: { slug: 'leadership' } });
    const rightsTag = await prisma.tag.findUnique({ where: { slug: 'womens-rights' } });
    const communityTag = await prisma.tag.findUnique({ where: { slug: 'community' } });
    const entrepreneurshipTag = await prisma.tag.findUnique({ where: { slug: 'entrepreneurship' } });

    const posts = [
      {
        title: 'IWLAG Launches New Digital Literacy Program',
        slug: 'iwlag-launches-new-digital-literacy-program',
        content: `<p>We are excited to announce the launch of our new Digital Literacy Program, designed to bridge the digital gender gap and empower women with essential technology skills.</p>
        <p>The program will provide training in:</p>
        <ul>
          <li>Basic computer skills</li>
          <li>Internet research and online safety</li>
          <li>Email and professional communication</li>
          <li>Introduction to productivity software</li>
          <li>Social media for business</li>
          <li>Mobile technology and applications</li>
        </ul>
        <p>Classes will be offered both in-person at our community centers and online through our new e-learning platform, making them accessible to women regardless of location.</p>
        <p>"Digital literacy is no longer optional in today's world," says Maya Patel, our Program Director. "By equipping women with these skills, we're opening doors to education, employment, and entrepreneurship opportunities that were previously out of reach."</p>
        <p>The program is set to begin next month, with registration opening next week. Scholarships are available for those who qualify.</p>
        <p>For more information or to register, please visit our Digital Literacy Program page or contact our education team.</p>`,
        excerpt: 'IWLAG launches a comprehensive Digital Literacy Program to bridge the digital gender gap and empower women with essential technology skills.',
        featured: true,
        published: true,
        publishedAt: new Date('2024-04-15T10:00:00Z'),
        authorId: admin.id,
        categoryId: newsCategory?.id,
        image: '/placeholder.svg?height=600&width=1200',
      },
      {
        title: 'From Student to CEO: Maria\'s Journey',
        slug: 'from-student-to-ceo-marias-journey',
        content: `<p>Ten years ago, Maria Gonzalez was a bright but struggling student in a rural community with limited access to education. Today, she's the CEO of her own educational technology company that's helping thousands of girls like her access quality education.</p>
        <p>Maria's journey began when she received a scholarship through our Girls' Education Initiative. The scholarship allowed her to complete her secondary education and go on to study computer science at university.</p>
        <p>"The scholarship was just the beginning," Maria recalls. "What really changed my life was the mentorship and support network that came with it. For the first time, I had people who believed in me and showed me what was possible."</p>
        <p>During university, Maria participated in our entrepreneurship workshop series, where she developed the idea for an educational app designed specifically for girls in rural areas. With seed funding from our Women Entrepreneurs Network, she launched her company, EduGirl, in 2020.</p>
        <p>Today, EduGirl's mobile learning platform is used by over 50,000 girls across five countries, providing accessible, quality education in areas where schools are distant or under-resourced.</p>
        <p>"My goal is to reach a million girls by 2030," says Maria. "Education changed my life, and I want to pay that forward."</p>
        <p>Maria now serves as a mentor in our programs and regularly speaks to young women about the power of education and entrepreneurship.</p>
        <p>"Maria's story exemplifies what we strive for," says Sarah Johnson, our Executive Director. "Not just individual success, but success that creates a ripple effect, empowering more women and girls."</p>`,
        excerpt: 'How a scholarship recipient became a tech CEO and is now helping thousands of girls access education through her innovative platform.',
        featured: true,
        published: true,
        publishedAt: new Date('2024-04-02T14:30:00Z'),
        authorId: admin.id,
        categoryId: storiesCategory?.id,
        image: '/placeholder.svg?height=600&width=1200',
      },
      {
        title: 'Upcoming Workshop: Financial Planning for Women Entrepreneurs',
        slug: 'upcoming-workshop-financial-planning-for-women-entrepreneurs',
        content: `<p>We're excited to announce our upcoming workshop, "Financial Planning for Women Entrepreneurs," scheduled for May 15-16, 2024.</p>
        <p>This comprehensive two-day workshop is designed specifically for women business owners looking to strengthen their financial management skills and develop robust financial plans for their enterprises.</p>
        <h3>Workshop Details:</h3>
        <ul>
          <li><strong>Dates:</strong> May 15-16, 2024</li>
          <li><strong>Time:</strong> 9:00 AM - 4:00 PM both days</li>
          <li><strong>Location:</strong> IWLAG Community Center and virtually via Zoom</li>
          <li><strong>Cost:</strong> $50 (scholarships available)</li>
        </ul>
        <h3>Topics covered will include:</h3>
        <ul>
          <li>Business financial planning fundamentals</li>
          <li>Cash flow management and forecasting</li>
          <li>Pricing strategies for profitability</li>
          <li>Funding options for women-owned businesses</li>
          <li>Tax planning for small businesses</li>
          <li>Financial risk management</li>
          <li>Retirement planning for entrepreneurs</li>
        </ul>
        <p>The workshop will be led by Alicia Mendez, a certified financial planner with over 15 years of experience working with women entrepreneurs. Participants will leave with a personalized financial action plan for their business.</p>
        <p>Space is limited to ensure personalized attention, so early registration is encouraged. Childcare will be provided for in-person attendees.</p>
        <p>To register or learn more, please visit our Events page or contact our Economic Empowerment team.</p>`,
        excerpt: 'Join our two-day workshop designed to help women entrepreneurs develop strong financial management skills and create robust business financial plans.',
        featured: false,
        published: true,
        publishedAt: new Date('2024-04-20T09:15:00Z'),
        authorId: admin.id,
        categoryId: eventsCategory?.id,
        image: '/placeholder.svg?height=600&width=1200',
      },
      {
        title: 'Guide: Applying for Educational Scholarships',
        slug: 'guide-applying-for-educational-scholarships',
        content: `<p>Navigating the scholarship application process can be overwhelming. To help make this process more accessible, we've created this comprehensive guide to applying for educational scholarships.</p>
        <h3>1. Research Available Scholarships</h3>
        <p>Start by researching scholarships that match your background, interests, and educational goals. Look for scholarships specifically designed for women, particularly in your field of interest. Resources include:</p>
        <ul>
          <li>IWLAG's scholarship database</li>
          <li>University financial aid offices</li>
          <li>Community foundations</li>
          <li>Professional associations in your field</li>
          <li>Online scholarship search engines</li>
        </ul>
        <h3>2. Understand Eligibility Requirements</h3>
        <p>Carefully review eligibility requirements for each scholarship. These may include:</p>
        <ul>
          <li>Academic achievements</li>
          <li>Field of study</li>
          <li>Financial need</li>
          <li>Geographic location</li>
          <li>Community involvement</li>
          <li>Leadership experience</li>
        </ul>
        <h3>3. Prepare Your Application Materials</h3>
        <p>Common application materials include:</p>
        <ul>
          <li><strong>Personal statement:</strong> This is your opportunity to tell your story and explain why you deserve the scholarship. Be authentic, specific, and connect your experiences to your future goals.</li>
          <li><strong>Letters of recommendation:</strong> Request letters from teachers, mentors, or employers who know you well and can speak to your strengths and potential.</li>
          <li><strong>Transcripts:</strong> Most scholarships require academic records. Request official transcripts early.</li>
          <li><strong>Resume/CV:</strong> Highlight your achievements, extracurricular activities, work experience, and community service.</li>
          <li><strong>Financial information:</strong> Some scholarships require documentation of financial need.</li>
        </ul>
        <h3>4. Craft a Compelling Personal Statement</h3>
        <p>Your personal statement should:</p>
        <ul>
          <li>Tell your unique story</li>
          <li>Explain your educational and career goals</li>
          <li>Describe challenges you've overcome</li>
          <li>Explain how the scholarship will help you achieve your goals</li>
          <li>Demonstrate how you'll use your education to make a difference</li>
        </ul>
        <h3>5. Submit Polished Applications</h3>
        <ul>
          <li>Follow all instructions exactly</li>
          <li>Meet all deadlines (create a calendar of due dates)</li>
          <li>Proofread carefully for grammar and spelling errors</li>
          <li>Have someone else review your application</li>
          <li>Keep copies of all submitted materials</li>
        </ul>
        <h3>6. Follow Up</h3>
        <p>After submitting, confirm receipt of your application if possible. If you receive a scholarship, send a thank-you note to the organization. If you don't receive a scholarship, ask for feedback to strengthen future applications.</p>
        <p>Remember that persistence pays off. Many successful scholarship recipients applied for dozens of scholarships before receiving one.</p>
        <p>For personalized assistance with scholarship applications, IWLAG offers free application review services and scholarship workshops throughout the year.</p>`,
        excerpt: 'A step-by-step guide to finding and successfully applying for educational scholarships, with tips for creating standout applications.',
        featured: false,
        published: true,
        publishedAt: new Date('2024-03-25T11:45:00Z'),
        authorId: admin.id,
        categoryId: resourcesCategory?.id,
        image: '/placeholder.svg?height=600&width=1200',
      },
      {
        title: 'IWLAG Partners with Global Tech Company to Expand STEM Education for Girls',
        slug: 'iwlag-partners-with-global-tech-company',
        content: `<p>We are thrilled to announce a new partnership with TechGlobal, a leading technology company, to expand our STEM education programs for girls in underserved communities.</p>
        <p>This three-year partnership will provide $1.5 million in funding to develop and implement comprehensive STEM education programs in 50 schools across 10 countries, reaching an estimated 25,000 girls.</p>
        <p>The initiative will include:</p>
        <ul>
          <li>Development of culturally relevant STEM curricula for different age groups</li>
          <li>Teacher training programs to build capacity for STEM education</li>
          <li>Provision of necessary equipment and learning materials</li>
          <li>Mentorship programs connecting students with women in STEM fields</li>
          <li>Scholarship opportunities for higher education in STEM disciplines</li>
        </ul>
        <p>"This partnership represents a significant step forward in our mission to ensure girls have equal access to quality education in all fields," says Sarah Johnson, our Executive Director. "By focusing on STEM, we're addressing one of the areas with the greatest gender disparity while preparing girls for the jobs of the future."</p>
        <p>TechGlobal will not only provide financial support but also engage their employees as volunteers and mentors. The company has committed to hosting annual "Girls in Tech" days at their offices worldwide, giving participants hands-on experience and exposure to various technology careers.</p>
        <p>"At TechGlobal, we believe diversity drives innovation," says Elena Rodriguez, TechGlobal's Chief Diversity Officer. "By partnering with IWLAG to expand STEM education for girls, we're investing in a more diverse and talented future workforce while helping to close the global gender gap in technology."</p>
        <p>The program will launch next month with pilot projects in Kenya, India, Brazil, and the United States, before expanding to additional countries in 2025.</p>`,
        excerpt: 'IWLAG announces a $1.5 million partnership with TechGlobal to expand STEM education programs for 25,000 girls across 10 countries.',
        featured: true,
        published: true,
        publishedAt: new Date('2024-04-10T08:00:00Z'),
        authorId: admin.id,
        categoryId: newsCategory?.id,
        image: '/placeholder.svg?height=600&width=1200',
      }
    ];

    // Create each post and connect tags
    for (const post of posts) {
      // Determine which tags to connect based on the post content
      const tagsToConnect = [];
      
      if (post.slug === 'iwlag-launches-new-digital-literacy-program') {
        tagsToConnect.push(educationTag?.id, empowermentTag?.id);
      } else if (post.slug === 'from-student-to-ceo-marias-journey') {
        tagsToConnect.push(educationTag?.id, entrepreneurshipTag?.id, empowermentTag?.id);
      } else if (post.slug === 'upcoming-workshop-financial-planning-for-women-entrepreneurs') {
        tagsToConnect.push(entrepreneurshipTag?.id, empowermentTag?.id);
      } else if (post.slug === 'guide-applying-for-educational-scholarships') {
        tagsToConnect.push(educationTag?.id);
      } else if (post.slug === 'iwlag-partners-with-global-tech-company') {
        tagsToConnect.push(educationTag?.id, communityTag?.id, rightsTag?.id);
      }

      // Create the post and connect tags
      await prisma.post.create({
        data: {
          ...post,
          tags: {
            connect: tagsToConnect.filter(Boolean).map(id => ({ id }))
          }
        },
      });
    }
    console.log(`Created ${posts.length} blog posts`);
  }

  // Create blog settings if they don't exist
  if (existingBlogSettings === 0) {
    console.log('Creating blog settings...');
    
    await prisma.blogSettings.create({
      data: {
        postsPerPage: 10,
        allowComments: true,
        moderateComments: true,
        featuredPostsCount: 3,
        showRelatedPosts: true,
        showAuthorInfo: true,
        seoTitle: 'Blog | IWLAG',
        seoDescription: 'Latest news, stories, and updates from IWLAG',
      }
    });
    
    console.log('Blog settings created');
  }

  console.log('Blog data seeding completed.');
}