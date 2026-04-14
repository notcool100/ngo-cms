const paragraphsToHtml = (paragraphs: string[]) =>
	paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");

const bulletsToHtml = (items: string[]) =>
	`<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

const sectionToHtml = (paragraphs: string[], bullets?: string[]) =>
	`${paragraphsToHtml(paragraphs)}${bullets ? bulletsToHtml(bullets) : ""}`;

const whoWeAreParagraphs = [
	"Indigenous Women Legal Awareness Group (INWOLAG) is a non-governmental, non-profit, and non-political organisation established on 19 August 2000 (3 Bhadra 2057 B.S.) by a group of seven Indigenous women lawyers committed to protecting and promoting the dignity, rights, and well-being of Indigenous communities, particularly women, in Nepal.",
	"INWOLAG was established for Indigenous women and girls, recognising the fact that national laws and legal systems often overlooked the distinct social, cultural, and linguistic traditions of Indigenous communities.",
	"Positioning itself as a trailblazing Indigenous women's rights organization, our vision is to build an equitable society free from discrimination and violence, where the collective rights of Indigenous communities are recognised and respected.",
];

const aboutObjectives = [
	"To increase access to justice to Indigenous women and children by providing legal aid service, legal counseling, legal advocacy and mediation to Indigenous women and children to secure their legal and human rights.",
	"To conduct investigation, study, and legal research on various issues of Indigenous peoples with a focus on Indigenous women and children, including international laws relating to Indigenous women and children.",
	"To advocate for the socioeconomic, cultural, educational, and intellectual agenda and issues of Indigenous women and children.",
	"To raise legal awareness among Indigenous peoples and marginalized communities to eliminate all forms of discrimination, exploitation, and violence against Indigenous women and children through publications, media partnerships, trainings, workshops, interactions, seminars, symposia, dialogues and talk programs.",
	"To monitor incidences of human rights violation, with a focus on violence against Indigenous women and children, and carry out field investigation where necessary.",
	"To work for effective implementation of international human rights standards with a focus on UNDRIP, ILO Convention 169, and CEDAW.",
	"To work for the political rights of Indigenous women, especially their representation at federal, provincial, and local levels.",
];

export const INWOLAG_CONTENT = {
	siteName: "INWOLAG",
	contactEmail: "admin@inwolag.org.np",
	siteDescription:
		"Indigenous Women Legal Awareness Group (INWOLAG) advances Indigenous women's rights, access to justice, collective rights, gender-just climate action, and evidence-based advocacy in Nepal.",
	slogan: [
		"For Nepalese Indigenous Women",
		"By Nepalese Indigenous Women",
	],
	heroSummary:
		"INWOLAG is a non-governmental, non-profit, and non-political organisation established on 19 August 2000 by seven Indigenous women lawyers committed to protecting and promoting the dignity, rights, and well-being of Indigenous communities, particularly women, in Nepal.",
	whoWeAre: whoWeAreParagraphs,
	whatWeDo:
		"INWOLAG focuses on advancing Indigenous women's rights and access to justice through a holistic approach combining legal aid, advocacy, awareness, research, and empowerment.",
	whyWeDo:
		"INWOLAG's objectives stem from a deep commitment to justice, equity, and empowerment for Indigenous women and communities long marginalised by Nepal's legal and socio-political structures.",
	objectives: [
		"Increase access to justice for Indigenous women and girls.",
		"Eliminate discrimination, exploitation, and violence through awareness and advocacy.",
		"Uphold Indigenous collective rights, including land, resources, and traditional knowledge.",
		"Support community resilience against structural inequalities, gender-based violence, and climate and development impacts.",
		"Promote Indigenous women's leadership and representation in decision-making processes.",
	],
	aboutObjectives,
	reachSummary:
		"INWOLAG has extended its work across 40 districts in all seven provinces of Nepal, particularly in regions with a high concentration of Indigenous populations and significant human rights challenges.",
	stats: [
		{ value: "25+", label: "Years of advocacy" },
		{ value: "40", label: "Districts reached" },
		{ value: "7", label: "Provinces reached" },
		{ value: "7", label: "Founding women lawyers" },
	],
	partners: [
		"NFDIN",
		"TEWA",
		"FWLD",
		"Mama Cash",
		"FIMI",
		"RRI",
		"NGO Forum on ADB",
		"Coalition for Human Rights in Development",
		"AIPP",
		"Women's Fund Asia (WFA)",
		"Global Greengrants Fund (GGF)",
		"Global Alliance for Green and Gender Action (GAGGA)",
	],
	mediaLinks: [
		"https://www.youtube.com/watch?v=ahGEuSm2sZ8",
		"https://www.youtube.com/watch?v=gcCUzUYFtQ8",
		"https://www.youtube.com/watch?v=14v3lVDglBU",
		"https://www.youtube.com/watch?v=5LycovAb6Go",
		"https://www.youtube.com/watch?v=6h-iDbUuRAU",
		"https://www.youtube.com/watch?v=kekdYDBBacU",
		"https://www.youtube.com/watch?v=no0g4BdSwGc",
	],
	thematicAreas: [
		{
			title: "Legal Aid (Access to Justice)",
			slug: "legal-aid-access-to-justice",
			description:
				"Free legal awareness, counseling, litigation, and psychosocial support for Indigenous women survivors of violence and rights violations.",
			content:
				sectionToHtml([
					"INWOLAG provides legal awareness, counseling, litigation, and psychosocial services to Indigenous women survivors of violence and rights violations, all for free.",
					"As a leading advocate for Indigenous women's rights, we bridge access to justice and empowerment at both the local and national levels.",
				]),
			featured: true,
		},
		{
			title: "Indigenous Collective Rights",
			slug: "indigenous-collective-rights",
			description:
				"Advancing collective ownership, identity, self-determination, and Free, Prior and Informed Consent (FPIC).",
			content:
				sectionToHtml([
					"INWOLAG promotes the collective ownership, identity, and self-determination of Indigenous communities by safeguarding their ancestral lands, cultures, and traditions.",
					"With a strong emphasis on the principle of Free, Prior and Informed Consent (FPIC), we support Indigenous peoples' right to make decisions about their lands, territories, and resources before any development or policy is implemented.",
				]),
			featured: true,
		},
		{
			title: "Conservation and Protected Parks",
			slug: "conservation-and-protected-parks",
			description:
				"Research, advocacy, and legal analysis on Indigenous peoples' rights within conservation and protected area governance.",
			content:
				sectionToHtml([
					"INWOLAG works on conservation governance and protected area policies to ensure Indigenous peoples, women, and local communities are not displaced, criminalized, or excluded from their ancestral territories.",
					"Our work examines laws, conservation practices, benefit-sharing systems, and the lived experiences of Indigenous communities in and around protected areas.",
				]),
			featured: true,
		},
		{
			title: "Gender Just Climate",
			slug: "gender-just-climate",
			description:
				"Livelihood training and climate resilience work that centers Indigenous women's knowledge, rights, and adaptive capacity.",
			content:
				sectionToHtml([
					"INWOLAG provides livelihood training programs for Indigenous women to help them mitigate and adapt to the impacts of climate change.",
					"These trainings equip women with practical skills and sustainable practices that strengthen both environmental resilience and economic independence.",
				]),
			featured: true,
		},
		{
			title: "Research and Publications",
			slug: "research-and-publications",
			description:
				"Evidence-based documentation and publications that amplify Indigenous women's voices and inform rights-based policymaking.",
			content:
				sectionToHtml([
					"Research and documentation remain central to INWOLAG's strategy of evidence-based lobby and advocacy.",
					"Over 25 years, the organisation has led multiple research projects documenting the impacts of development projects on Indigenous Peoples, amplifying Indigenous women's voices, and providing data for rights-based policymaking.",
				]),
			featured: true,
		},
	],
	aboutSections: [
		{
			title: "Our Mission",
			subtitle: "An egalitarian and prospective society",
			type: "mission",
			order: 1,
			content: sectionToHtml([
				"To create an egalitarian and prospective society where there is no domination and discrimination based on race, caste, ethnicity, language, religion, culture, gender, class, and region.",
			]),
		},
		{
			title: "Our Vision",
			subtitle: "Recognition and respect",
			type: "vision",
			order: 1,
			content: sectionToHtml([
				"To create a condition where Indigenous women are recognized, and the language and culture of Indigenous peoples are respected.",
			]),
		},
		{
			title: "Who We Are",
			subtitle: "Established on 19 August 2000",
			type: "history",
			order: 1,
			content: sectionToHtml(whoWeAreParagraphs),
		},
		{
			title: "Our Objectives",
			subtitle: "Justice, dignity, and collective rights",
			type: "history",
			order: 2,
			content: sectionToHtml([], aboutObjectives),
		},
	],
	teamMembers: [
		{
			name: "Adv. Indira Kumari Shreesh",
			position: "Founder / Chairperson",
			teamType: "BOARD",
			order: 1,
			bio: "Advocate Indira Kumari Shreesh is a senior legal practitioner and human rights scholar with over two decades of experience in advancing Indigenous peoples' rights, gender justice, and environmental governance. She holds an LL.M. in Human Rights and Gender Justice and a postgraduate degree in Indigenous Studies and Development (MIED). She is a practicing advocate at the Supreme Court of Nepal and the founder and chairperson of INWOLAG.",
		},
		{
			name: "Adv. Uma Tamang",
			position: "Founder / Vice Chairperson",
			teamType: "BOARD",
			order: 2,
			bio: "Uma Tamang is an advocate and human rights defender with more than two decades of work on women's rights, children's rights, anti-trafficking, legal aid, and policy advocacy. As a founding member of INWOLAG, she contributes to lobbying, legal reform, and the strengthening of Indigenous Women Human Rights Defenders in and around conservation areas.",
		},
		{
			name: "Adv. Kaushila Rai",
			position: "Founder / General Secretary",
			teamType: "BOARD",
			order: 3,
			bio: "Kaushila Rai is an advocate and social activist with over 25 years of experience in Nepal's legal sector. She works on human rights, gender justice, policy analysis, CEDAW, land rights, and FPIC advocacy, and continues to support community-level awareness and rights-based development approaches.",
		},
		{
			name: "Adv. Ritu Thapa Magar",
			position: "Founder / Treasurer",
			teamType: "BOARD",
			order: 4,
			bio: "Advocate Ritu Thapa Magar is an Indigenous lawyer, human rights advocate, and trainer with over two decades of experience advancing the rights of Indigenous Peoples, particularly women and girls in Nepal. Her work focuses on access to justice, violence against women, FPIC, land rights, conservation governance, and equitable development.",
		},
		{
			name: "Adv. Mon Kumari Rai",
			position: "Board Member",
			teamType: "BOARD",
			order: 5,
			bio: "Mon Kumari Rai holds a Bachelor in Law from Tribhuvan University and serves as a board member of INWOLAG. She has been active in promoting the rights of women and Indigenous communities through advocacy, free legal aid, training, and legal awareness on gender-based violence.",
		},
		{
			name: "Adv. Jayanti Rai",
			position: "Board Member",
			teamType: "BOARD",
			order: 6,
			bio: "Board member of INWOLAG supporting the organisation's leadership and advocacy for Indigenous women's rights.",
		},
		{
			name: "Adv. Rita Sherpa",
			position: "Board Member",
			teamType: "BOARD",
			order: 7,
			bio: "Board member of INWOLAG contributing to legal awareness, advocacy, and the advancement of Indigenous women's rights.",
		},
		{
			name: "Adv. Sarada Subba",
			position: "Advisory Council / Founder",
			teamType: "STAFF",
			order: 8,
			bio: "Sarada Subba is the founding chairperson of INWOLAG and a human rights lawyer with a Master's in Human Rights and Gender Justice. She advises the board, contributes to organisational programs, and continues to support advocacy, free legal aid, and training.",
		},
		{
			name: "Adv. Kshatra Kumari Gurung",
			position: "Advisory Council / Founder",
			teamType: "STAFF",
			order: 9,
			bio: "Founder and advisory council member supporting INWOLAG's long-term vision and organisational guidance.",
		},
		{
			name: "Adv. Basundhara Thapa",
			position: "Advisory Council / Founder",
			teamType: "STAFF",
			order: 10,
			bio: "Founder and advisory council member contributing to institutional memory, rights advocacy, and strategic guidance.",
		},
		{
			name: "Yasokanti Bhattachan",
			position: "Advisory Council",
			teamType: "STAFF",
			order: 11,
			bio: "Advisory council member supporting INWOLAG's work on Indigenous peoples' rights and community accountability.",
		},
		{
			name: "Gita Thapa",
			position: "Focal Person / Tanahu",
			teamType: "STAFF",
			order: 12,
			bio: "Local focal person coordinating community engagement and support in Tanahu.",
		},
		{
			name: "Punam Shrestha",
			position: "Focal Person / Banke",
			teamType: "STAFF",
			order: 13,
			bio: "Local focal person supporting outreach and coordination in Banke.",
		},
		{
			name: "Kamala Bahik",
			position: "Focal Person / Rupandehi",
			teamType: "STAFF",
			order: 14,
			bio: "Local focal person supporting awareness and community-level coordination in Rupandehi.",
		},
		{
			name: "Anita Rai",
			position: "Focal Person / Koshi",
			teamType: "STAFF",
			order: 15,
			bio: "Local focal person supporting regional coordination and community engagement in Koshi Province.",
		},
		{
			name: "Phulmati Mahato",
			position: "Focal Person / Kanchanpur",
			teamType: "STAFF",
			order: 16,
			bio: "Local focal person supporting INWOLAG's field presence and community connections in Kanchanpur.",
		},
	],
	publications: [
		{
			title:
				"Exploring Sustainability in Trophy Hunting Practices at Dhorpatan Hunting Reserve, Nepal: A Balancing Act?",
			slug: "exploring-sustainability-in-trophy-hunting-practices-2024",
			type: "REPORT",
			publishedAt: "2024-09-01",
			featured: true,
			description: sectionToHtml([
				"This 2024 study assesses the sustainability of the Dhorpatan Hunting Reserve by examining socioeconomic, cultural, and ecological impacts on Indigenous Peoples and Local Communities (IPLCs), wildlife trends, land cover change, and the financial viability of trophy hunting.",
				"The findings highlight tensions between conservation policies and Indigenous rights, declining wildlife populations, livelihood pressures, and the urgent need for inclusive, Indigenous-driven conservation strategies.",
			], [
				"Keywords: Cultural, Dalits, DHR, Ecological, IPLCs, Naur, Socioeconomic, Trophy hunting.",
			]),
		},
		{
			title: "Testimonies of Tanahu Hydropower affected Magar Indigenous Women",
			slug: "testimonies-of-tanahu-hydropower-affected-magar-indigenous-women",
			type: "REPORT",
			publishedAt: "2025-01-01",
			featured: true,
			description: sectionToHtml([
				"This research documents how the Tanahu Hydropower Project threatens the ancestral lands, cultural spaces, spiritual sites, and traditional livelihoods of Magar Indigenous women.",
				"Through first-hand testimonies, it shows the gap between formal protections and lived realities, calling for the meaningful implementation of FPIC and the right to self-determination.",
			], [
				"Keywords: Right to Self-Determination, Lived Experiences, Resilience, Traditional Livelihoods.",
			]),
		},
		{
			title: "Women & Rivers (Beyond Borders)",
			slug: "women-and-rivers-beyond-borders",
			type: "REPORT",
			publishedAt: "2025-05-01",
			featured: true,
			description: sectionToHtml([
				"This cross-border study explores the causes of dying rivers and pathways for river restoration across Nepal and India, with a focus on Indigenous communities and women living near seven river valleys.",
				"It documents how dam construction, deforestation, pollution, and climate change are disrupting river systems, weakening customary management, and disproportionately burdening women who remain marginalized in decision-making.",
			], [
				"Keywords: Gender and Water, Indigenous Knowledge, Riverine Communities, Community-based river governance, Water Security.",
			]),
		},
		{
			title:
				"Beyond the Dam: Intangible Loss and Damage to the Magar Indigenous Communities in Nepal",
			slug: "beyond-the-dam-intangible-loss-and-damage",
			type: "REPORT",
			publishedAt: "2025-06-01",
			featured: true,
			description: sectionToHtml([
				"This research documents the profound intangible and long-term losses experienced by the Indigenous Magar community affected by the Tanahu Hydropower Project on Nepal's Seti River.",
				"It focuses on cultural heritage erosion, identity and language disruption, and the undermining of Indigenous knowledge systems, arguing for development approaches that recognize sacred rivers and cultural assets.",
			], [
				"Keywords: Loss and Damage, Intangible Losses, Indigenous Rights Protection, Cultural Asset.",
			]),
		},
		{
			title:
				"Assessing Gender Impacts of Proposed Iron Mining in Jhumlawang, Bhume Rural Municipality-3, East Rukum",
			slug: "assessing-gender-impacts-of-proposed-iron-mining-jhumlawang",
			type: "REPORT",
			publishedAt: "2025-05-15",
			featured: false,
			description: sectionToHtml([
				"This technical survey examines the gendered impacts of a proposed iron mining project on Indigenous Magar and Dalit women in Jhumlawang, East Rukum.",
				"It highlights poverty, dependence on natural resources, risks of gender-based violence, environmental harm, weak project awareness, and the urgent need for FPIC, community-led assessments, and transparent benefit-sharing.",
			], [
				"Keywords: Iron Mining, Gendered Impacts, Alternative Livelihoods, Resource Governance, Extractive Industries.",
			]),
		},
		{
			title:
				"Assessing Socio-Economic, Education, and Perceptions of Indigenous Peoples and Local Communities in and around Dhorpatan Hunting Reserve, Nepal",
			slug: "assessing-socio-economic-education-and-perceptions-dhorpatan",
			type: "REPORT",
			publishedAt: "2024-09-15",
			featured: false,
			description: sectionToHtml([
				"This study explores socioeconomic conditions, education, and conservation perceptions among Indigenous Peoples and Local Communities in and around Dhorpatan Hunting Reserve.",
				"It documents livelihood insecurity, gender disparities in education, weakening customary institutions, and deep dissatisfaction with prevailing conservation approaches, calling for stronger community-led conservation systems.",
			], [
				"Keywords: Community-based Conservation, Conservation Governance, Indigenous Peoples and Local Communities (IPLCs), Socioeconomic Inequality.",
			]),
		},
		{
			title:
				"Perception of Indigenous Bote and Tharus on Existing Conservation Approaches in Paithani Village of Chitwan National Park and Buffer Zone",
			slug: "perception-of-bote-and-tharus-on-conservation-approaches-patihani",
			type: "REPORT",
			publishedAt: "2024-08-01",
			featured: false,
			description: sectionToHtml([
				"This study evaluates the perceptions of Bote and Tharu Indigenous peoples regarding conservation approaches in and around Chitwan National Park and its buffer zone.",
				"It highlights landlessness, exclusion from management, fear of wildlife conflict, and the need for recognition of Indigenous laws, improved benefit-sharing, and stronger participatory mechanisms.",
			], [
				"Keywords: Bote, Chitwan, Indigenous rights, National Park, Rhino, Tharu, Tiger, Women.",
			]),
		},
		{
			title:
				"Perception of Indigenous Peoples on Existing Conservation Approaches in Barahakshetra Municipality-11, Koshi Tappu Wildlife Reserve, Nepal",
			slug: "perception-of-indigenous-peoples-on-conservation-approaches-koshi-tappu",
			type: "REPORT",
			publishedAt: "2024-10-01",
			featured: false,
			description: sectionToHtml([
				"This study examines the perceptions of Indigenous Majhi communities toward conservation practices in the Koshi Tappu Wildlife Reserve buffer zone.",
				"It documents economic vulnerability, dissatisfaction with reserve management, human-wildlife conflict, and continued reliance on customary institutions, recommending more inclusive and community-centered conservation governance.",
			], [
				"Keywords: Majhi Community, Wildlife Reserve, Human-wildlife Conflict, Benefit-sharing Mechanisms, Participatory Resource Management.",
			]),
		},
		{
			title:
				"Aspiration and Realities to Imagine Violence Free Lives for Indigenous Women and Indigenous Women with Disabilities",
			slug: "aspiration-and-realities-violence-free-lives",
			type: "REPORT",
			publishedAt: "2021-11-01",
			featured: false,
			description: sectionToHtml([
				"This research, developed under the joint initiative 'Claiming Our Voices: Beijing+25 Review and Follow-Up,' centers the lived realities of violence against Indigenous Women and Indigenous Women with Disabilities in Nepal.",
				"It calls for more inclusive policies and interventions by documenting intersecting discrimination, barriers to justice, and the need for evidence-based advocacy grounded in lived experience.",
			], [
				"Keywords: Social Justice, Feminist Advocacy, Access to Justice, Indigenous Women, Indigenous Women with Disability.",
			]),
		},
		{
			title:
				"Baseline Report for Addressing Collective Land in Relation to Land-for-Land Compensation",
			slug: "baseline-report-for-addressing-collective-land-compensation",
			type: "REPORT",
			publishedAt: "2025-12-01",
			featured: false,
			description: sectionToHtml([
				"This baseline report documents the claims of Indigenous Magar communities whose ancestral and collective lands are being submerged by the Tanahu Hydropower Project.",
				"It draws on domestic and international law to argue for land-for-land compensation, recognition of customary land, implementation of FPIC, and accountability from the project, the state, and international financiers.",
			], [
				"Keywords: Indigenous Land Rights, Customary Law, Land for land compensation, Free, Prior and Informed Consent.",
			]),
		},
		{
			title:
				"CEDAW General Recommendation 39 on the Rights of Indigenous Women and Girls (Nepali Translation)",
			slug: "cedaw-general-recommendation-39-nepali-translation",
			type: "OTHER",
			publishedAt: "2022-01-01",
			featured: false,
			description: sectionToHtml([
				"This Nepali translation of CEDAW General Recommendation 39 outlines the structural and intersecting discrimination faced by Indigenous women and girls, and clarifies state obligations under international law.",
				"It emphasizes self-determination, meaningful consultation, environmental justice, and protection for Indigenous women as rights-holders, knowledge-bearers, and defenders.",
			]),
		},
		{
			title:
				"Indigenous Rights in Nepal's Protected Areas: Policy Analysis of the National Parks and Wildlife Conservation Act",
			slug: "indigenous-rights-in-nepals-protected-areas-policy-analysis",
			type: "REPORT",
			publishedAt: "2024-01-01",
			featured: false,
			description: sectionToHtml([
				"This review examines whether Nepal's current protected area legislation is compatible with the rights of Indigenous peoples, women, and local communities who live in and around protected areas.",
				"It concludes that prevailing laws remain exclusionary and recommends legal reform, stronger implementation of international standards, empirical review of abuses in protected areas, and greater recognition of Indigenous leadership and participation.",
			]),
		},
	],
	volunteerOpportunities: [
		{
			title: "Legal Awareness Support",
			description:
				"Support community legal awareness sessions, paralegal outreach, and documentation related to access to justice for Indigenous women and girls.",
			commitment: "Flexible, based on campaigns and community sessions",
			skills: ["Legal literacy", "Community facilitation", "Documentation"],
		},
		{
			title: "Research and Documentation",
			description:
				"Contribute to research assistance, field notes, translation, transcription, and documentation that strengthens evidence-based advocacy.",
			commitment: "Project-based, remote or field support",
			skills: ["Research", "Writing", "Translation"],
		},
		{
			title: "Advocacy and Outreach",
			description:
				"Help amplify Indigenous women's voices through public education, campaign coordination, and outreach with communities and partner networks.",
			commitment: "Flexible, campaign-driven",
			skills: ["Advocacy", "Communication", "Networking"],
		},
		{
			title: "Media and Storytelling",
			description:
				"Support content preparation, interviews, summaries, and digital storytelling around rights, climate justice, and collective land struggles.",
			commitment: "Flexible, digital-first",
			skills: ["Editing", "Content creation", "Interview support"],
		},
		{
			title: "Field Coordination",
			description:
				"Assist coordination with focal persons, workshops, consultations, and community meetings across districts and provinces.",
			commitment: "Event or field based",
			skills: ["Coordination", "Logistics", "Teamwork"],
		},
		{
			title: "Partner and Event Support",
			description:
				"Help with trainings, dialogues, publication launches, and partner engagements focused on Indigenous women's rights and policy advocacy.",
			commitment: "Occasional, event-based",
			skills: ["Event support", "Hospitality", "Organisation"],
		},
	],
	donationAreas: [
		{
			title: "Access to Justice",
			description:
				"Support free legal aid, counseling, litigation support, and awareness work for Indigenous women and girls.",
		},
		{
			title: "Collective Rights Advocacy",
			description:
				"Strengthen advocacy on land, territory, natural resources, customary law, and Free, Prior and Informed Consent.",
		},
		{
			title: "Gender Just Climate Work",
			description:
				"Back livelihood training, climate resilience, and community-led adaptation initiatives centered on Indigenous women.",
		},
		{
			title: "Research and Publications",
			description:
				"Enable field research, translation, publications, and evidence-based policy advocacy grounded in community realities.",
		},
	],
	contactFaqs: [
		{
			question: "How can I collaborate with INWOLAG?",
			answer:
				"Use the contact form to reach us about partnerships, advocacy, training, legal awareness, research collaboration, or community engagement.",
		},
		{
			question: "Do you provide legal aid services?",
			answer:
				"Yes. Legal aid and access to justice are core parts of INWOLAG's work, especially for Indigenous women facing violence or rights violations.",
		},
		{
			question: "Can I support your research or publications work?",
			answer:
				"Yes. We welcome support for research, documentation, translation, dissemination, and rights-based publication work.",
		},
		{
			question: "Where does INWOLAG work?",
			answer:
				"INWOLAG has worked across 40 districts in all seven provinces of Nepal, especially where Indigenous communities face major rights challenges.",
		},
	],
} as const;

export const INWOLAG_DEFAULTS = {
	siteName: INWOLAG_CONTENT.siteName,
	siteDescription: INWOLAG_CONTENT.siteDescription,
	contactEmail: INWOLAG_CONTENT.contactEmail,
};
