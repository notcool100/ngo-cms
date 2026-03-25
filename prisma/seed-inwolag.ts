import { PrismaClient, Role, TeamType, PublicationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding INWOLAG specific content...');

  // 1. Get or Create Admin User
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@inwolag.org.np' },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@inwolag.org.np',
        role: Role.ADMIN,
      },
    });
  }

  // 2. Update Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default-settings' },
    update: {
      siteName: 'INWOLAG',
      siteDescription: 'For Nepalese Indigenous Women, By Nepalese Indigenous Women. Dedicated to protecting and promoting the dignity, rights, and well-being of Indigenous communities.',
    },
    create: {
      id: 'default-settings',
      siteName: 'INWOLAG',
      siteDescription: 'For Nepalese Indigenous Women, By Nepalese Indigenous Women. Dedicated to protecting and promoting the dignity, rights, and well-being of Indigenous communities.',
    },
  });

  // 3. About Sections (Mission, Vision, History, etc.)
  // Clean up existing sections first to ensure correct order/content
  await prisma.aboutSection.deleteMany({});

  await prisma.aboutSection.createMany({
    data: [
      {
        title: 'Our Mission',
        subtitle: 'Creating an egalitarian society',
        content: '<p>To create an egalitarian and prospective society free from domination and discrimination based on race, caste, ethnicity, language, religion, culture, gender, class, and region.</p>',
        order: 1,
        type: 'mission',
        active: true,
      },
      {
        title: 'Our Vision',
        subtitle: 'Recognition and Respect',
        content: '<p>To create a condition where Indigenous women are recognized and the language and culture of Indigenous peoples are respected.</p>',
        order: 1,
        type: 'vision',
        active: true,
      },
      {
        title: 'Who We Are',
        subtitle: 'Established on August 19, 2000',
        content: '<p>Indigenous Women Legal Awareness Group (INWOLAG) is a non-governmental, non-profit, and non-political organization established on August 19, 2000 (3 Bhadra 2057 B.S.) by seven Indigenous women lawyers. It is dedicated to protecting and promoting the dignity, rights, and well-being of Indigenous communities, especially women, in Nepal.</p>',
        order: 1,
        type: 'history',
        active: true,
      },
      {
        title: 'Our Aims',
        subtitle: 'Promoting Rights and Well-being',
        content: '<ul><li>Increase access to justice for Indigenous women and girls.</li><li>Eliminate discrimination, exploitation, and violence through awareness and advocacy.</li><li>Uphold Indigenous collective rights, including land, resources, and traditional knowledge.</li><li>Support community resilience against structural inequalities and climate impacts.</li><li>Promote leadership and representation in decision-making processes.</li></ul>',
        order: 2,
        type: 'history',
        active: true,
      },
    ],
  });

  // 4. Team Members (Board of Directors)
  await prisma.teamMember.deleteMany({});
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Adv. Indira Kumari Shreesh',
        position: 'Chairperson',
        bio: 'Founding member and Chairperson of INWOLAG.',
        order: 1,
        teamType: TeamType.BOARD,
        active: true,
      },
      {
        name: 'Adv. Uma Tamang',
        position: 'Vice Chairperson',
        bio: 'Founding member and Vice Chairperson of INWOLAG.',
        order: 2,
        teamType: TeamType.BOARD,
        active: true,
      },
      {
        name: 'Adv. Kaushila Rai',
        position: 'General Secretary',
        bio: 'Founding member and General Secretary of INWOLAG.',
        order: 3,
        teamType: TeamType.BOARD,
        active: true,
      },
      {
        name: 'Adv. Ritu Thapa Magar',
        position: 'Treasurer',
        bio: 'Founding member and Treasurer of INWOLAG.',
        order: 4,
        teamType: TeamType.BOARD,
        active: true,
      },
    ],
  });

  // 5. Programs (Thematic Areas)
  await prisma.programCategory.upsert({
    where: { slug: 'thematic-areas' },
    update: {},
    create: {
      name: 'Thematic Areas',
      slug: 'thematic-areas',
      description: 'Core thematic areas of INWOLAG\'s work.',
    },
  });

  const category = await prisma.programCategory.findUnique({ where: { slug: 'thematic-areas' } });

  if (category) {
    await prisma.program.deleteMany({});
    await prisma.program.createMany({
      data: [
        {
          title: 'Legal Aid (Access to Justice)',
          slug: 'legal-aid',
          description: 'Free legal services for Indigenous women survivors of violence and rights violations.',
          content: '<p>Advanced Indigenous women’s rights and access to justice through a holistic approach combining legal aid, advocacy, awareness, research, and empowerment.</p>',
          categoryId: category.id,
          featured: true,
          active: true,
        },
        {
          title: 'Indigenous Collective Rights',
          slug: 'indigenous-collective-rights',
          description: 'Focused on collective ownership, identity, and the principle of FPIC.',
          content: '<p>Uphold Indigenous collective rights, including land, resources, and traditional knowledge. Focused on collective ownership, identity, and the principle of Free, Prior and Informed Consent (FPIC).</p>',
          categoryId: category.id,
          featured: true,
          active: true,
        },
        {
          title: 'Gender Just Climate',
          slug: 'gender-just-climate',
          description: 'Livelihood training to help Indigenous women mitigate and adapt to climate change impacts.',
          content: '<p>Support community resilience against structural inequalities and climate impacts. Livelihood training to help Indigenous women mitigate and adapt to climate change impacts.</p>',
          categoryId: category.id,
          featured: true,
          active: true,
        },
        {
          title: 'Research and Study',
          slug: 'research-and-study',
          description: 'Evidence-based lobbying and advocacy through intensive research projects.',
          content: '<p>Conduct investigation and legal research on Indigenous issues. Evidence-based lobbying and advocacy through intensive research projects.</p>',
          categoryId: category.id,
          featured: true,
          active: true,
        },
      ],
    });
  }

  // 6. Publications (2021-2025)
  await prisma.publication.deleteMany({});
  await prisma.publication.createMany({
    data: [
      {
        title: 'Women & Rivers (Beyond Borders)',
        slug: 'women-rivers-2025',
        description: 'Focuses on women\'s role in river conservation and management across borders.',
        fileUrl: '/publications/women-rivers-2025.pdf',
        authorId: admin.id,
        published: true,
        publishedAt: new Date('2025-01-01'),
        type: PublicationType.REPORT,
      },
      {
        title: 'Beyond the Dam: Intangible Loss and Damage to Magar Communities',
        slug: 'beyond-the-dam-2025',
        description: 'Study on the impacts of hydropower projects on the Magar community.',
        fileUrl: '/publications/beyond-the-dam-2025.pdf',
        authorId: admin.id,
        published: true,
        publishedAt: new Date('2025-01-15'),
        type: PublicationType.REPORT,
      },
      {
        title: 'CEDAW General Recommendation 39 translation',
        slug: 'cedaw-gr39-2022',
        description: 'Translation of CEDAW General Recommendation 39 into local context.',
        fileUrl: '/publications/cedaw-gr39-2022.pdf',
        authorId: admin.id,
        published: true,
        publishedAt: new Date('2022-06-20'),
        type: PublicationType.OTHER,
      },
      {
        title: 'Sustainability in Trophy Hunting Practices',
        slug: 'trophy-hunting-2024',
        description: 'Analysis of trophy hunting practices and its sustainability for Indigenous peoples.',
        fileUrl: '/publications/trophy-hunting-2024.pdf',
        authorId: admin.id,
        published: true,
        publishedAt: new Date('2024-03-10'),
        type: PublicationType.REPORT,
      },
      {
        title: 'Impacts of Hydropower and Mining on Indigenous Women',
        slug: 'hydropower-mining-impacts-2023',
        description: 'Research on the socioeconomic and environmental impacts of hydropower and mining.',
        fileUrl: '/publications/hydropower-mining-impacts-2023.pdf',
        authorId: admin.id,
        published: true,
        publishedAt: new Date('2023-11-25'),
        type: PublicationType.REPORT,
      },
    ],
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
