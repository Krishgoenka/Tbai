
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Users, GraduationCap, LogIn, UserPlus, UserCog, Linkedin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";


// Animated heading component
function AnimatedHeading() {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const phrases = useMemo(() => [
        "Empowering 1 Billion Minds with AI.",
        "Bridging India’s AI Education Divide.",
        "AI for Every Student, Everywhere."
    ], []);

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % phrases.length;
            const fullText = phrases[i];

            if (isDeleting) {
                setText(fullText.substring(0, text.length - 1));
            } else {
                setText(fullText.substring(0, text.length + 1));
            }

            setTypingSpeed(isDeleting ? 80 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, phrases]);

    return (
         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            <span className="pr-1">{text}</span>
            <span className="animate-pulse">|</span>
        </h1>
    )
}


// Inline SVG for Instagram as it's not in lucide-react
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export default function Home() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && userRole) {
      router.push(userRole === 'admin' ? '/admin' : '/student');
    }
  }, [user, userRole, loading, router]);


  // If loading or redirecting, show a simple loading state or nothing
  if (loading || (user && userRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">TechnoBillion AI</span>
        </Link>
        <nav className="flex items-center gap-4">
            <Link href="https://www.linkedin.com/company/techno-billion-ai/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
            </Link>
             <Link href="https://www.instagram.com/technobillionai?igsh=MXV6ZXB5c2hpZ2wwcw==" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <InstagramIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
            </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <AnimatedHeading />
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Our mission is to democratize AI education and innovation, bridging the gap between urban metros and underserved regions across India.
          </p>
          <div className="flex justify-center gap-4">
             <Button size="lg" asChild>
              <Link href="/login">
                <UserCog className="mr-2"/>
                Admin Login
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                    <UserPlus className="mr-2" />
                    Student Signup
                </Link>
            </Button>
          </div>
        </section>

        <section className="bg-card py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Mission at TechnoBillion AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="pt-4">Empower a Billion People</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  To democratize AI education, providing one billion individuals with access to AI tools, training, and mentorship by 2027.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="pt-4">Create AI Hubs</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  To launch AI-powered labs and innovation centers in Tier 2 & 3 regions, closing the urban-rural education divide.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                   <div className="p-4 bg-primary/10 rounded-full">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="pt-4">Foster Innovation</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  To equip institutions with advanced AI tools and foster a culture where every student can create, innovate, and solve real-world problems.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
        <div className="flex justify-center gap-6 mb-4">
            <Link href="https://www.linkedin.com/company/techno-billion-ai/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
            </Link>
             <Link href="https://www.instagram.com/technobillionai?igsh=MXV6ZXB5c2hpZ2wwcw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <InstagramIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
            </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} TechnoBillion AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
