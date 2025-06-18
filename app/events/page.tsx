"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CalendarIcon, 
  MapPinIcon, 
  Users, 
  Clock, 
  Filter 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";


export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    // Fetch upcoming events
    fetch("/api/events?upcoming=true")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
      })
      .catch((err) => {
        console.error("Error fetching upcoming events:", err);
        setEvents([]);
      });

    // Fetch past events
    fetch("/api/events?past=true&limit=3")
      .then((res) => res.json())
      .then((data) => {
        setPastEvents(data.events || []);
      })
      .catch((err) => {
        console.error("Error fetching past events:", err);
        setPastEvents([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter events based on search term and filter type
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "featured") return matchesSearch && event.featured;
    if (filterType === "virtual") return matchesSearch && event.location?.toLowerCase().includes("virtual");
    if (filterType === "in-person") return matchesSearch && event.location && !event.location.toLowerCase().includes("virtual");
    
    return matchesSearch;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section with Parallax Effect */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <ParallaxScroll speed={0.3} className="relative h-[40vh] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Our Events"
            fill
            className="object-cover"
            priority
          />
        </ParallaxScroll>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container text-center text-white">
            <div className="flex justify-center">
              <AnimatedText
              text="Upcoming Events"
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center"
            />
            </div>
            <FadeIn
              direction="up"
              delay={0.3}
              className="mx-auto mt-6 max-w-[700px] text-lg text-white/90"
            >
              <p className="leading-relaxed">
                Join us at our upcoming events and be part of the change. Together, we
                can make a difference in the lives of women around the world.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Events Section with Filters */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="upcoming" className="space-y-8">
              {isLoading ? (
                // Skeleton loaders
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index} className="flex h-full flex-col overflow-hidden">
                        <div className="h-48 bg-muted animate-pulse" />
                        <CardHeader>
                          <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                          <div className="h-4 w-1/2 bg-muted rounded mt-2 animate-pulse"></div>
                          <div className="h-4 w-2/3 bg-muted rounded mt-2 animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                          <div className="h-4 w-full bg-muted rounded mt-2 animate-pulse"></div>
                          <div className="h-4 w-3/4 bg-muted rounded mt-2 animate-pulse"></div>
                        </CardContent>
                        <CardFooter className="border-t p-4">
                          <div className="flex w-full justify-between">
                            <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                            <div className="h-10 w-1/3 bg-muted rounded animate-pulse"></div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <FadeIn>
                  <div className="mx-auto max-w-md rounded-lg border border-dashed p-12 text-center">
                    <h2 className="mb-4 text-xl font-semibold">No events found</h2>
                    <p className="mb-6 text-muted-foreground">
                      {searchTerm || filterType !== "all" 
                        ? "No events match your search criteria. Try adjusting your filters."
                        : "We don't have any upcoming events scheduled at the moment. Please check back later."}
                    </p>
                    <Button asChild>
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </FadeIn>
              ) : (
                <StaggerChildren
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  staggerDelay={0.1}
                >
                  {filteredEvents.map((event) => (
                    <StaggerItem key={event.id}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="flex h-full flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="relative h-48 w-full overflow-hidden">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.4 }}
                            >
                              {event.image ? (
                                <Image
                                  src={event.image || "/placeholder.svg"}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            {event.featured && (
                              <Badge className="absolute left-3 top-3 bg-primary/90 hover:bg-primary">
                                Featured
                              </Badge>
                            )}
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                              <Badge variant="outline" className="bg-black/50 text-white border-none">
                                <Clock className="mr-1 h-3 w-3" />
                                {format(new Date(event.startDate), "MMM d, yyyy")}
                              </Badge>
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle className="line-clamp-2 text-xl">{event.title}</CardTitle>
                            {event.location && (
                              <CardDescription className="flex items-center gap-1 mt-2">
                                <MapPinIcon className="h-4 w-4 text-primary" />
                                {event.location}
                              </CardDescription>
                            )}
                            {event._count?.attendees !== undefined && (
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Users className="h-4 w-4 text-primary" />
                                {event._count.attendees}{" "}
                                {event._count.attendees === 1 ? "attendee" : "attendees"}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="flex-1">
                            <p className="line-clamp-3 text-muted-foreground">
                              {event.description}
                            </p>
                          </CardContent>
                          <CardFooter className="border-t bg-muted/20 p-4">
                            <div className="w-full">
                              <Button asChild className="w-full gap-2 rounded-full">
                                <Link href={`/events/${event.slug}`}>
                                  View Details
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-8">
              {isLoading ? (
                // Skeleton loaders
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index} className="flex h-full flex-col overflow-hidden">
                        <div className="h-48 bg-muted animate-pulse" />
                        <CardHeader>
                          <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                          <div className="h-4 w-1/2 bg-muted rounded mt-2 animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                          <div className="h-4 w-full bg-muted rounded mt-2 animate-pulse"></div>
                          <div className="h-4 w-3/4 bg-muted rounded mt-2 animate-pulse"></div>
                        </CardContent>
                        <CardFooter>
                          <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : pastEvents.length === 0 ? (
                <FadeIn>
                  <div className="mx-auto max-w-md rounded-lg border border-dashed p-12 text-center">
                    <h2 className="mb-4 text-xl font-semibold">No past events</h2>
                    <p className="mb-6 text-muted-foreground">
                      We don't have any past events to display at the moment.
                    </p>
                  </div>
                </FadeIn>
              ) : (
                <StaggerChildren
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  staggerDelay={0.1}
                >
                  {pastEvents.map((event) => (
                    <StaggerItem key={event.id}>
                      <Card className="flex h-full flex-col overflow-hidden opacity-90 hover:opacity-100 transition-all duration-300">
                        <div className="relative h-48 w-full overflow-hidden">
                          {event.image ? (
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              fill
                              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Badge className="absolute left-3 top-3 bg-secondary/90 hover:bg-secondary">
                            Past Event
                          </Badge>
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <Badge variant="outline" className="bg-black/50 text-white border-none">
                              <Clock className="mr-1 h-3 w-3" />
                              {format(new Date(event.startDate), "MMM d, yyyy")}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                          {event.location && (
                            <CardDescription className="flex items-center gap-1 mt-2">
                              <MapPinIcon className="h-4 w-4" />
                              {event.location}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="line-clamp-3 text-muted-foreground">
                            {event.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild variant="outline" className="w-full rounded-full">
                            <Link href={`/events/${event.slug}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 md:p-12 text-white text-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to host an event with us?</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="max-w-2xl mx-auto mb-8 text-white/90">
                If you're interested in partnering with us to host an event that supports women's empowerment, 
                we'd love to hear from you.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
