// filepath: /home/notcool/Desktop/ngo-cms/pages/api/programs/[id]/gallery.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Images are required" });
    }

    try {
      const createdImages = await prisma.programImage.createMany({
        data: images.map((imageUrl: string) => ({
          programId: id as string,
          imageUrl,
        })),
      });

      return res.status(201).json({ message: "Gallery images added", createdImages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to add gallery images" });
    }
  }

  if (req.method === "GET") {
    try {
      const galleryImages = await prisma.programImage.findMany({
        where: { programId: id as string },
      });

      return res.status(200).json(galleryImages);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}