# INWOLAG - Women's Empowerment NGO Website

A modern, responsive CMS website for a women's empowerment NGO built with Next.js, React, and Prisma.

![INWOLAG](https://placeholder.svg?height=400&width=800&text=Empower+Together)

## Overview

INWOLAG is a full-featured website for a women's empowerment NGO that includes both public-facing pages and an administrative backend. The platform enables the organization to manage content, events, donations, volunteers, and communications through an intuitive interface.

## Features test

### Public-Facing Website
- **Home Page**: Dynamic hero section, mission statement, impact statistics, featured programs, and upcoming events
- **About Us Page**: Organization history, mission, vision, and team information
- **Programs Page**: Browsable catalog of programs and initiatives with filtering by category
- **Program Details**: In-depth information about specific programs
- **Events Page**: Calendar of upcoming events with registration functionality
- **Volunteer Page**: Information about volunteering opportunities with application form
- **Donation Page**: Secure donation processing with multiple payment options
- **Contact Page**: Contact form, location information, and FAQ section

### Admin Dashboard
- **Content Management**: Create, edit, and publish programs and blog posts
- **Category Management**: Organize programs into categories
- **Event Management**: Create and manage events, track registrations
- **Donation Tracking**: Monitor and manage donations
- **Volunteer Management**: Review and process volunteer applications
- **User Management**: Admin user accounts with role-based permissions
- **Message Center**: Manage contact form submissions
- **Analytics Dashboard**: Overview of key metrics and activities

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth and credentials provider
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Form Validation**: Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ngo-website.git
   cd ngo-website
2. Install dependencies:
   ```bash
   npm install
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
5. Start the development server:
   ```bash
   npm run dev
6. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables
The following environment variables are required:
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ngo_website"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# OAuth providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: Payment processing (for a real implementation)
# STRIPE_SECRET_KEY="your-stripe-secret-key"
# STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

### Project Structure
ngo-website/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── donate/             # Donation page
│   ├── events/             # Events pages
│   ├── programs/           # Programs pages
│   ├── volunteer/          # Volunteer page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── animations/         # Animation components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── footer.tsx          # Footer component
│   └── header.tsx          # Header component
├── lib/                    # Utility functions and shared code
│   ├── auth.ts             # Authentication configuration
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
├── .env.example            # Example environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration

### Development Workflow
## Database Management
- **View Database**: Use Prisma Studio to view and edit your database:
  ```bash
  npx prisma studio
- **Update Schema**: After changing the schema in `prisma/schema.prisma`:
  ```bash
  npx prisma migrate dev --name describe_your_changes
  
## Adding New Features
1. Create new components in the `components/` directory
2. Add new pages in the `app/` directory
3. Create API routes in the `app/api/` directory
4. Update the database schema in `prisma/schema.prisma` as needed

## Deployment
The application is configured for easy deployment on Vercel:
1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy
   
For other platforms, build the application using:
```bash
npm run build
# or
yarn build
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request
