import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	boolean,
	json,
	varchar,
} from "drizzle-orm/pg-core";

// Existing tables...

// About Us Schema
export const aboutUs = pgTable("about_us", {
	id: serial("id").primaryKey(),
	mission: text("mission").notNull(),
	vision: text("vision").notNull(),
	history: text("history").notNull(),
	values: json("values").notNull(),
	team: json("team").notNull(),
	impact: json("impact").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// About Us Section Schema (for more granular control)
export const aboutSections = pgTable("about_sections", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	subtitle: varchar("subtitle", { length: 255 }),
	content: text("content").notNull(),
	image: varchar("image", { length: 255 }),
	order: integer("order").notNull(),
	type: varchar("type", { length: 50 }).notNull(), // mission, vision, history, team, etc.
	active: boolean("active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team Members Schema
export const teamMembers = pgTable("team_members", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	position: varchar("position", { length: 255 }).notNull(),
	bio: text("bio").notNull(),
	image: varchar("image", { length: 255 }),
	socialLinks: json("social_links"),
	order: integer("order").notNull(),
	active: boolean("active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
