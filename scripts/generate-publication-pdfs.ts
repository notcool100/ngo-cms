import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const publications = [
  {
    title: "Exploring Sustainability in Trophy Hunting Practices at Dhorpatan Hunting Reserve (DHR), Nepal: A Balancing Act? (2024)",
    description: "Assesses the sustainability of DHR by analyzing socioeconomic, cultural, and ecological effects on Indigenous Peoples and Local Communities (IPLCs). It highlights income disparities and tensions between conservation policies and traditional rights.",
    author: "Adv. Indira Kumari Shreesh (Coordinating Principal Investigator)",
    keywords: "Cultural, Dalits, DHR, Ecological, IPLCs, Naur, Socioeconomic, Trophy hunting"
  },
  {
    title: "Assessing Socio-Economic, Education, and Perceptions of IPLCs in and around Dhorpatan Hunting Reserve, Nepal (Sept 2024)",
    description: "Examines the socioeconomic conditions and conservation perceptions of communities in DHR, focusing on the decline of traditional livelihoods like sheep farming.",
    author: "Dr. Kamal Thapa (Conservation Scientist)",
    keywords: "Community-based Conservation, Conservation Governance, IPLCs, Socioeconomic Inequality"
  },
  {
    title: "Assessing Gender Impacts of Proposed Iron Mining in Jhumlawang, East Rukum: A Technical Survey (May 2025)",
    description: "Explores the gendered impacts of proposed mining on Magar and Dalit women, highlighting their dependence on agropastoral livelihoods and risks of environmental degradation.",
    author: "Adv. Indira Kumari Shreesh and Dr. Kamal Thapa",
    keywords: "Iron Mining, Gendered Impacts, Alternative Livelihoods, Resource Governance, Extractive Industries"
  },
  {
    title: "Perception of Indigenous Bote and Tharus on Existing Conservation Approaches (2024)",
    description: "A field-based study in Chitwan National Park assessing how local conservation measures affect the rights and livelihoods of Bote and Tharu communities.",
    author: "Dr. Kamal Thapa, Adv. Indira Kumari Shreesh, Adv. Mon Kumari Rai",
    keywords: "Bote, Chitwan, Indigenous rights, National Park, Rhino, Tharu, Tiger, Women"
  },
  {
    title: "Perceptions of Indigenous Majhi Communities toward Conservation Practices in Sunsari (2024)",
    description: "Focuses on the Majhi community in the Koshi Tappu Wildlife Reserve, exploring human-wildlife conflict and benefit-sharing mechanisms.",
    author: "Dr. Kamal Thapa, Adv. Indira Kumari Shreesh, Adv. Kaushila Rai, Adv. Uma Tamang",
    keywords: "Majhi Community, Wildlife Reserve, Human-wildlife Conflict, Participatory Resource Management"
  },
  {
    title: "Testimonies of Tanahu Hydropower affected Magar Indigenous Women (Jan 2025)",
    description: "Documents the lived experiences and spiritual connection to ancestral lands for Magar women affected by the Tanahu Hydropower Project.",
    author: "Adv. Ritu Thapa",
    keywords: "Right to Self-Determination, Lived Experiences, Resilience, Traditional Livelihoods"
  },
  {
    title: "Women & Rivers (Beyond Borders) (May 2025)",
    description: "Explores the central role of rivers in indigenous civilizations and the challenges posed by large-scale development and climate change.",
    author: "INWOLAG Research Team",
    keywords: "Gender and Water, Indigenous Knowledge, Riverine Communities, Water Security"
  },
  {
    title: "Beyond the Dam: Intangible Loss and Damage to the Magar Indigenous Communities (June 2025)",
    description: "A desk and field analysis focusing on the intangible cultural and emotional losses suffered by communities due to displacement.",
    author: "INWOLAG Field Team",
    keywords: "Loss and Damage, Intangible Losses, Indigenous Rights Protection, Cultural Asset"
  },
  {
    title: "Baseline Study on Access to Justice for Indigenous Women and Girls in Nepal (2021)",
    description: "A foundational report identifying barriers to legal recourse for indigenous women and providing data for rights-based policymaking.",
    author: "Adv. Indira Kumari Shreesh, Adv. Mon Kumari Rai, Adv. Uma Tamang",
    keywords: "Access to Justice, Indigenous Women, Legal Aid"
  },
  {
    title: "Baseline Report for Addressing Collective Land in Relation to Land-for-Land Compensation (2025)",
    description: "Analyzes the legal basis for community land claims and advocates for intersectional justice in compensation schemes.",
    author: "Nanda Kandangwa",
    keywords: "Social Justice, Feminist Advocacy, Access to Justice, Collective Land"
  },
  {
    title: "Aspiration and Realities to Imagine Violence Free Lives for Indigenous Women and Women with Disabilities (Nov 2021)",
    description: "An intersectional study on the risks and challenges faced by indigenous women with disabilities in Nepal.",
    author: "Sushila Kumari Thapa Magar",
    keywords: "Intersectional violence, Indigenous Women with Disabilities, Gender discrimination"
  },
  {
    title: "Impact Studies (2019-2020)",
    description: "Titles: Impacts of Covid-19 (2020) and Impacts of Climate Change (2019) on Indigenous Women and Girls.",
    author: "Sushila Kumari Thapa Magar",
    keywords: "COVID-19 Impacts, Climate Crisis, Gendered Vulnerability"
  },
  {
    title: "Indigenous and Local Knowledge Systems for Disaster Risk Reduction (2024)",
    description: "Lessons from Tharu and Musahar communities on using traditional knowledge to combat environmental disasters.",
    author: "Dr. Kamal Thapa and Adv. Indira Kumari Shreesh",
    keywords: "Traditional Knowledge, DRR, Tharu, Musahar"
  },
  {
    title: "Is Nepal's Protected Area System Recognize the Indigenous Peoples and Indigenous Women? (2025)",
    description: "A policy analysis of the National Parks and Wildlife Conservation Act, documenting discrepancies between law and indigenous rights implementation.",
    author: "Policy Research Team",
    keywords: "Policy Analysis, Protected Areas, NPWCA, Wildlife Legislation"
  }
];

const outputDir = path.join(process.cwd(), 'public', 'uploads', 'publications');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

publications.forEach((pub, index) => {
  const fileName = pub.title.substring(0, 50).replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
  const filePath = path.join(outputDir, fileName);
  
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text('INWOLAG', { align: 'center' });
  doc.fontSize(12).text('Indigenous Women Legal Awareness Group', { align: 'center' });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Content
  doc.fontSize(16).fillColor('#1e40af').text(pub.title);
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('black').text(`Author: ${pub.author}`, { oblique: true });
  doc.moveDown();
  
  doc.fontSize(14).text('Description:');
  doc.fontSize(12).text(pub.description, { align: 'justify' });
  doc.moveDown();

  doc.fontSize(14).text('Keywords:');
  doc.fontSize(12).text(pub.keywords);

  // Footer
  doc.fontSize(10).fillColor('gray').text('This is an auto-generated publication for demonstration purposes.', 50, 700, { align: 'center' });
  doc.text('Visit www.inwolag.org.np for more information.', { align: 'center' });

  doc.end();
  console.log(`Generated: ${fileName}`);
});
