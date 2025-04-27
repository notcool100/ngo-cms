"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  Heart,
  Users,
  ChevronRight,
  Star,
  MapPin,
  Sparkles,
  BookOpen,
  GraduationCap,
  Globe,
} from "lucide-react";

// Import our custom components
import { HeroParallax } from "@/components/animations/hero-parallax";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ScaleIn } from "@/components/animations/scale-in";
import { CountUp } from "@/components/animations/count-up";
import { ProgramCard } from "@/components/program-card";
import { EventCard } from "@/components/event-card";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const [featuredPrograms, setFeaturedPrograms] = useState<
    Array<{
      id: string;
      title: string;
      slug: string;
      description: string;
      image?: string;
      name: string;
      content: string;
    }>
  >([]);

  const [upcomingEvents, setUpcomingEvents] = useState<
    Array<{
      id: string;
      title: string;
      slug: string;
      description: string;
      startDate: string;
      endDate?: string;
      location?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch featured programs
    fetch("/api/programs?featured=true&limit=3&active=true")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedPrograms(data);
      })
      .catch((err) => {
        console.error("Error fetching featured programs:", err);
        setFeaturedPrograms([]);
      });

    // Fetch upcoming events
    fetch("/api/events?upcoming=true&limit=2")
      .then((res) => res.json())
      .then((data) => {
        setUpcomingEvents(data.events);
      })
      .catch((err) => {
        console.error("Error fetching upcoming events:", err);
        setUpcomingEvents([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      } else {
        throw new Error("Failed to subscribe");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Enhanced Parallax Effect */}
      <HeroParallax
        imageUrl="/placeholder.svg?height=1200&width=1920"
        alt="Women empowerment"
        overlayColor="from-primary/90 to-primary/70"
      >
        <div className="text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
              Empowering Since 2010
            </Badge>
          </motion.div>

          <AnimatedText
            text="Empowering Women, Transforming Communities"
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          />

          <FadeIn
            direction="up"
            delay={0.5}
            className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
          >
            <p className="leading-relaxed">
              Join our mission to create a world where every woman has the
              opportunity to thrive, lead, and inspire positive change.
            </p>
          </FadeIn>

          <FadeIn
            direction="up"
            delay={0.7}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {/* <Link href="/donate">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-medium px-8 rounded-full shadow-lg gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Donate Now
                </Button>
              </motion.div>
            </Link> */}
            <Link href="/programs">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-medium px-8 rounded-full"
                >
                  Our Programs
                </Button>
              </motion.div>
            </Link>
          </FadeIn>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              delay: 1.5,
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <ChevronRight size={30} className="rotate-90 text-white/70" />
          </motion.div>
        </div>
      </HeroParallax>

      {/* Mission Statement with Enhanced Design */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <FadeIn>
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                  Our Mission
                </Badge>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
                  Creating a world of equal opportunities
                </h2>
              </FadeIn>
              <FadeIn
                direction="up"
                delay={0.4}
                className="text-lg text-muted-foreground"
              >
                <p className="leading-relaxed mb-6">
                  Empower Together is dedicated to advancing women's rights,
                  promoting gender equality, and creating opportunities for women
                  to achieve their full potential through education, economic
                  empowerment, and leadership development.
                </p>
                <p className="leading-relaxed">
                  We believe that when women are empowered, entire communities thrive.
                  Our programs focus on providing resources, education, and support
                  to help women overcome barriers and reach their full potential.
                </p>
              </FadeIn>
              
              <FadeIn direction="up" delay={0.6}>
                <div className="mt-8 flex flex-wrap gap-4">
                  {[
                    { icon: <BookOpen className="h-5 w-5" />, text: "Education" },
                    { icon: <Sparkles className="h-5 w-5" />, text: "Empowerment" },
                    { icon: <GraduationCap className="h-5 w-5" />, text: "Leadership" },
                    { icon: <Globe className="h-5 w-5" />, text: "Community" },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full"
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            
            <div className="order-1 md:order-2">
              <ScaleIn delay={0.2}>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full animate-float-slow" />
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="Women in a community meeting"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="text-white text-sm font-medium bg-primary/80 px-3 py-1 rounded-full">
                        Since 2010
                      </span>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats with Enhanced Animated Counters */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-24 relative overflow-hidden">
        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Our Impact
              </Badge>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient">
                Making a Difference
              </h2>
            </FadeIn>
            <FadeIn
              direction="up"
              delay={0.4}
              className="mx-auto mt-6 max-w-[700px] text-muted-foreground"
            >
              <p className="leading-relaxed">
                For over a decade, we've been working to create positive change in communities around the world.
                Here's the impact we've made so far.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { value: 5000, label: "Women Empowered", suffix: "+" },
              { value: 120, label: "Communities Served", suffix: "+" },
              { value: 50, label: "Active Programs", suffix: "+" },
              { value: 15, label: "Years of Impact", suffix: "+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm p-8 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300 card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  className="text-4xl font-bold text-primary"
                  duration={2.5}
                />
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs with Enhanced Cards */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-muted/20 to-transparent" />

        <div className="container relative z-10">
          <div className="mb-16 text-center">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Our Programs
              </Badge>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient">
                Featured Initiatives
              </h2>
            </FadeIn>
            <FadeIn
              direction="up"
              delay={0.4}
              className="mx-auto mt-6 max-w-[700px] text-muted-foreground"
            >
              <p className="leading-relaxed">
                Discover our key programs that are making a difference in the
                lives of women around the world.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? // Skeleton loaders
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20">
                      <div className="h-52 bg-muted animate-pulse" />
                      <div className="p-6 space-y-4">
                        <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                        <div className="h-10 w-1/3 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
              : featuredPrograms.length > 0
                ? featuredPrograms.map((program, index) => (
                    <ProgramCard
                      key={program.id || index}
                      id={program.id}
                      title={program.title}
                      slug={program.slug}
                      description={program.description}
                      content={program.content}
                      image={program.image}
                      isFeatured={true}
                    />
                  ))
                : // Fallback content if no programs are found
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <ProgramCard
                        key={`sample-${index}`}
                        id={`sample-${index}`}
                        title={`Program ${index + 1}`}
                        slug={`sample-${index + 1}`}
                        description="Sample program description"
                        content="This is a sample program description. In a real implementation, this would contain actual program content."
                        image={`/placeholder.svg?height=400&width=600&text=Program+${index + 1}`}
                        isFeatured={true}
                      />
                    ))}
          </div>

          <FadeIn direction="up" delay={0.6} className="mt-12 text-center">
            <Link href="/programs">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 gap-2"
                >
                  View All Programs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Upcoming Events with Enhanced Design */}
      <section className="bg-gradient-to-b from-muted/40 to-muted/10 py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container relative z-10">
          <div className="mb-16 text-center">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Events
              </Badge>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient">
                Upcoming Events
              </h2>
            </FadeIn>
            <FadeIn
              direction="up"
              delay={0.4}
              className="mx-auto mt-6 max-w-[700px] text-muted-foreground"
            >
              <p className="leading-relaxed">
                Join us at our upcoming events to learn, connect, and make a
                difference in your community.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {isLoading ? (
              // Skeleton loaders
              Array(2)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20">
                    <div className="p-6 space-y-4">
                      <div className="h-5 w-1/3 bg-muted rounded animate-pulse"></div>
                      <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                      <div className="h-10 w-1/3 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <EventCard
                  key={event.id || index}
                  id={event.id}
                  title={event.title}
                  slug={event.slug}
                  description={event.description}
                  startDate={event.startDate}
                  endDate={event.endDate}
                  location={event.location}
                />
              ))
            ) : (
              // Fallback content if no events are found
              <>
                <EventCard
                  id="sample-1"
                  title="Women in Tech Conference"
                  slug="women-in-tech"
                  description="Join us for a day of inspiring talks, workshops, and networking opportunities focused on advancing women in technology fields."
                  startDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
                  location="Virtual Event"
                />
                <EventCard
                  id="sample-2"
                  title="Fundraising Gala Dinner"
                  slug="gala-dinner"
                  description="An elegant evening of dining, entertainment, and fundraising to support our educational scholarship program for girls in underserved communities."
                  startDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()}
                  location="Grand Hotel, New York"
                />
              </>
            )}
          </div>

          <FadeIn direction="up" delay={0.6} className="mt-12 text-center">
            <Link href="/events">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 gap-2"
                >
                  View All Events
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Get Involved with Enhanced Design */}
      <section className="py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="mb-16 text-center">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Get Involved
              </Badge>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient">
                Join Our Cause
              </h2>
            </FadeIn>
            <FadeIn
              direction="up"
              delay={0.4}
              className="mx-auto mt-6 max-w-[700px] text-muted-foreground"
            >
              <p className="leading-relaxed">
                There are many ways you can contribute to our mission and make a
                difference in the lives of women around the world.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-black">  
            {[
              // {
              //   icon: <Heart className="h-10 w-10" />,
              //   title: "Donate",
              //   description: "Your financial support helps us expand our programs and reach more women in need. Every contribution makes a difference.",
              //   cta: "Donate Now",
              //   href: "/donate"
              // },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Volunteer",
                description: "Share your time and skills to support our programs and make a direct impact in your community and beyond.",
                cta: "Become a Volunteer",
                href: "/volunteer"
              },
              {
                icon: <Calendar className="h-10 w-10" />,
                title: "Partner With Us",
                description: "Collaborate with us to create meaningful partnerships that advance our shared goals and amplify our impact.",
                cta: "Become a Partner",
                href: "/partner"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 text-center shadow-sm border border-muted/20 h-full flex flex-col items-center card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6"
                  whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                  whileHover={{ color: "white" }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {item.description}
                </p>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="rounded-full px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                      {item.cta}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter with Enhanced Design - Removed as it's now in the footer */}
    </div>
  );
}