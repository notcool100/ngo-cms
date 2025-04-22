"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  History, 
  Heart, 
  Target, 
  Award, 
  Globe, 
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

// Import our custom components
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { CountUp } from "@/components/animations/count-up";

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

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about");
        if (!response.ok) {
          throw new Error("Failed to fetch about data");
        }
        const data = await response.json();
        setAboutData(data);
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

  return (
    <div className="flex flex-col">
      {/* Hero Section with Parallax */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <ParallaxScroll speed={0.3} className="relative h-[50vh] md:h-[60vh] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="About Empower Together"
            fill
            className="object-cover"
            priority
          />
        </ParallaxScroll>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                Our Story
              </Badge>
            </motion.div>
            
            <AnimatedText
              text="About Empower Together"
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            />
            
            <FadeIn
              direction="up"
              delay={0.5}
              className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
            >
              <p className="leading-relaxed">
                Learn about our mission, vision, and the dedicated team working to empower women worldwide.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: <Users className="h-6 w-6" />, value: 15000, label: "Women Empowered" },
              { icon: <Globe className="h-6 w-6" />, value: 25, label: "Countries Reached" },
              { icon: <Award className="h-6 w-6" />, value: 120, label: "Projects Completed" },
              { icon: <Heart className="h-6 w-6" />, value: 8500, label: "Donors Supporting" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm p-8 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300 card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <CountUp
                  end={stat.value}
                  className="text-3xl font-bold text-primary"
                  duration={2.5}
                />
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <Tabs 
            defaultValue="mission" 
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="text-center mb-8">
              <FadeIn>
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our Purpose</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                  Mission & Vision
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover what drives us and the future we're working to create.
                </p>
              </FadeIn>
            </div>
            
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="mission" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Target className="mr-2 h-4 w-4" />
                Our Mission
              </TabsTrigger>
              <TabsTrigger value="vision" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Globe className="mr-2 h-4 w-4" />
                Our Vision
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="mission">
              {isLoading ? (
                renderSkeleton()
              ) : missionSections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <FadeIn direction="right">
                    <div>
                      <h2 className="text-3xl font-bold mb-6 text-gradient">
                        {missionSections[0].title}
                      </h2>
                      <div
                        className="prose max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: missionSections[0].content,
                        }}
                      />
                      <motion.div 
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link href="/programs">
                          <Button className="group">
                            View Our Programs
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </FadeIn>
                  
                  <FadeIn direction="left">
                    <motion.div 
                      className="relative h-[400px] rounded-xl overflow-hidden shadow-lg"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={
                          missionSections[0].image ||
                          "/placeholder.svg?height=400&width=600"
                        }
                        alt="Our mission"
                        fill
                        className="object-cover"
                      />
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
            
            <TabsContent value="vision">
              {isLoading ? (
                renderSkeleton()
              ) : visionSections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <FadeIn direction="right">
                    <motion.div 
                      className="relative h-[400px] rounded-xl overflow-hidden shadow-lg md:order-first"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={
                          visionSections[0].image ||
                          "/placeholder.svg?height=400&width=600"
                        }
                        alt="Our vision"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </FadeIn>
                  
                  <FadeIn direction="left">
                    <div>
                      <h2 className="text-3xl font-bold mb-6 text-gradient">
                        {visionSections[0].title}
                      </h2>
                      <div
                        className="prose max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: visionSections[0].content,
                        }}
                      />
                      <motion.div 
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link href="/volunteer">
                          <Button className="group">
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

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our Principles</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide our work and decision-making every day.
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
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.1}>
              {valuesSections.map((value, index) => (
                <StaggerItem key={value.id}>
                  <motion.div
                    className="bg-white rounded-xl p-8 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
                    whileHover={{ y: -10 }}
                  >
                    <motion.div 
                      className="bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                      whileHover={{ color: "white" }}
                    >
                      {index === 0 ? (
                        <Heart className="h-8 w-8" />
                      ) : index === 1 ? (
                        <Users className="h-8 w-8" />
                      ) : (
                        <Award className="h-8 w-8" />
                      )}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
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
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our Journey</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">Our History</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
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
            <div className="space-y-16">
              {historySections.map((section, index) => (
                <FadeIn 
                  key={section.id} 
                  direction={index % 2 === 0 ? "right" : "left"}
                  delay={index * 0.1}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className={index % 2 === 0 ? "" : "md:order-last"}>
                      <div className="flex items-center mb-6">
                        <div className="bg-primary/10 text-primary h-12 w-12 rounded-full flex items-center justify-center mr-4">
                          <History className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gradient">{section.title}</h3>
                      </div>
                      
                      {section.subtitle && (
                        <p className="text-primary font-medium mb-4">
                          {section.subtitle}
                        </p>
                      )}
                      
                      <div
                        className="prose max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                    
                    <motion.div 
                      className="relative h-[350px] rounded-xl overflow-hidden shadow-lg"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={
                          section.image ||
                          `/placeholder.svg?height=350&width=500&text=History+${index + 1}`
                        }
                        alt={section.title}
                        fill
                        className="object-cover"
                      />
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
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our People</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The dedicated individuals working together to fulfill our mission.
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
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
              {aboutData.team.map((member, index) => (
                <StaggerItem key={member.id}>
                  <motion.div
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-muted/20 hover:border-primary/20 transition-all duration-300"
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={
                          member.image ||
                          `/placeholder.svg?height=300&width=300&text=${member.name}`
                        }
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary mb-4 font-medium">{member.position}</p>
                      <p className="text-muted-foreground line-clamp-3">{member.bio}</p>

                      {member.socialLinks && (
                        <div className="flex mt-4 space-x-3">
                          {member.socialLinks.twitter && (
                            <motion.a
                              href={member.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              whileHover={{ scale: 1.2 }}
                            >
                              <Twitter className="h-5 w-5" />
                            </motion.a>
                          )}
                          {member.socialLinks.linkedin && (
                            <motion.a
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              whileHover={{ scale: 1.2 }}
                            >
                              <Linkedin className="h-5 w-5" />
                            </motion.a>
                          )}
                          {member.socialLinks.instagram && (
                            <motion.a
                              href={member.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              whileHover={{ scale: 1.2 }}
                            >
                              <Instagram className="h-5 w-5" />
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
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 md:p-12 text-white text-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Mission</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="max-w-2xl mx-auto mb-8 text-white/90">
                There are many ways to get involved and support our work to empower women worldwide.
              </p>
            </FadeIn>
            
            <div className="flex flex-wrap justify-center gap-4">
              <FadeIn delay={0.3}>
                <Link href="/volunteer">
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    Volunteer With Us
                  </Button>
                </Link>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <Link href="/donate">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Make a Donation
                  </Button>
                </Link>
              </FadeIn>
              
              <FadeIn delay={0.5}>
                <Link href="/contact">
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    Contact Us
                  </Button>
                </Link>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}