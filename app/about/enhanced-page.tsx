"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  History,
  Heart,
  Target,
  Globe,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
  Sparkles,
  Lightbulb,
  Handshake
} from "lucide-react";

// Import our custom components
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { CountUp } from "@/components/animations/count-up";
import { HeroParallax } from "@/components/animations/hero-parallax";
import { ScaleIn } from "@/components/animations/scale-in";

// Types for the about page data
interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  order: number;
  active: boolean;
}

interface AboutSection {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  order: number;
  type: string;
  active: boolean;
}

interface AboutPageData {
  sections: AboutSection[];
  team: TeamMember[];
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mission");
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll animation for the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about");
        if (!response.ok) {
          throw new Error("Failed to fetch about data");
        }
        const responseData = await response.json();

        // Check if the data is in the expected format
        if (responseData.data) {
          setAboutData(responseData.data);
        } else {
          console.error("Unexpected data format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Helper function to get sections by type
  const getSectionsByType = (type: string) => {
    if (!aboutData?.sections) return [];
    return aboutData.sections.filter((section) => section.type === type);
  };

  // Get specific sections
  const missionSections = getSectionsByType("mission");
  const visionSections = getSectionsByType("vision");
  const historySections = getSectionsByType("history");
  const valuesSections = getSectionsByType("values");
  const impactSections = getSectionsByType("impact");

  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  );

  // Scroll to content function
  const scrollToContent = () => {
    const contentSection = document.getElementById('about-content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Enhanced Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <HeroParallax
            imageUrl="/placeholder.svg?height=1200&width=1920"
            alt="About INWOLAG"
            overlayColor="from-primary/90 to-primary/70"
          >
            <div className="text-center text-white max-w-5xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none py-2 px-4 text-sm">
                  Our Story
                </Badge>
              </motion.div>

              <div className="flex flex-col items-center">
                <AnimatedText
                  text="Empowering Communities"
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-center"
                />
                <AnimatedText
                  text="Worldwide"
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-center"
                />
              </div>


              <FadeIn
                direction="up"
                delay={0.5}
                className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
              >
                <p className="leading-relaxed font-light">
                  Discover our mission, vision, and the dedicated team working to create lasting positive change in communities around the globe.
                </p>
              </FadeIn>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-12"
              >
                <Button
                  onClick={scrollToContent}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/30 text-white hover:bg-white/20 backdrop-blur-sm group"
                >
                  Explore Our Story
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                </Button>
              </motion.div>
            </div>
          </HeroParallax>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="h-8 w-8 text-white/70" />
        </motion.div>
      </section>

      {/* Impact Stats with enhanced animations */}
      <section id="about-content" className="py-20 bg-gradient-to-b from-white to-muted/10">
        <div className="container">
          <div className="text-center mb-16">
            <ScaleIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our Impact</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
                Making a Difference
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Our work has touched the lives of thousands across the globe.
              </p>
            </ScaleIn>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: <Users className="h-6 w-6" />, value: 15000, label: "Women Empowered", color: "from-primary to-blue-600" },
              { icon: <Globe className="h-6 w-6" />, value: 25, label: "Countries Reached", color: "from-blue-500 to-indigo-600" },
              { icon: <Award className="h-6 w-6" />, value: 120, label: "Projects Completed", color: "from-secondary to-cyan-600" },
              { icon: <Heart className="h-6 w-6" />, value: 8500, label: "Donors Supporting", color: "from-blue-600 to-indigo-700" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-8 text-center border border-muted/10 transition-all duration-500 hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex justify-center mb-6">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <CountUp
                  end={stat.value}
                  className="text-4xl font-bold text-gradient"
                  duration={2.5}
                />
                <p className="mt-3 text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <Tabs
            defaultValue="mission"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="text-center mb-16">
              <FadeIn>
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">Our Purpose</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">
                  Mission & Vision
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Discover what drives us and the future we're working to create.
                </p>
              </FadeIn>
            </div>

            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16 p-1 bg-muted/20 rounded-full">
              <TabsTrigger
                value="mission"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full py-3 transition-all duration-300"
              >
                <Target className="mr-2 h-4 w-4" />
                Our Mission
              </TabsTrigger>
              <TabsTrigger
                value="vision"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full py-3 transition-all duration-300"
              >
                <Globe className="mr-2 h-4 w-4" />
                Our Vision
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mission" className="focus-visible:outline-none focus-visible:ring-0">
              {isLoading ? (
                renderSkeleton()
              ) : missionSections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <FadeIn direction="right">
                    <div>
                      <h2 className="text-3xl font-bold mb-6 text-gradient">
                        {missionSections[0].title}
                      </h2>
                      <div
                        className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: missionSections[0].content,
                        }}
                      />
                      <motion.div
                        className="mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link href="/programs">
                          <Button size="lg" className="group rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                            View Our Programs
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </FadeIn>

                  <FadeIn direction="left">
                    <motion.div
                      className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={
                          missionSections[0].image ||
                          "/placeholder.svg?height=450&width=600"
                        }
                        alt="Our mission"
                        fill
                        className="object-cover"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70" />
                    </motion.div>
                  </FadeIn>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Mission information not available.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="vision" className="focus-visible:outline-none focus-visible:ring-0">
              {isLoading ? (
                renderSkeleton()
              ) : visionSections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <FadeIn direction="right">
                    <motion.div
                      className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl md:order-first"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={
                          visionSections[0].image ||
                          "/placeholder.svg?height=450&width=600"
                        }
                        alt="Our vision"
                        fill
                        className="object-cover"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70" />
                    </motion.div>
                  </FadeIn>

                  <FadeIn direction="left">
                    <div>
                      <h2 className="text-3xl font-bold mb-6 text-gradient">
                        {visionSections[0].title}
                      </h2>
                      <div
                        className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: visionSections[0].content,
                        }}
                      />
                      <motion.div
                        className="mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link href="/volunteer">
                          <Button size="lg" className="group rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                            Join Our Cause
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </FadeIn>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Vision information not available.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Enhanced Values Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-40 left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">Our Principles</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                The fundamental principles that guide our mission and shape our approach to creating positive change.
              </p>
            </FadeIn>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 w-16 bg-gray-200 rounded-full mb-4 mx-auto"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : valuesSections.length > 0 ? (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-10" staggerDelay={0.15}>
              {valuesSections.map((value, index) => (
                <StaggerItem key={value.id}>
                  <motion.div
                    className="bg-white rounded-2xl p-10 text-center border border-muted/10 transition-all duration-500 shadow-md hover:shadow-xl hover:border-primary/20"
                    whileHover={{ y: -15, backgroundColor: "hsl(var(--primary) / 0.05)" }}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-primary to-blue-600 text-white h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {index === 0 ? (
                        <Heart className="h-10 w-10" />
                      ) : index === 1 ? (
                        <Handshake className="h-10 w-10" />
                      ) : (
                        <Lightbulb className="h-10 w-10" />
                      )}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-gradient">{value.title}</h3>
                    <div
                      className="prose max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: value.content }}
                    />
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Values information not available.</p>
            </div>
          )}
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Enhanced History Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">Our Journey</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">Our History</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                The journey that brought us to where we are today.
              </p>
            </FadeIn>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : historySections.length > 0 ? (
            <div className="space-y-24">
              {historySections.map((section, index) => (
                <FadeIn
                  key={section.id}
                  direction={index % 2 === 0 ? "right" : "left"}
                  delay={index * 0.1}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className={index % 2 === 0 ? "" : "md:order-last"}>
                      <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-br from-primary to-primary/80 text-white h-16 w-16 rounded-full flex items-center justify-center mr-6 shadow-lg">
                          <History className="h-8 w-8" />
                        </div>
                        <h3 className="text-3xl font-bold text-gradient">{section.title}</h3>
                      </div>

                      {section.subtitle && (
                        <p className="text-primary font-medium text-lg mb-6">
                          {section.subtitle}
                        </p>
                      )}

                      <div
                        className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>

                    <motion.div
                      className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={
                          section.image ||
                          `/placeholder.svg?height=400&width=600&text=History+${index + 1}`
                        }
                        alt={section.title}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-70" />
                    </motion.div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                History information not available.
              </p>
            </div>
          )}
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-4">Our Leadership</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient mb-6">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                The dedicated professionals working together to create positive change around the world.
              </p>
            </FadeIn>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : aboutData?.team && aboutData.team.length > 0 ? (
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
              {aboutData.team.map((member, index) => (
                <StaggerItem key={member.id}>
                  <motion.div
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-muted/10 transition-all duration-500 group hover:border-primary/20"
                    whileHover={{ y: -15, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                  >
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={
                          member.image ||
                          `/placeholder.svg?height=320&width=320&text=${member.name}`
                        }
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay gradient that appears on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/30 opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

                      {/* Position badge that appears on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block bg-white/90 text-primary font-medium px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                          {member.position}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-2 text-gradient">{member.name}</h3>
                      <p className="text-primary mb-4 font-medium">{member.position}</p>
                      <p className="text-muted-foreground line-clamp-3 mb-6">{member.bio}</p>

                      {member.socialLinks && (
                        <div className="flex mt-4 space-x-4">
                          {member.socialLinks.twitter && (
                            <motion.a
                              href={member.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-full transition-colors"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Twitter className="h-4 w-4" />
                            </motion.a>
                          )}
                          {member.socialLinks.linkedin && (
                            <motion.a
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-full transition-colors"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Linkedin className="h-4 w-4" />
                            </motion.a>
                          )}
                          {member.socialLinks.instagram && (
                            <motion.a
                              href={member.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-full transition-colors"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Instagram className="h-4 w-4" />
                            </motion.a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Team information not available.</p>
            </div>
          )}
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-40 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            className="rounded-3xl bg-gradient-to-r from-primary/90 to-primary/70 p-12 md:p-16 text-white text-center relative overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
                animate={{
                  x: [0, 30, 0],
                  y: [0, 20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 15,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
                animate={{
                  x: [0, -40, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 18,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="relative z-10">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="max-w-2xl mx-auto mb-10 text-white/90 text-lg">
                  There are many ways to get involved and support our work to empower women worldwide.
                </p>
              </FadeIn>

              <div className="flex flex-wrap justify-center gap-6">
                <FadeIn delay={0.3}>
                  <Link href="/volunteer">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/20 rounded-full group"
                    >
                      Volunteer With Us
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <Link href="/donate">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      Make a Donation
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </FadeIn>

                <FadeIn delay={0.5}>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/20 rounded-full group"
                    >
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </FadeIn>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}