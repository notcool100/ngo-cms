"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  Search, 
  BookOpen, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Globe,
  Filter,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { CountUp } from "@/components/animations/count-up";

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  name: string;
  content: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  description: string;
  id: string;
  name: string;
  slug: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const [programsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/programs"),
          fetch("/api/program-categories"),
        ]);

        if (!programsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const programsData = await programsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setPrograms(programsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    // Filter programs based on active category and search query
    let filtered = [...programs];
    
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (program) => program.category.slug === activeCategory
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (program) =>
          program.title.toLowerCase().includes(query) ||
          program.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredPrograms(filtered);
  }, [programs, activeCategory, searchQuery]);

  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("education")) return <GraduationCap className="h-5 w-5" />;
    if (name.includes("economic")) return <Briefcase className="h-5 w-5" />;
    if (name.includes("leadership")) return <Users className="h-5 w-5" />;
    if (name.includes("health")) return <Heart className="h-5 w-5" />;
    if (name.includes("global")) return <Globe className="h-5 w-5" />;
    return <BookOpen className="h-5 w-5" />;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Parallax */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <ParallaxScroll speed={0.3} className="relative h-[50vh] md:h-[60vh] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Our Programs"
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
                Explore Our Work
              </Badge>
            </motion.div>
            
           <div className="flex justify-center">
            <AnimatedText
            text="Our Programs"
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-center"
            
            />

           </div>
            
            <FadeIn
              direction="up"
              delay={0.5}
              className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
            >
              <p className="leading-relaxed">
                Discover the initiatives that are empowering women and transforming communities around the world.
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
              { icon: <GraduationCap className="h-6 w-6" />, value: 5000, label: "Women Educated" },
              { icon: <Briefcase className="h-6 w-6" />, value: 2500, label: "Businesses Started" },
              { icon: <Users className="h-6 w-6" />, value: 1200, label: "Leaders Trained" },
              { icon: <Globe className="h-6 w-6" />, value: 25, label: "Countries Reached" },
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

      {/* Programs Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our Initiatives</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                Explore Our Programs
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the various ways we're working to empower women and transform communities.
              </p>
            </FadeIn>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search programs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              
              <Tabs 
                value={activeCategory} 
                onValueChange={setActiveCategory}
                className="w-full md:w-auto"
              >
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="all" className="text-xs md:text-sm">
                    All Programs
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.slug}
                      className="text-xs md:text-sm"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 border border-gray-200 border-t-0 rounded-b-lg">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPrograms.length > 0 ? (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {filteredPrograms.map((program) => (
                <StaggerItem key={program.id}>
                  <Link href={`/programs/${program.slug}`}>
                    <Card className="overflow-hidden h-full border-muted/30 hover:border-primary/30 transition-all duration-300 group">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={program.image || "/placeholder.svg?height=300&width=500"}
                          alt={program.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary text-white">
                          {program.category.name}
                        </Badge>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors duration-300">
                          {program.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">
                          {program.description}
                        </p>
                      </CardContent>
                      
                      <CardFooter>
                        <Button variant="ghost" className="p-0 h-auto group-hover:text-primary">
                          Learn More
                          <motion.div
                            className="inline-block ml-2"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <div className="text-center py-12 bg-muted/10 rounded-lg">
              <FadeIn>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No programs found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any programs matching your search criteria.
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}>
                  Clear Filters
                </Button>
              </FadeIn>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Program Categories</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                Our Focus Areas
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn more about the key areas where we focus our efforts to create lasting change.
              </p>
            </FadeIn>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <FadeIn key={category.id} delay={index * 0.1}>
                  <motion.div
                    className="relative h-64 rounded-xl overflow-hidden group"
                    whileHover={{ y: -5 }}
                  >
                    <Image
                      src={`/placeholder.svg?height=300&width=500&text=${category.name}`}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <div className="flex items-center mb-3">
                        <div className="bg-primary/20 p-2 rounded-full mr-3">
                          {getCategoryIcon(category.name)}
                        </div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>
                      
                      <p className="text-white/80 line-clamp-2 mb-4">
                        {category.description}
                      </p>
                      
                      <Link href={`/programs?category=${category.slug}`}>
                        <Button 
                          variant="outline" 
                          className="w-full border-white/30 text-black hover:bg-white/20 group-hover:border-white/60"
                        >
                          View Programs
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Categories not available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 md:p-12 text-white text-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Involved</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="max-w-2xl mx-auto mb-8 text-white/90">
                There are many ways to support our programs and help us create lasting change for women worldwide.
              </p>
            </FadeIn>
            
            <div className="flex flex-wrap justify-center gap-4">
              <FadeIn delay={0.3}>
                <Link href="/volunteer">
                  <Button variant="outline" className="border-white text-black hover:bg-white/20">
                    Volunteer With Us
                  </Button>
                </Link>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <Link href="/donate">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Support Our Work
                  </Button>
                </Link>
              </FadeIn>
              
              <FadeIn delay={0.5}>
                <Link href="/contact">
                  <Button variant="outline" className="border-white text-black hover:bg-white/20">
                    Partner With Us
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