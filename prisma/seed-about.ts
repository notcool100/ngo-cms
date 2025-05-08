import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAboutData() {
  console.log('Seeding about page data...');

  // Check if we already have about sections
  const existingSections = await prisma.aboutSection.count();
  const existingTeamMembers = await prisma.teamMember.count();

  if (existingSections === 0) {
    console.log('Creating about sections...');
    
    // Create mission section
    await prisma.aboutSection.create({
      data: {
        title: 'Our Mission',
        subtitle: 'Empowering women through education and opportunity',
        content: '<p>At IWLAG, our mission is to create a world where every woman has access to education, resources, and opportunities needed to thrive. We work tirelessly to break down barriers that prevent women from reaching their full potential.</p><p>Through our programs and initiatives, we aim to:</p><ul><li>Provide educational opportunities for women and girls</li><li>Support economic empowerment through skills training</li><li>Advocate for gender equality and women\'s rights</li><li>Create safe spaces for women to connect and grow</li></ul>',
        image: '/placeholder.svg?height=400&width=600',
        order: 1,
        type: 'mission',
        active: true,
      },
    });

    // Create vision section
    await prisma.aboutSection.create({
      data: {
        title: 'Our Vision',
        subtitle: 'A world of equal opportunity',
        content: '<p>We envision a world where gender is never a barrier to success, education, or opportunity. Our vision is to create lasting change that transforms communities and empowers future generations of women leaders.</p><p>We believe in a future where:</p><ul><li>Women have equal access to education at all levels</li><li>Economic opportunities are available to all, regardless of gender</li><li>Women\'s voices are heard and valued in decision-making processes</li><li>Communities thrive through the full participation of women</li></ul>',
        image: '/placeholder.svg?height=400&width=600',
        order: 1,
        type: 'vision',
        active: true,
      },
    });

    // Create history section
    await prisma.aboutSection.create({
      data: {
        title: 'Our History',
        subtitle: 'A decade of making a difference',
        content: '<p>IWLAG was founded in 2013 by a group of passionate advocates for women\'s rights. What began as a small local initiative has grown into an international organization with programs in 25 countries.</p><p>Key milestones in our journey:</p><ul><li><strong>2013:</strong> Founded with our first educational program in Kenya</li><li><strong>2015:</strong> Expanded to 5 countries with the launch of our economic empowerment initiative</li><li><strong>2018:</strong> Reached 5,000 women through our programs</li><li><strong>2020:</strong> Launched our digital education platform to reach women in remote areas</li><li><strong>2023:</strong> Celebrated 10 years with programs in 25 countries and over 15,000 women empowered</li></ul>',
        image: '/placeholder.svg?height=400&width=600',
        order: 1,
        type: 'history',
        active: true,
      },
    });

    // Create values section
    await prisma.aboutSection.create({
      data: {
        title: 'Our Values',
        subtitle: 'The principles that guide our work',
        content: '<p>Our values are at the heart of everything we do. They guide our decisions, shape our programs, and define our organizational culture.</p><ul><li><strong>Empowerment:</strong> We believe in the inherent potential of every woman and work to provide the tools and support needed to unlock it.</li><li><strong>Inclusion:</strong> We are committed to creating spaces where all women feel welcome, valued, and respected.</li><li><strong>Integrity:</strong> We operate with transparency, accountability, and honesty in all our actions.</li><li><strong>Collaboration:</strong> We believe in the power of partnership and work alongside communities to create sustainable change.</li><li><strong>Innovation:</strong> We continuously seek new and effective ways to address challenges and create opportunities.</li></ul>',
        order: 1,
        type: 'values',
        active: true,
      },
    });

    // Create impact section
    await prisma.aboutSection.create({
      data: {
        title: 'Our Impact',
        subtitle: 'Making a difference in women\'s lives',
        content: '<p>Our work has created meaningful change in the lives of thousands of women around the world. Through our programs, we\'ve seen:</p><ul><li>15,000+ women empowered through our educational programs</li><li>8,500+ donors supporting our mission</li><li>120+ projects completed across 25 countries</li><li>85% of program participants reporting improved economic conditions</li><li>90% of scholarship recipients completing their education</li></ul><p>Behind these numbers are real women whose lives have been transformed. Women who can now support their families, pursue their dreams, and become leaders in their communities.</p>',
        order: 1,
        type: 'impact',
        active: true,
      },
    });
  }

  if (existingTeamMembers === 0) {
    console.log('Creating team members...');
    
    // Create team members
    await prisma.teamMember.create({
      data: {
        name: 'Sarah Johnson',
        position: 'Executive Director',
        bio: 'Sarah has over 15 years of experience in nonprofit leadership and women\'s advocacy. She holds a Master\'s in International Development and has worked in 12 countries implementing educational programs for women and girls.',
        image: '/placeholder.svg?height=300&width=300',
        socialLinks: {
          twitter: 'https://twitter.com/sarahjohnson',
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          instagram: 'https://instagram.com/sarahjohnson'
        },
        order: 1,
        active: true,
      },
    });

    await prisma.teamMember.create({
      data: {
        name: 'Maya Patel',
        position: 'Program Director',
        bio: 'Maya oversees all of our educational and economic empowerment programs. With a background in education and community development, she ensures our programs create meaningful impact in the communities we serve.',
        image: '/placeholder.svg?height=300&width=300',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/mayapatel',
          instagram: 'https://instagram.com/mayapatel'
        },
        order: 2,
        active: true,
      },
    });

    await prisma.teamMember.create({
      data: {
        name: 'David Chen',
        position: 'Finance Director',
        bio: 'David brings 10 years of financial management experience to ensure the sustainability of our organization. He is passionate about using financial expertise to maximize the impact of nonprofit work.',
        image: '/placeholder.svg?height=300&width=300',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/davidchen',
        },
        order: 3,
        active: true,
      },
    });

    await prisma.teamMember.create({
      data: {
        name: 'Amina Osei',
        position: 'Global Partnerships Manager',
        bio: 'Amina develops and maintains our relationships with partner organizations around the world. Her diplomatic skills and cross-cultural experience are key to our international success.',
        image: '/placeholder.svg?height=300&width=300',
        socialLinks: {
          twitter: 'https://twitter.com/aminaosei',
          linkedin: 'https://linkedin.com/in/aminaosei',
          instagram: 'https://instagram.com/aminaosei'
        },
        order: 4,
        active: true,
      },
    });
  }

  console.log('About page data seeding completed.');
}

export { seedAboutData };