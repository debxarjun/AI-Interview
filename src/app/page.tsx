import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
