import { Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  // Show placeholder testimonials if none exist
  const displayTestimonials =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: "1",
            name: "Sarah Johnson",
            role: "Freelance Designer",
            content:
              "These templates saved me hours every week. The expense tracker alone has helped me understand my business finances so much better.",
            rating: 5,
            avatar: null,
            product_id: null,
            is_featured: true,
            is_published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Mike Chen",
            role: "Web Developer",
            content:
              "Finally, professional templates that don't look like they were made in 2010. Clean, modern, and actually useful for running my freelance business.",
            rating: 5,
            avatar: null,
            product_id: null,
            is_featured: true,
            is_published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Emma Williams",
            role: "Content Creator",
            content:
              "I bought the bundle and it's been a game-changer. From tracking clients to managing my content calendar, everything is now organized.",
            rating: 5,
            avatar: null,
            product_id: null,
            is_featured: true,
            is_published: true,
            created_at: new Date().toISOString(),
          },
        ];

  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Loved by Freelancers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join thousands of solopreneurs who trust SoloKit
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayTestimonials.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border border-border bg-background p-6"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 text-foreground">{`"${testimonial.content}"`}</p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  {testimonial.role && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
