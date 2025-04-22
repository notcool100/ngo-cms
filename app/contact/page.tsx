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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { HoverCard } from "@/components/animations/hover-card";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { submitContactForm } from "./actions";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitContactForm(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setFormSuccess(true);
        // Reset the form
        e.currentTarget.reset();
      } else {
        setFormError(result.message || "Something went wrong. Please try again.");
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("An unexpected error occurred. Please try again later.");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
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
            alt="Contact Empower Together"
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
                Get In Touch
              </Badge>
            </motion.div>
            
            <AnimatedText
              text="Contact Us"
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            />
            
            <FadeIn
              direction="up"
              delay={0.5}
              className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
            >
              <p className="leading-relaxed">
                Have questions or want to get involved? We'd love to hear from you.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mail className="h-6 w-6" />,
                title: "Email Us",
                description: "Our team will respond within 24-48 hours.",
                info: "info@empowertogether.org",
                link: "mailto:info@empowertogether.org"
              },
              {
                icon: <Phone className="h-6 w-6" />,
                title: "Call Us",
                description: "Available Monday-Friday, 9am-5pm EST.",
                info: "+1 (555) 123-4567",
                link: "tel:+15551234567"
              },
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Visit Us",
                description: "Our headquarters is located at:",
                info: "123 Empowerment Ave, New York, NY 10001",
                link: "https://maps.google.com"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm p-8 text-center border border-muted/20 hover:border-primary/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <a 
                  href={item.link} 
                  className="text-primary hover:underline font-medium"
                  target={item.link.startsWith('http') ? "_blank" : undefined}
                  rel={item.link.startsWith('http') ? "noopener noreferrer" : undefined}
                >
                  {item.info}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeIn direction="right">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-muted/20">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Send a Message</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground mb-8">
                  Have a question, comment, or want to learn more about our work? Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
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
                    <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700 mb-6">
                      Thank you for reaching out. We've received your message and will respond shortly.
                    </p>
                    <Button 
                      onClick={() => setFormSuccess(false)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Send Another Message
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
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        placeholder="How can we help you?"
                        className="min-h-[150px]"
                        required
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
                        I consent to Empower Together storing and processing my personal information to respond to my inquiry. I understand that I can withdraw my consent at any time.
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>
            </FadeIn>
            
            <FadeIn direction="left">
              <div className="space-y-8">
                <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=600&text=Map"
                    alt="Office location map"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge className="bg-white/90 text-primary hover:bg-white">
                      Interactive Map Coming Soon
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-8 border border-muted/20">
                  <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Monday - Friday</p>
                        <p className="text-muted-foreground">9:00 AM - 5:00 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Saturday</p>
                        <p className="text-muted-foreground">10:00 AM - 2:00 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Sunday</p>
                        <p className="text-muted-foreground">Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
                  <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                  <p className="text-muted-foreground mb-6">
                    Follow us on social media to stay updated on our latest news, events, and impact stories.
                  </p>
                  <div className="flex space-x-4">
                    {[
                      { icon: <Facebook className="h-5 w-5" />, name: "Facebook" },
                      { icon: <Twitter className="h-5 w-5" />, name: "Twitter" },
                      { icon: <Instagram className="h-5 w-5" />, name: "Instagram" },
                      { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn" },
                      { icon: <Youtube className="h-5 w-5" />, name: "YouTube" }
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href="#"
                        className="bg-white h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                        whileHover={{ y: -5 }}
                      >
                        {social.icon}
                        <span className="sr-only">{social.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <FadeIn>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">FAQs</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our organization and how to get involved.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How can I donate to support your work?",
                answer: "You can make a donation through our website's donation page, by mail, or by phone. We accept one-time and recurring donations, and all contributions are tax-deductible."
              },
              {
                question: "What volunteer opportunities do you offer?",
                answer: "We offer a variety of volunteer opportunities including local volunteering, skills-based volunteering, virtual volunteering, and more. Visit our Volunteer page to learn more and apply."
              },
              {
                question: "How is my donation used?",
                answer: "Your donation directly supports our programs that empower women and transform communities. We maintain transparency in our financial reporting, and you can view our annual reports on our website."
              },
              {
                question: "Can my company partner with your organization?",
                answer: "Yes! We welcome corporate partnerships and can create customized collaboration opportunities. Please contact us through this form or email our partnerships team directly."
              },
              {
                question: "Do you offer internships or job opportunities?",
                answer: "We regularly offer internships and job opportunities. Please check our Careers page for current openings or send your resume to our HR department."
              },
              {
                question: "How can I stay updated on your work?",
                answer: "You can subscribe to our newsletter, follow us on social media, or check our blog for regular updates on our programs, events, and impact stories."
              }
            ].map((faq, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="border-muted/30 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <FadeIn direction="right">
                <div>
                  <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">Stay Connected</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                  <p className="text-white/90 mb-6">
                    Get the latest updates on our programs, events, and impact stories delivered straight to your inbox.
                  </p>
                  
                  <form className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                      required
                    />
                    <Button className="bg-white text-primary hover:bg-white/90 whitespace-nowrap">
                      Subscribe
                    </Button>
                  </form>
                  
                  <p className="text-white/70 text-sm mt-3">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn direction="left">
                <div className="relative h-[250px] rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=250&width=500&text=Newsletter"
                    alt="Newsletter"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}