/**
 * Service for handling About section data operations
 */
import { prisma as db } from "@/lib/prisma";
import { Service } from "@/lib/interfaces/service.interface";
import { 
  AboutSection, 
  TeamMember, 
  AboutSectionCreateInput, 
  TeamMemberCreateInput,
  AboutSectionUpdateInput,
  TeamMemberUpdateInput
} from "@/lib/interfaces/about.interface";

export class AboutSectionService implements Service<AboutSection, AboutSectionCreateInput, AboutSectionUpdateInput> {
  async getAll(filter?: Record<string, any>): Promise<AboutSection[]> {
    const where = filter || {};
    const sections = await db.aboutSection.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return sections as unknown as AboutSection[];
  }

  async getById(id: number): Promise<AboutSection | null> {
    const section = await db.aboutSection.findUnique({
      where: { id },
    });
    return section as unknown as AboutSection | null;
  }

  async create(data: AboutSectionCreateInput): Promise<AboutSection> {
    const section = await db.aboutSection.create({
      data,
    });
    return section as unknown as AboutSection;
  }

  async update(id: number, data: AboutSectionUpdateInput): Promise<AboutSection> {
    const section = await db.aboutSection.update({
      where: { id },
      data,
    });
    return section as unknown as AboutSection;
  }

  async delete(id: number): Promise<void> {
    await db.aboutSection.delete({
      where: { id },
    });
  }
}

export class TeamMemberService implements Service<TeamMember, TeamMemberCreateInput, TeamMemberUpdateInput> {
  async getAll(filter?: Record<string, any>): Promise<TeamMember[]> {
    const where = filter || {};
    const members = await db.teamMember.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return members as unknown as TeamMember[];
  }

  async getById(id: number): Promise<TeamMember | null> {
    const member = await db.teamMember.findUnique({
      where: { id },
    });
    return member as unknown as TeamMember | null;
  }

  async create(data: TeamMemberCreateInput): Promise<TeamMember> {
    const member = await db.teamMember.create({
      data,
    });
    return member as unknown as TeamMember;
  }

  async update(id: number, data: TeamMemberUpdateInput): Promise<TeamMember> {
    const member = await db.teamMember.update({
      where: { id },
      data,
    });
    return member as unknown as TeamMember;
  }

  async delete(id: number): Promise<void> {
    await db.teamMember.delete({
      where: { id },
    });
  }
}