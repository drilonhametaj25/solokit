import Link from "next/link";
import {
  DollarSign,
  Users,
  Zap,
  Megaphone,
  Briefcase,
  Heart,
  LayoutGrid,
} from "lucide-react";

const categories = [
  {
    key: "money",
    label: "Money",
    description: "Track income, expenses & invoices",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    key: "clients",
    label: "Clients",
    description: "Manage projects & relationships",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    key: "productivity",
    label: "Productivity",
    description: "Organize tasks & time",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Grow your audience",
    icon: Megaphone,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    key: "career",
    label: "Career",
    description: "Plan your growth",
    icon: Briefcase,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    key: "life",
    label: "Life",
    description: "Balance work & personal",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    key: "niche",
    label: "Niche",
    description: "Specialized templates",
    icon: LayoutGrid,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
];

export function Categories() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find the perfect template for every area of your business
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/shop?category=${category.key}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor}`}
              >
                <category.icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                {category.label}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
