import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Check, CreditCard, Heart } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <div className="relative h-[40vh] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Donate to Empower Together"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container text-center text-white">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Make a Difference</h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-white/90">
              Your donation helps us empower women and transform communities.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge className="mb-4">Support Our Work</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Gift Makes an Impact</h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Your generous donation helps us provide education, economic opportunities, and leadership development
                  to women and girls around the world.
                </p>
                <p>
                  We are committed to transparency and accountability. You can be confident that your donation will be
                  used effectively to support our programs and the women we serve.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Education Scholarships</h3>
                    <p className="text-sm text-muted-foreground">
                      $50 provides school supplies for a girl for a year. $500 covers a full scholarship for a year.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Business Start-up Grants</h3>
                    <p className="text-sm text-muted-foreground">
                      $100 provides a microloan to help a woman start a small business. $1,000 funds a comprehensive
                      business training program.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Leadership Development</h3>
                    <p className="text-sm text-muted-foreground">
                      $200 sponsors a woman to attend a leadership workshop. $2,000 funds a community leadership
                      initiative.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                  <CardDescription>Support our mission to empower women worldwide</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="one-time" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="one-time">One-time</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="one-time" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Amount</Label>
                        <RadioGroup defaultValue="50" className="grid grid-cols-3 gap-4">
                          <div>
                            <RadioGroupItem value="25" id="one-25" className="sr-only" />
                            <Label
                              htmlFor="one-25"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$25</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="50" id="one-50" className="sr-only" />
                            <Label
                              htmlFor="one-50"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$50</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="100" id="one-100" className="sr-only" />
                            <Label
                              htmlFor="one-100"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$100</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="250" id="one-250" className="sr-only" />
                            <Label
                              htmlFor="one-250"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$250</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="500" id="one-500" className="sr-only" />
                            <Label
                              htmlFor="one-500"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$500</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="other" id="one-other" className="sr-only" />
                            <Label
                              htmlFor="one-other"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">Other</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-amount">Custom Amount</Label>
                        <Input id="custom-amount" type="number" placeholder="Enter amount" />
                      </div>
                    </TabsContent>
                    <TabsContent value="monthly" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Monthly Amount</Label>
                        <RadioGroup defaultValue="20" className="grid grid-cols-3 gap-4">
                          <div>
                            <RadioGroupItem value="10" id="monthly-10" className="sr-only" />
                            <Label
                              htmlFor="monthly-10"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$10</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="20" id="monthly-20" className="sr-only" />
                            <Label
                              htmlFor="monthly-20"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$20</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="50" id="monthly-50" className="sr-only" />
                            <Label
                              htmlFor="monthly-50"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$50</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="100" id="monthly-100" className="sr-only" />
                            <Label
                              htmlFor="monthly-100"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$100</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="200" id="monthly-200" className="sr-only" />
                            <Label
                              htmlFor="monthly-200"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">$200</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="other" id="monthly-other" className="sr-only" />
                            <Label
                              htmlFor="monthly-other"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:has([data-state=checked])]:border-primary"
                            >
                              <Heart className="mb-2 h-5 w-5 text-primary" />
                              <span className="text-xl font-bold">Other</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-monthly-amount">Custom Monthly Amount</Label>
                        <Input id="custom-monthly-amount" type="number" placeholder="Enter amount" />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card">Card Information</Label>
                      <div className="relative">
                        <Input id="card" placeholder="Card number" />
                        <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" />
                        <Input placeholder="CVC" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea id="message" placeholder="Add a personal message" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Complete Donation</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge className="mb-4">More Ways to Support</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Other Ways to Give</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
              There are many ways you can support our mission beyond one-time donations.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Giving</CardTitle>
                <CardDescription>Become a sustaining supporter</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Join our community of monthly donors and provide consistent, reliable support for our programs.
                  Monthly giving allows us to plan ahead and ensure the sustainability of our work.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="#monthly">
                  <Button variant="outline">Become a Monthly Donor</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Corporate Partnerships</CardTitle>
                <CardDescription>Partner your business with our mission</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We work with businesses of all sizes to create meaningful partnerships that advance women's
                  empowerment while meeting your corporate social responsibility goals.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/partner">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Legacy Giving</CardTitle>
                <CardDescription>Create a lasting impact</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Include Empower Together in your estate planning to create a lasting legacy that will continue to
                  empower women and girls for generations to come.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/legacy-giving">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge className="mb-4">Questions</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
              Find answers to common questions about donating to Empower Together.
            </p>
          </div>
          <div className="mx-auto max-w-[800px] space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Is my donation tax-deductible?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, Empower Together is a registered 501(c)(3) nonprofit organization, and all donations are
                  tax-deductible to the extent allowed by law. You will receive a tax receipt for your donation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How is my donation used?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  80% of your donation goes directly to our programs supporting women and girls. The remaining 20% is
                  used for administrative costs and fundraising efforts to sustain and grow our impact.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I specify which program my donation supports?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can designate your donation to support a specific program or initiative. Please include a
                  note with your donation or contact us at donations@empowertogether.org to specify your preference.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How can I get a receipt for my donation?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You will automatically receive a receipt via email for online donations. For other types of donations,
                  please contact us at donations@empowertogether.org.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Have Questions?</h2>
            <p className="mt-4 text-primary-foreground/90">
              Our team is here to help. Contact us with any questions about donating or supporting our work.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-white text-primary hover:bg-white/90">Contact Us</Button>
              </Link>
              <Link href="mailto:donations@empowertogether.org">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Email Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

