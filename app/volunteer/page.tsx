"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Check, 
  Clock, 
  Globe, 
  Users, 
  Heart, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { CountUp } from "@/components/animations/count-up";
import { submitVolunteerForm } from "./actions";

export default function VolunteerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("local");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitVolunteerForm(formData);

      if (result.success) {
        setFormSuccess(true);
        e.currentTarget.reset();
      } else {
        setFormError(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Parallax */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <ParallaxScroll speed={0.3} className="relative h-[50vh] md:h-[60vh] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Volunteer with INWOLAG"
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
                Join Our Community
              </Badge>
            </motion.div>
            
            <div className="flex justify-center">
  <AnimatedText
    text="Volunteer With Us"
    className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-center"
  />
</div>
            
            <FadeIn
              direction="up"
              delay={0.5}
              className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
            >
              <p className="leading-relaxed">
                Share your time and skills to help empower women and transform communities around the world.
              </p>
            </FadeIn>
            
            <FadeIn
              direction="up"
              delay={0.7}
              className="mt-10"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-medium px-8 rounded-full shadow-lg"
                  onClick={() => document.getElementById('volunteer-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                </Button>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: <Users className="h-6 w-6" />, value: 1500, label: "Active Volunteers" },
              { icon: <Clock className="h-6 w-6" />, value: 25000, label: "Hours Contributed" },
              { icon: <Globe className="h-6 w-6" />, value: 20, label: "Countries Represented" },
              { icon: <Heart className="h-6 w-6" />, value: 120, label: "Projects Supported" },
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

      {/* Volunteer Opportunities */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Opportunities</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                Ways to Get Involved
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the various volunteer opportunities available and find the perfect fit for your skills and interests.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Local Volunteering",
                description: "Join us in your community to support local initiatives, events, and programs that empower women.",
                icon: <Users className="h-6 w-6" />,
                commitment: "Flexible hours, regular schedule",
                skills: ["Communication", "Organization", "Teamwork"]
              },
              {
                title: "Skills-Based Volunteering",
                description: "Share your professional expertise in areas like marketing, finance, education, or technology.",
                icon: <Briefcase className="h-6 w-6" />,
                commitment: "Project-based, 5-10 hours per month",
                skills: ["Professional expertise", "Mentoring", "Problem-solving"]
              },
              {
                title: "Virtual Volunteering",
                description: "Contribute remotely to our mission through online tasks, digital content creation, or virtual mentoring.",
                icon: <Globe className="h-6 w-6" />,
                commitment: "Flexible hours, work from anywhere",
                skills: ["Digital literacy", "Self-motivation", "Time management"]
              },
              {
                title: "Event Support",
                description: "Help organize and run fundraising events, workshops, and community gatherings.",
                icon: <Calendar className="h-6 w-6" />,
                commitment: "Event-based, occasional",
                skills: ["Event planning", "Customer service", "Adaptability"]
              },
              {
                title: "Educational Programs",
                description: "Facilitate workshops, training sessions, and educational activities for women and girls.",
                icon: <GraduationCap className="h-6 w-6" />,
                commitment: "Regular schedule, 2-4 hours per week",
                skills: ["Teaching", "Patience", "Subject expertise"]
              },
              {
                title: "Advocacy & Outreach",
                description: "Raise awareness about women's issues and promote our mission in your networks and community.",
                icon: <Heart className="h-6 w-6" />,
                commitment: "Flexible, self-directed",
                skills: ["Communication", "Networking", "Passion for the cause"]
              }
            ].map((opportunity, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="h-full border-muted/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary">
                        {opportunity.icon}
                      </div>
                      <CardTitle>{opportunity.title}</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {opportunity.description}
                    </p>
                    
                    <div>
                      <div className="flex items-center text-sm mb-2">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Time Commitment:</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {opportunity.commitment}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-sm mb-2">
                        <Check className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Helpful Skills:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-6">
                        {opportunity.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-muted/30">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => document.getElementById('volunteer-form').scrollIntoView({ behavior: 'smooth' })}
                    >
                      Apply for This Role
                    </Button>
                  </CardFooter>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Benefits */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Benefits</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                Why Volunteer With Us
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Volunteering with INWOLAG offers numerous benefits and opportunities for personal and professional growth.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <motion.div 
                className="relative h-[500px] rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Volunteer benefits"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </FadeIn>
            
            <FadeIn direction="left">
              <StaggerChildren className="space-y-6" staggerDelay={0.15}>
                {[
                  {
                    title: "Make a Meaningful Impact",
                    description: "Directly contribute to empowering women and transforming communities around the world."
                  },
                  {
                    title: "Develop New Skills",
                    description: "Gain valuable experience and develop professional and personal skills that enhance your resume."
                  },
                  {
                    title: "Expand Your Network",
                    description: "Connect with like-minded individuals, professionals, and community leaders who share your values."
                  },
                  {
                    title: "Receive Training and Support",
                    description: "Access comprehensive training, ongoing support, and professional development opportunities."
                  },
                  {
                    title: "Flexible Opportunities",
                    description: "Find volunteer roles that fit your schedule, skills, and interests, whether in-person or virtual."
                  }
                ].map((benefit, index) => (
                  <StaggerItem key={index}>
                    <motion.div 
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                        whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                        whileHover={{ color: "white" }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-medium">{benefit.title}</h3>
                        <p className="text-muted-foreground mt-1">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <section id="volunteer-form" className="py-16 bg-white scroll-mt-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn direction="right" className="order-2 lg:order-1">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Join Us</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">Apply to Volunteer</h2>
              
              {formSuccess ? (
                <motion.div 
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Application Submitted!</h3>
                  <p className="text-green-700 mb-6">
                    Thank you for your interest in volunteering with us. We've received your application and will be in touch soon.
                  </p>
                  <Button 
                    onClick={() => setFormSuccess(false)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Another Application
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                      <X className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-red-700">{formError}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="City, Country" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Volunteer Interest</Label>
                    <RadioGroup defaultValue="local" name="volunteerType">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="local" id="local" />
                          <Label htmlFor="local" className="cursor-pointer">Local Volunteering</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="skills" id="skills" />
                          <Label htmlFor="skills" className="cursor-pointer">Skills-Based</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="virtual" id="virtual" />
                          <Label htmlFor="virtual" className="cursor-pointer">Virtual Volunteering</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="events" id="events" />
                          <Label htmlFor="events" className="cursor-pointer">Event Support</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="education" id="education" />
                          <Label htmlFor="education" className="cursor-pointer">Educational Programs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advocacy" id="advocacy" />
                          <Label htmlFor="advocacy" className="cursor-pointer">Advocacy & Outreach</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select name="availability" defaultValue="flexible">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible hours</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="evenings">Evenings</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="fulltime">Full-time (40 hours/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills & Experience</Label>
                    <Textarea 
                      id="skills" 
                      name="skills" 
                      placeholder="Tell us about your relevant skills, experience, and interests"
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Why do you want to volunteer with us?</Label>
                    <Textarea 
                      id="motivation" 
                      name="motivation" 
                      placeholder="Share your motivation for volunteering with INWOLAG"
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      className="mt-1"
                      required
                    />
                    <Label htmlFor="consent" className="text-sm text-muted-foreground">
                      I consent to INWOLAG storing and processing my personal information for volunteer recruitment purposes. I understand that I can withdraw my consent at any time.
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              )}
            </FadeIn>
            
            <FadeIn direction="left" className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="bg-muted/10 rounded-xl p-8 border border-muted/20">
                  <h3 className="text-xl font-bold mb-4">What to Expect</h3>
                  <ol className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Application Review</p>
                        <p className="text-sm text-muted-foreground">
                          We'll review your application within 5-7 business days.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Initial Conversation</p>
                        <p className="text-sm text-muted-foreground">
                          We'll schedule a call to discuss your interests and potential roles.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Orientation & Training</p>
                        <p className="text-sm text-muted-foreground">
                          You'll receive an orientation and any necessary training for your role.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Start Volunteering</p>
                        <p className="text-sm text-muted-foreground">
                          Begin making an impact with ongoing support from our team.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
                  <h3 className="text-xl font-bold mb-4">Volunteer FAQs</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">What is the minimum time commitment?</p>
                      <p className="text-sm text-muted-foreground">
                        It varies by role, but most opportunities require at least 4-5 hours per month for a minimum of three months.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Do I need specific qualifications?</p>
                      <p className="text-sm text-muted-foreground">
                        Some roles require specific skills or experience, but many don't. We value enthusiasm and commitment above all.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Can I volunteer remotely?</p>
                      <p className="text-sm text-muted-foreground">
                        Yes! We offer many virtual volunteering opportunities that can be done from anywhere in the world.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Will I receive training?</p>
                      <p className="text-sm text-muted-foreground">
                        Yes, all volunteers receive orientation and role-specific training to ensure you're prepared for your responsibilities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Volunteer Testimonials */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Testimonials</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                Hear From Our Volunteers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover what our volunteers have to say about their experiences working with us.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                quote: "Volunteering with INWOLAG has been one of the most rewarding experiences of my life. I've developed new skills, made lasting friendships, and seen firsthand the impact of our work.",
                name: "Sarah Johnson",
                role: "Education Program Volunteer",
                image: "/placeholder.svg?height=100&width=100"
              },
              {
                quote: "As a virtual volunteer, I can contribute to this amazing cause from anywhere. The team is incredibly supportive, and I feel like I'm making a real difference despite being thousands of miles away.",
                name: "Michael Chen",
                role: "Digital Marketing Volunteer",
                image: "/placeholder.svg?height=100&width=100"
              },
              {
                quote: "I started volunteering to give back to my community, but I've gained so much more than I've given. The training and mentorship I've received have been invaluable for my personal and professional growth.",
                name: "Amara Okafor",
                role: "Event Coordinator Volunteer",
                image: "/placeholder.svg?height=100&width=100"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm p-8 border border-muted/20 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="absolute -top-4 left-8 text-primary text-6xl">"</div>
                <p className="mt-6 text-muted-foreground italic relative z-10">
                  {testimonial.quote}
                </p>
                <div className="mt-6 pt-4 border-t flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 md:p-12 text-white text-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="max-w-2xl mx-auto mb-8 text-white/90">
                Join our community of volunteers and help us empower women and transform communities around the world.
              </p>
            </FadeIn>
            
            <div className="flex flex-wrap justify-center gap-4">
              <FadeIn delay={0.3}>
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => document.getElementById('volunteer-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                </Button>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <Link href="/contact">
                  <Button variant="outline" className="border-white text-black hover:bg-white/20">
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