"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, CreditCard, Heart, ArrowRight, DollarSign, Gift, Calendar, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Import our custom components
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { StaggerItem } from "@/components/animations/stagger-item";
import { AnimatedText } from "@/components/animations/animated-text";
import { ParallaxScroll } from "@/components/animations/parallax-scroll";
import { CountUp } from "@/components/animations/count-up";

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationType, setDonationType] = useState("one-time");

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for your donation!",
        description: "Your contribution will help empower women around the world.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Parallax Effect */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <ParallaxScroll speed={0.3} className="relative h-[50vh] md:h-[60vh] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Donate to INWOLAG"
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
                Support Our Mission
              </Badge>
            </motion.div>
            
            <AnimatedText
              text="Make a Difference Today"
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            />
            
            <FadeIn
              direction="up"
              delay={0.5}
              className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl"
            >
              <p className="leading-relaxed">
                Your donation helps us empower women and transform communities around the world.
                Every contribution, no matter the size, makes a meaningful impact.
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
                  onClick={() => document.getElementById('donation-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Donate Now
                </Button>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-muted/10">
        <div className="container">
          <FadeIn className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our Impact</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient">Your Donation Makes a Difference</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: <DollarSign className="h-6 w-6" />, value: 1250000, prefix: "$", label: "Raised to Date" },
              { icon: <Gift className="h-6 w-6" />, value: 8500, label: "Donors Worldwide" },
              { icon: <Users className="h-6 w-6" />, value: 15000, label: "Women Supported" },
              { icon: <Calendar className="h-6 w-6" />, value: 12, label: "Years of Impact" },
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
                  prefix={stat.prefix || ""}
                  className="text-3xl font-bold text-primary"
                  duration={2.5}
                />
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section id="donation-form" className="py-16 md:py-24 scroll-mt-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn direction="right" className="order-2 lg:order-1">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Support Our Work</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient mb-6">Your Gift Makes an Impact</h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Your generous donation helps us provide education, economic opportunities, and leadership development
                  to women and girls around the world.
                </p>
                <p className="leading-relaxed">
                  We are committed to transparency and accountability. You can be confident that your donation will be
                  used effectively to support our programs and the women we serve.
                </p>
              </div>

              <StaggerChildren className="mt-8 space-y-6" staggerDelay={0.15}>
                {[
                  {
                    title: "Education Scholarships",
                    description: "$50 provides school supplies for a girl for a year. $500 covers a full scholarship for a year."
                  },
                  {
                    title: "Business Start-up Grants",
                    description: "$100 provides a microloan to help a woman start a small business. $1,000 funds a comprehensive business training program."
                  },
                  {
                    title: "Leadership Development",
                    description: "$200 sponsors a woman to attend a leadership workshop. $2,000 funds a community leadership initiative."
                  }
                ].map((item, index) => (
                  <StaggerItem key={index}>
                    <motion.div 
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/20 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                        whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                        whileHover={{ color: "white" }}
                      >
                        <Check className="h-6 w-6" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </FadeIn>

            <FadeIn direction="left" className="order-1 lg:order-2">
              <Card className="shadow-lg border-muted/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <CardTitle className="text-2xl">Make a Donation</CardTitle>
                  <CardDescription>Support our mission to empower women worldwide</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleDonationSubmit}>
                    <Tabs 
                      defaultValue="one-time" 
                      className="w-full"
                      onValueChange={setDonationType}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="one-time">One-time</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="one-time" className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-base">Select Amount</Label>
                          <RadioGroup 
                            defaultValue="50" 
                            className="grid grid-cols-3 gap-4"
                            value={donationAmount}
                            onValueChange={setDonationAmount}
                          >
                            {["25", "50", "100", "250", "500", "other"].map((amount) => (
                              <div key={amount}>
                                <RadioGroupItem 
                                  value={amount} 
                                  id={`one-${amount}`} 
                                  className="sr-only" 
                                />
                                <Label
                                  htmlFor={`one-${amount}`}
                                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all duration-200"
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="text-primary"
                                  >
                                    <Heart className="mb-2 h-5 w-5" />
                                  </motion.div>
                                  <span className="text-xl font-bold">
                                    {amount === "other" ? "Other" : `$${amount}`}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        {donationAmount === "other" && (
                          <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Label htmlFor="custom-amount">Custom Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input 
                                id="custom-amount" 
                                type="number" 
                                placeholder="Enter amount" 
                                className="pl-8"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <Label htmlFor="donor-name">Your Name</Label>
                            <Input 
                              id="donor-name" 
                              placeholder="Enter your name" 
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="donor-email">Email Address</Label>
                            <Input 
                              id="donor-email" 
                              type="email" 
                              placeholder="Enter your email" 
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="monthly" className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-base">Select Monthly Amount</Label>
                          <RadioGroup 
                            defaultValue="20" 
                            className="grid grid-cols-3 gap-4"
                            value={donationAmount}
                            onValueChange={setDonationAmount}
                          >
                            {["10", "20", "50", "100", "200", "other"].map((amount) => (
                              <div key={amount}>
                                <RadioGroupItem 
                                  value={amount} 
                                  id={`monthly-${amount}`} 
                                  className="sr-only" 
                                />
                                <Label
                                  htmlFor={`monthly-${amount}`}
                                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all duration-200"
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="text-primary"
                                  >
                                    <Heart className="mb-2 h-5 w-5" />
                                  </motion.div>
                                  <span className="text-xl font-bold">
                                    {amount === "other" ? "Other" : `$${amount}`}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        {donationAmount === "other" && (
                          <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Label htmlFor="monthly-custom-amount">Custom Monthly Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input 
                                id="monthly-custom-amount" 
                                type="number" 
                                placeholder="Enter amount" 
                                className="pl-8"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <Label htmlFor="donor-name-monthly">Your Name</Label>
                            <Input 
                              id="donor-name-monthly" 
                              placeholder="Enter your name" 
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="donor-email-monthly">Email Address</Label>
                            <Input 
                              id="donor-email-monthly" 
                              type="email" 
                              placeholder="Enter your email" 
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <CardFooter className="flex flex-col space-y-4 px-0 pt-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" 
                          size="lg"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Proceed to Payment
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <div className="text-center text-xs text-muted-foreground">
                        Your donation is tax-deductible to the extent allowed by law.
                        <br />
                        Secure payment processing by Stripe.
                      </div>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <FadeIn className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Testimonials</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gradient">Hear From Our Supporters</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                quote: "Supporting this organization has been one of the most rewarding experiences of my life. Seeing the direct impact of my donations on women's lives is incredible.",
                name: "Sarah Johnson",
                title: "Monthly Donor since 2018"
              },
              {
                quote: "As a business owner, I wanted to give back in a meaningful way. The transparency and effectiveness of this organization made it an easy choice.",
                name: "Michael Chen",
                title: "Corporate Partner"
              },
              {
                quote: "I started with a small monthly donation, but seeing the impact reports and stories of transformation inspired me to increase my support each year.",
                name: "Amara Okafor",
                title: "Sustaining Member"
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
                <div className="mt-6 pt-4 border-t">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Other Ways to Support</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="max-w-2xl mx-auto mb-8 text-white/90">
                Beyond financial contributions, there are many ways you can support our mission to empower women worldwide.
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FadeIn delay={0.3}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-2">Volunteer</h3>
                  <p className="text-white/90 mb-4">Share your time and skills to make a direct impact in your community.</p>
                  <Link href="/volunteer">
                    <Button variant="outline" className="border-white text-white hover:bg-white/20">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-2">Corporate Partnerships</h3>
                  <p className="text-white/90 mb-4">Partner with us to create meaningful social impact and engage your employees.</p>
                  <Link href="/partner">
                    <Button variant="outline" className="border-white text-white hover:bg-white/20">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.5}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-2">Spread the Word</h3>
                  <p className="text-white/90 mb-4">Follow us on social media and share our mission with your network.</p>
                  <Link href="/contact">
                    <Button variant="outline" className="border-white text-white hover:bg-white/20">
                      Connect
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}