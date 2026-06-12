import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className="min-w-0 overflow-x-hidden">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
}
