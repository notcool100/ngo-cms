/**
 * Interfaces for About section data models
 */

export interface AboutSection {
  id: number;
  title: string;
  subtitle?: string | null;
  content: string;
  image?: string | null;
  order: number;
  type: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image?: string | null;
  socialLinks?: Record<string, string> | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutSectionCreateInput {
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  order: number;
  type: string;
  active?: boolean;
}

export interface TeamMemberCreateInput {
  name: string;
  position: string;
  bio: string;
  image?: string;
  socialLinks?: Record<string, string>;
  order: number;
  active?: boolean;
}

export interface AboutSectionUpdateInput extends Partial<AboutSectionCreateInput> {
  id: number;
}

export interface TeamMemberUpdateInput extends Partial<TeamMemberCreateInput> {
  id: number;
}