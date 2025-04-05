import { db } from "@/lib/db";
import { aboutSections, teamMembers } from "@/lib/db/schema";

export async function createAboutTables() {
	try {
		console.log("Creating about_sections table...");
		await db.execute(`
      CREATE TABLE IF NOT EXISTS about_sections (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        content TEXT NOT NULL,
        image VARCHAR(255),
        "order" INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

		console.log("Creating team_members table...");
		await db.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        image VARCHAR(255),
        social_links JSONB,
        "order" INTEGER NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

		console.log("Seeding initial about data...");

		// Seed mission section
		await db.insert(aboutSections).values({
			title: "Our Mission",
			content:
				"<p>We are dedicated to empowering women through education, economic opportunities, and leadership development. Our programs focus on building skills, confidence, and networks that enable women to overcome barriers and achieve their full potential.</p><p>Through our community-based approach, we work closely with local partners to create sustainable change that addresses the unique challenges women face in different contexts.</p>",
			image: "/placeholder.svg?height=400&width=600",
			order: 1,
			type: "mission",
			active: true,
		});

		// Seed vision section
		await db.insert(aboutSections).values({
			title: "Our Vision",
			content:
				"<p>We envision a world where all women have equal opportunities to lead, learn, and thrive. A world where gender is not a barrier to success, and where women's voices are heard and valued in all spheres of society.</p><p>We believe that when women are empowered, entire communities benefit, leading to stronger economies, healthier families, and more peaceful societies.</p>",
			image: "/placeholder.svg?height=400&width=600",
			order: 1,
			type: "vision",
			active: true,
		});

		// Seed history sections
		await db.insert(aboutSections).values({
			title: "Our Beginnings",
			subtitle: "2008-2010",
			content:
				"<p>Our organization was founded in 2008 by a group of passionate women who recognized the need for targeted support for women in underserved communities. What began as a small grassroots initiative has grown into a global movement.</p>",
			image: "/placeholder.svg?height=300&width=500&text=History+1",
			order: 1,
			type: "history",
			active: true,
		});

		await db.insert(aboutSections).values({
			title: "Expanding Our Reach",
			subtitle: "2011-2015",
			content:
				"<p>As our programs demonstrated success, we expanded to new regions and developed additional initiatives to address the diverse needs of women in different contexts. During this period, we established key partnerships with local organizations and international supporters.</p>",
			image: "/placeholder.svg?height=300&width=500&text=History+2",
			order: 2,
			type: "history",
			active: true,
		});

		await db.insert(aboutSections).values({
			title: "Global Impact",
			subtitle: "2016-Present",
			content:
				"<p>Today, we operate in over 20 countries, reaching thousands of women each year through our programs and advocacy efforts. We continue to innovate and adapt our approaches to create meaningful and lasting change in the lives of women and their communities.</p>",
			image: "/placeholder.svg?height=300&width=500&text=History+3",
			order: 3,
			type: "history",
			active: true,
		});

		// Seed values sections
		await db.insert(aboutSections).values({
			title: "Empowerment",
			content:
				"<p>We believe in the inherent potential of every woman and work to create environments where they can develop their capabilities and exercise their agency.</p>",
			order: 1,
			type: "values",
			active: true,
		});

		await db.insert(aboutSections).values({
			title: "Inclusion",
			content:
				"<p>We are committed to reaching women from all backgrounds and ensuring that our programs are accessible and relevant to diverse communities.</p>",
			order: 2,
			type: "values",
			active: true,
		});

		await db.insert(aboutSections).values({
			title: "Collaboration",
			content:
				"<p>We recognize that lasting change requires collective effort and work closely with partners at all levels to amplify our impact.</p>",
			order: 3,
			type: "values",
			active: true,
		});

		// Seed impact sections
		await db.insert(aboutSections).values({
			title: "5,000+",
			subtitle: "Women Empowered",
			order: 1,
			type: "impact",
			active: true,
			content: "",
		});

		await db.insert(aboutSections).values({
			title: "120+",
			subtitle: "Communities Served",
			order: 2,
			type: "impact",
			active: true,
			content: "",
		});

		await db.insert(aboutSections).values({
			title: "50+",
			subtitle: "Active Programs",
			order: 3,
			type: "impact",
			active: true,
			content: "",
		});

		await db.insert(aboutSections).values({
			title: "15+",
			subtitle: "Years of Impact",
			order: 4,
			type: "impact",
			active: true,
			content: "",
		});

		// Seed team members
		await db.insert(teamMembers).values({
			name: "Sarah Johnson",
			position: "Executive Director",
			bio: "Sarah has over 15 years of experience in nonprofit leadership and women's empowerment initiatives. She has led the organization through significant growth and impact expansion.",
			image: "/placeholder.svg?height=300&width=300&text=Sarah+Johnson",
			socialLinks: {
				twitter: "https://twitter.com",
				linkedin: "https://linkedin.com",
			},
			order: 1,
			active: true,
		});

		await db.insert(teamMembers).values({
			name: "Maria Rodriguez",
			position: "Program Director",
			bio: "Maria oversees all of our programs and ensures they are effectively meeting the needs of the women we serve. She has a background in international development and gender studies.",
			image: "/placeholder.svg?height=300&width=300&text=Maria+Rodriguez",
			socialLinks: {
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
			order: 2,
			active: true,
		});

		await db.insert(teamMembers).values({
			name: "Aisha Patel",
			position: "Director of Partnerships",
			bio: "Aisha builds and maintains relationships with our partners around the world. Her strategic approach has helped us expand our reach and impact significantly.",
			image: "/placeholder.svg?height=300&width=300&text=Aisha+Patel",
			socialLinks: {
				twitter: "https://twitter.com",
				linkedin: "https://linkedin.com",
			},
			order: 3,
			active: true,
		});

		await db.insert(teamMembers).values({
			name: "David Chen",
			position: "Finance Director",
			bio: "David ensures the financial sustainability of our organization and oversees all financial operations. His expertise has been crucial to our growth and stability.",
			image: "/placeholder.svg?height=300&width=300&text=David+Chen",
			socialLinks: {
				linkedin: "https://linkedin.com",
			},
			order: 4,
			active: true,
		});

		console.log("About tables created and seeded successfully!");
	} catch (error) {
		console.error("Error creating about tables:", error);
		throw error;
	}
}
