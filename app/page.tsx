import Link from "next/link"
import { ArrowRight, Brain, Calculator, Dumbbell, Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-white" />
            <span className="text-lg font-medium">FitAI</span>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-black border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="#features" className="text-white hover:text-gray-300 transition-colors">
                    Features
                  </Link>
                  <Link href="#science" className="text-white hover:text-gray-300 transition-colors">
                    Science
                  </Link>
                  <Link href="#pricing" className="text-white hover:text-gray-300 transition-colors">
                    Pricing
                  </Link>
                  <Button variant="outline" className="mt-4 border-white text-white hover:bg-white/10">
                    Login
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors text-sm">
              Features
            </Link>
            <Link href="#science" className="text-gray-300 hover:text-white transition-colors text-sm">
              Science
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
              Pricing
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="outline" className="border-white/20 text-white px-4 py-1 rounded-full">
              Science-Based Fitness AI
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              Your Personal <br />
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text font-normal">
                Fitness Intelligence
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Personalized workout plans and nutrition guidance powered by science and artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Direct anchor tag for Get Started */}
              <a
                href="/questionnaire"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-white/90 h-11 px-8 w-full sm:w-auto"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </a>

              {/* Direct anchor tag for Dashboard Demo */}
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/20 text-white hover:bg-white/10 h-11 px-8 w-full sm:w-auto"
              >
                View Dashboard Demo
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-3xl blur-[100px]"></div>
            <Card className="bg-black/50 border-white/10 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Daily Progress</span>
                    <span className="text-white">65%</span>
                  </div>
                  <Progress value={65} className="h-2 bg-white/10" indicatorColor="bg-white" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-black/50 border-white/10">
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-400">Calories</div>
                      <div className="text-xl font-bold text-white">2,450</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-white/10">
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-400">Protein</div>
                      <div className="text-xl font-bold text-white">185g</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-white/10">
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-400">Weekly</div>
                      <div className="text-xl font-bold text-white">5x</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-32 relative">
                  <div className="absolute inset-0 flex items-end">
                    {[70, 45, 80, 60, 90, 50, 75].map((height, i) => (
                      <div key={i} className="flex-1 h-full flex items-end px-0.5">
                        <div className="w-full bg-white/80 rounded-sm" style={{ height: `${height}%` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-white/20 text-white mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-light mb-4">Intelligent Fitness Guidance</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Our AI analyzes your unique profile to create personalized plans that evolve with your progress.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Calculator className="h-6 w-6 text-white" />,
              title: "Precise Calculations",
              description: "Science-based calculations for caloric intake, macronutrients, and workout intensity.",
            },
            {
              icon: <Brain className="h-6 w-6 text-white" />,
              title: "AI Personalization",
              description: "Adaptive recommendations that evolve with your progress and feedback.",
            },
            {
              icon: <Dumbbell className="h-6 w-6 text-white" />,
              title: "Custom Workout Plans",
              description: "Tailored exercise routines based on your goals, equipment, and experience.",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-black border-white/10 hover:border-white/30 transition-all">
              <CardHeader>
                <div className="bg-white/10 p-3 rounded-lg w-fit mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Science Section */}
      <section id="science" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="bg-black/50 border-white/10 overflow-hidden">
                <CardHeader>
                  <CardTitle>Data-Driven Fitness</CardTitle>
                  <CardDescription className="text-gray-400">Visualizing your progress with precision</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="metrics" className="w-full">
                    <TabsList className="grid grid-cols-3 bg-black/50 border border-white/10">
                      <TabsTrigger value="metrics">Metrics</TabsTrigger>
                      <TabsTrigger value="macros">Macros</TabsTrigger>
                      <TabsTrigger value="training">Training</TabsTrigger>
                    </TabsList>
                    <TabsContent value="metrics" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Metabolic Rate</span>
                          <span className="text-white">1,850 kcal</span>
                        </div>
                        <Progress value={75} className="h-2 bg-white/10" indicatorColor="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Sleep Quality</span>
                          <span className="text-white">85%</span>
                        </div>
                        <Progress value={85} className="h-2 bg-white/10" indicatorColor="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Recovery Rate</span>
                          <span className="text-white">92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-white/10" indicatorColor="bg-white" />
                      </div>
                    </TabsContent>
                    <TabsContent value="macros" className="mt-4">
                      <div className="flex items-center justify-center py-8">
                        <div className="relative h-40 w-40">
                          <svg viewBox="0 0 100 100" className="h-full w-full">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#222222" strokeWidth="10" />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="white"
                              strokeWidth="10"
                              strokeDasharray="251.2"
                              strokeDashoffset="150.72" // 40% of 251.2
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#888888"
                              strokeWidth="10"
                              strokeDasharray="251.2"
                              strokeDashoffset="175.84" // 30% of 251.2
                              transform="rotate(90 50 50)"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#444444"
                              strokeWidth="10"
                              strokeDasharray="251.2"
                              strokeDashoffset="175.84" // 30% of 251.2
                              transform="rotate(180 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-sm font-medium">Macros</div>
                              <div className="text-xs text-gray-400">40/30/30</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="text-white font-medium">Protein</div>
                          <div className="text-gray-400">40%</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">Carbs</div>
                          <div className="text-gray-400">30%</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">Fat</div>
                          <div className="text-gray-400">30%</div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="training" className="mt-4">
                      <div className="h-48 relative">
                        <div className="absolute inset-0 flex items-end">
                          {[20, 60, 40, 80, 30, 50, 70].map((height, i) => (
                            <div key={i} className="flex-1 h-full flex items-end px-0.5">
                              <div className="w-full bg-white/80 rounded-sm" style={{ height: `${height}%` }}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Badge variant="outline" className="border-white/20 text-white">
                Evidence-Based Approach
              </Badge>
              <h2 className="text-3xl font-light">Backed by Science</h2>
              <p className="text-gray-400">
                Our algorithms are built on peer-reviewed research and sports science principles. We combine the latest
                scientific understanding of nutrition and exercise physiology with advanced AI to deliver results.
              </p>
              <ul className="space-y-4">
                {[
                  "Metabolic rate calculations based on clinical research",
                  "Macronutrient ratios optimized for your specific goals",
                  "Progressive overload principles for effective muscle growth",
                  "Recovery protocols based on exercise science",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full border border-white flex items-center justify-center mt-0.5 mr-3">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-white/20 text-white mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl font-light mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Choose the plan that fits your fitness journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Basic",
              price: "$9.99",
              description: "Perfect for beginners starting their fitness journey",
              features: [
                "Personalized workout plan",
                "Basic nutrition guidance",
                "Weekly progress tracking",
                "Email support",
              ],
            },
            {
              name: "Pro",
              price: "$19.99",
              description: "Advanced features for dedicated fitness enthusiasts",
              features: [
                "Everything in Basic",
                "Advanced nutrition planning",
                "Daily workout adjustments",
                "Body composition analysis",
                "Priority support",
              ],
              popular: true,
            },
            {
              name: "Elite",
              price: "$29.99",
              description: "Complete solution for maximum results",
              features: [
                "Everything in Pro",
                "1-on-1 coaching sessions",
                "Custom meal plans",
                "Recovery optimization",
                "24/7 priority support",
              ],
            },
          ].map((plan, index) => (
            <Card
              key={index}
              className={`bg-black border-white/10 ${plan.popular ? "border-white ring-1 ring-white" : ""}`}
            >
              <CardHeader>
                {plan.popular && (
                  <Badge className="w-fit mb-2 bg-white text-black hover:bg-white/90">Most Popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-white flex items-center justify-center mr-2">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${plan.popular ? "bg-white text-black hover:bg-white/90" : "bg-black border border-white/20 text-white hover:bg-white/10"}`}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-black/50 border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-gray-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-500/10 rounded-full blur-[100px]"></div>
          <CardContent className="relative z-10 py-12">
            <div className="max-w-xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-light">Ready to transform your fitness journey?</h2>
              <p className="text-gray-400">
                Answer a few questions about your goals and preferences, and our AI will create your personalized
                fitness plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Direct anchor tag for Start Assessment */}
                <a
                  href="/questionnaire"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-white/90 h-11 px-8"
                >
                  Start Your Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </a>

                {/* Direct anchor tag for Try Dashboard Demo */}
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white text-white hover:bg-white/10 h-11 px-8"
                >
                  Try Dashboard Demo
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-white" />
                <span className="text-lg font-medium">FitAI</span>
              </div>
              <p className="text-gray-400 text-sm">Science-based fitness intelligence for personalized results.</p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Security", "Cookies"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} FitAI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {["Twitter", "Instagram", "Facebook", "LinkedIn"].map((social, i) => (
                <Link key={i} href="#" className="text-gray-400 hover:text-white text-sm">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
