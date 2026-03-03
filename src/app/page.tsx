import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  FeaturedProducts,
  HowItWorks,
  Categories,
  Testimonials,
  FAQ,
  NewsletterSignup,
} from "@/components/home";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sales_count", { ascending: false })
    .limit(6);

  // Fetch featured testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .limit(3);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts products={featuredProducts || []} />
        <HowItWorks />
        <Categories />
        <Testimonials testimonials={testimonials || []} />
        <NewsletterSignup />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
