import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load env from .env.local (no dotenv dependency)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local not found, rely on existing env vars
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("⚠ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — skipping blog seed.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: null;
  author: string;
  category: string;
  tags: string[];
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  published_at: string;
}

const posts: BlogPost[] = [
  {
    title: "How to Set Your Freelance Rates Without Undercharging",
    slug: "how-to-set-freelance-rates",
    excerpt:
      "Stop guessing your rates. Learn a practical framework for pricing your freelance services based on value, market research, and your financial goals.",
    content: `Setting the right freelance rate is one of the most important decisions you'll make as a solopreneur. Charge too little and you'll burn out chasing volume. Charge too much without the positioning to back it up and you'll struggle to land clients. The sweet spot? A rate grounded in value, informed by the market, and aligned with your financial goals.

## Why Most Freelancers Undercharge

The biggest mistake new freelancers make is anchoring their rates to their previous salary. You divide your old annual pay by 2,080 hours and call it a day. But freelancing comes with costs your employer used to cover — taxes, health insurance, software, equipment, unpaid time off, and the hours you spend on admin, marketing, and sales.

A good rule of thumb: **your freelance hourly rate should be at least 2–3x what you earned per hour as an employee** to maintain the same take-home income.

## The Value-Based Pricing Framework

Instead of billing for your time, consider billing for the outcome you deliver. Here's how:

### 1. Understand the Client's Problem

Before you quote a price, ask questions:

- What's the business impact of solving this problem?
- What have they tried before, and what did it cost?
- What's the cost of *not* solving it?

The answers tell you what your work is actually worth to them.

### 2. Research Market Rates

You don't need to match the market, but you should know it. Check these sources:

- **Glassdoor and Payscale** for salary data in your field
- **Freelance communities** (Reddit, Twitter/X, Slack groups) where people share rate ranges
- **Job boards** like Toptal, Upwork, and We Work Remotely for listed budgets

Create a simple spreadsheet with low, mid, and high ranges for your niche and experience level.

### 3. Calculate Your Minimum Viable Rate

Work backwards from your financial needs:

- **Annual income goal** (e.g., €60,000)
- **Add business costs** (software, tools, insurance, taxes — roughly 30–40%)
- **Divide by billable hours** (not 2,080 — more like 1,200–1,400 for most freelancers)

This gives you your floor rate. Never go below it.

### 4. Package Your Services

Hourly billing punishes efficiency. The faster and better you get, the less you earn. Instead:

- **Project-based pricing**: Quote a fixed fee per deliverable
- **Retainer packages**: Monthly agreements with a set scope
- **Tiered packages**: Offer Basic, Standard, and Premium options

Packaging lets you capture more value and gives clients price certainty.

## How to Communicate Your Rates Confidently

The way you present your price matters as much as the number itself.

**Do:**
- State your rate clearly and without apology
- Explain what's included and the expected outcome
- Use anchoring — mention the value or ROI before the price

**Don't:**
- Say "my rate is only…" or "I could do it for…"
- Negotiate against yourself before the client even pushes back
- Drop your rate at the first sign of hesitation

## When to Raise Your Rates

If any of these are true, it's time for an increase:

- You're booked solid with no availability
- You haven't raised rates in over a year
- Your skills have noticeably improved
- Clients are saying yes too quickly (your rate is too low)

A good cadence is to **review your rates every 6 months** and increase by 10–20% for new clients.

## Quick Rate Calculator

Here's a simplified formula you can use right now:

1. Target annual income: **€X**
2. Add 35% for taxes and expenses: **€X × 1.35**
3. Divide by 1,300 billable hours: **= your minimum hourly rate**
4. Multiply by estimated project hours for project-based quotes

For example: €60,000 × 1.35 = €81,000 ÷ 1,300 = **€62/hour minimum**.

## Final Thoughts

Your rate isn't just a number — it's a signal. It tells clients what kind of professional you are and what quality they can expect. Price with intention, review regularly, and never apologize for charging what you're worth.

The best freelancers don't compete on price. They compete on value. Start there, and the right clients will follow.`,
    cover_image: null,
    author: "SoloKit",
    category: "money",
    tags: ["pricing", "freelance", "rates", "income"],
    is_published: true,
    seo_title: "How to Set Your Freelance Rates Without Undercharging",
    seo_description:
      "Learn a practical value-based pricing framework for freelancers. Calculate your minimum rate, package services, and communicate prices with confidence.",
    published_at: "2026-01-12T10:00:00Z",
  },
  {
    title: "5 Red Flags to Watch for When Onboarding New Clients",
    slug: "red-flags-onboarding-new-clients",
    excerpt:
      "Not every client is a good client. Learn the five warning signs to spot during onboarding so you can protect your time, energy, and business.",
    content: `Landing a new client feels great — until it doesn't. The excitement of a signed contract can quickly turn into stress when scope creep sets in, payments are late, or communication becomes a nightmare. The good news? Most problem clients show warning signs early. You just need to know what to look for.

Here are five red flags to watch for during the onboarding process — and what to do about them.

## 1. Vague or Constantly Shifting Requirements

A client who can't clearly define what they want is a client who will never be satisfied with what you deliver.

**Warning signs:**
- "We'll figure it out as we go"
- Requirements change between the proposal and the kickoff call
- They can't articulate the problem they're trying to solve
- Multiple stakeholders with conflicting opinions and no clear decision-maker

**What to do:** Before you start any work, insist on a written scope document. Define deliverables, timelines, revision rounds, and what's explicitly *not* included. If they resist putting things in writing, that tells you everything.

## 2. Pushing Back on Your Payment Terms

How someone handles money discussions early on predicts how they'll handle payments later.

**Warning signs:**
- Asking for significant work before any payment
- "We'll pay you when the project is done" (for large projects)
- Pushing back on your standard deposit or milestone structure
- Comparing your rates to cheaper alternatives during negotiation

**What to do:** Stick to your terms. A common structure that protects both parties:

- **50% upfront** before work begins
- **25% at midpoint** milestone
- **25% on delivery**

For smaller projects, 50/50 or even 100% upfront works well. If a client won't agree to a reasonable payment structure, they're not your client.

## 3. Disrespecting Your Boundaries from Day One

Pay attention to how a client treats your time during the sales and onboarding process. It only gets worse.

**Warning signs:**
- Expecting replies at all hours, including weekends
- Scheduling calls outside your stated availability
- "This will only take five minutes" (it never does)
- Texting you on personal channels without permission

**What to do:** Set your communication boundaries in your welcome packet or onboarding email:

- Your working hours and expected response times
- Preferred communication channels (email, Slack, project tool — not WhatsApp)
- How to request changes or additional work
- Your policy on rush requests and out-of-scope work

Enforce these boundaries consistently. A client who respects them will become one of your best. A client who ignores them will become your worst.

## 4. The "Quick and Easy" Project That Isn't

Beware of clients who minimize the complexity of what they're asking for. This is often unintentional — they genuinely don't understand the work involved — but it leads to unrealistic expectations.

**Warning signs:**
- "It should be really simple"
- "My nephew could do it, but we want a professional"
- Expecting a two-week timeline for a two-month project
- No budget for the scope they're describing

**What to do:** Educate, don't argue. Walk them through your process, explain what's involved, and provide a realistic timeline. If they insist it should be faster or cheaper than reality allows, they need a different provider — not a discount.

Create a one-page "What to Expect" document that outlines your typical process and timelines. This manages expectations before they become problems.

## 5. Bad-Mouthing Their Previous Freelancer

Listen carefully when a client talks about past service providers. If every previous freelancer or agency was "terrible," "incompetent," or "disappeared," the common denominator might not be the freelancers.

**Warning signs:**
- A long list of previous freelancers who "didn't work out"
- Blaming others without acknowledging their own role
- "You're so much better than the last person" (before you've done anything)
- Wanting you to redo or "fix" work without clear direction on what's wrong

**What to do:** Ask neutral questions: "What specifically didn't work?" and "What would success look like this time?" Their answers will tell you whether the issues were legitimate or whether this client is impossible to please.

## How to Protect Yourself

The best defense against problem clients is a solid onboarding process:

1. **Use a contract** — always, even for small projects
2. **Collect a deposit** before starting any work
3. **Define the scope** in writing with clear boundaries
4. **Set communication expectations** from the start
5. **Trust your gut** — if something feels off, it probably is

It's better to turn down a project than to spend weeks dealing with a client who drains your energy and doesn't pay on time.

## The Positive Flip Side

Great clients also show early signs:

- They respect your process and expertise
- They communicate clearly and promptly
- They pay on time (or early)
- They trust you to do the work they hired you for

When you find these clients, nurture the relationship. They're the foundation of a sustainable freelance business.

## Final Thoughts

Not every lead should become a client. Learning to spot red flags early saves you time, money, and stress. Your onboarding process is your first line of defense — make it thorough, professional, and non-negotiable.

The clients who respect your process from day one are the clients worth keeping.`,
    cover_image: null,
    author: "SoloKit",
    category: "clients",
    tags: ["clients", "onboarding", "red flags", "freelance"],
    is_published: true,
    seo_title: "5 Red Flags to Watch for When Onboarding New Clients",
    seo_description:
      "Spot problem clients before they become problems. Learn the five warning signs during onboarding and how to protect your freelance business.",
    published_at: "2026-01-26T10:00:00Z",
  },
  {
    title: "The Solopreneur's Weekly Review: A Simple System to Stay on Track",
    slug: "solopreneur-weekly-review-system",
    excerpt:
      "A 30-minute weekly review can transform your productivity. Here's a simple, repeatable framework designed for freelancers and solopreneurs.",
    content: `When you work alone, there's no manager checking in on your progress. No team standup. No quarterly review. That freedom is one of the best parts of solopreneurship — but it's also one of the biggest risks. Without regular reflection, it's easy to stay busy without being productive.

The fix? A weekly review. It takes about 30 minutes, and it's the single highest-leverage habit you can build as a solopreneur.

## Why Weekly Reviews Work

A weekly review serves three purposes:

1. **Clarity** — You see exactly what you accomplished (and what you didn't)
2. **Course correction** — You catch problems before they become crises
3. **Intentionality** — You start each week with a plan, not just a to-do list

Most solopreneurs skip this because it feels like overhead. But the opposite is true. The 30 minutes you invest saves hours of wasted effort, missed deadlines, and reactive firefighting.

## The 30-Minute Framework

Here's a simple, repeatable structure you can use every Friday afternoon or Sunday evening.

### Part 1: Review the Past Week (10 minutes)

Open your calendar, task manager, and any project tools. Answer these questions:

**What did I accomplish?**
- List your completed tasks and wins, big and small
- Note any projects that moved forward significantly
- Celebrate progress — solopreneurs rarely do this enough

**What didn't get done?**
- Identify tasks that rolled over from last week
- Be honest about *why* — was it a priority shift, poor estimation, or procrastination?
- Decide: reschedule, delegate, or drop entirely

**What surprised me?**
- Unexpected client requests or opportunities
- Tasks that took much longer (or shorter) than expected
- Any patterns you're noticing

### Part 2: Check Your Numbers (5 minutes)

You don't need complex analytics. Just glance at the basics:

- **Revenue this week** — invoices sent, payments received
- **Pipeline** — proposals out, leads in progress
- **Hours worked** — are you overworking or underworking?
- **Cash flow** — any upcoming expenses or late payments?

Keep a simple spreadsheet or use a template to track these week over week. Trends matter more than individual data points.

### Part 3: Plan the Coming Week (15 minutes)

Now look ahead. This is where the real value lives.

**Identify your top 3 priorities:**
These are the tasks that, if completed, would make the week a success. Not 10 things — three. Everything else is secondary.

**Block your time:**
- Schedule deep work blocks for your priorities
- Add client calls, admin tasks, and meetings
- Protect at least one "buffer block" for unexpected work
- Schedule your breaks and end-of-day times

**Review your commitments:**
- Check deadlines for the next 2 weeks
- Confirm any meetings or calls
- Follow up on outstanding invoices or proposals

**Set one growth task:**
Each week, include one task that moves your business forward beyond client work:
- Write a blog post or social media content
- Reach out to a potential referral partner
- Update your portfolio or website
- Learn a new skill or tool

### The Weekly Review Template

Here's a copy-paste template you can use in any note-taking app:

**Week of [Date]**

**Wins:**
-
-
-

**Incomplete (and why):**
-
-

**Key numbers:**
- Revenue: €
- Hours worked:
- Pipeline:

**Top 3 priorities for next week:**
1.
2.
3.

**Growth task:**
-

**Notes / ideas:**
-

## Tips for Making It Stick

### Pick a consistent time
Friday afternoon works well — you close out the week while everything is fresh. Sunday evening is another popular option. The specific day matters less than consistency.

### Keep it short
If your review takes more than 30 minutes, you're overcomplicating it. The goal is reflection and planning, not detailed reporting.

### Make it a ritual
Pair it with something enjoyable. A cup of coffee, your favorite playlist, a change of scenery. When the review feels like a reward rather than a chore, you'll actually do it.

### Track your streaks
Mark each completed review on a calendar. After a few weeks, the streak itself becomes motivation to keep going.

### Adapt the template
Start with the framework above, but adjust it to fit your work. A designer's review will look different from a developer's or a consultant's. The structure should serve you, not the other way around.

## What Changes After a Month

After four weeks of consistent weekly reviews, most solopreneurs notice:

- **Less overwhelm** — you know what's on your plate and what's not
- **Better estimation** — you get more realistic about how long tasks take
- **Fewer dropped balls** — nothing slips through the cracks
- **More intentional growth** — your business moves forward, not just sideways

## Final Thoughts

The weekly review isn't glamorous. It won't go viral on social media. But it's the unglamorous habit that separates solopreneurs who thrive from those who just survive.

Thirty minutes. Once a week. Start this Friday.`,
    cover_image: null,
    author: "SoloKit",
    category: "productivity",
    tags: ["productivity", "weekly review", "planning", "systems"],
    is_published: true,
    seo_title:
      "The Solopreneur's Weekly Review: A Simple System to Stay on Track",
    seo_description:
      "Build a 30-minute weekly review habit that gives you clarity, keeps you productive, and moves your freelance business forward. Free template included.",
    published_at: "2026-02-09T10:00:00Z",
  },
  {
    title: "SEO Basics Every Freelancer Should Know in 2025",
    slug: "seo-basics-freelancers-2025",
    excerpt:
      "You don't need to be an SEO expert to get organic traffic. Learn the fundamentals that will help your freelance website rank and attract clients.",
    content: `Most freelancers rely on referrals and cold outreach to find clients. That works, but it's unpredictable and time-intensive. SEO — search engine optimization — gives you a more sustainable channel: clients finding *you* through Google, exactly when they need what you offer.

You don't need to become an SEO expert. But understanding the basics can turn your website from a digital business card into an actual lead generation tool.

## Why SEO Matters for Freelancers

Think about how your ideal client searches for help:

- "freelance web designer for startups"
- "hire a bookkeeper for small business"
- "best Notion templates for freelancers"

If your website shows up for searches like these, you get warm leads without spending a cent on ads. SEO compounds over time — an article you write today can bring in traffic for years.

## Keyword Research: Finding What People Search For

Keywords are the foundation of SEO. They're the words and phrases people type into Google.

### How to Find Good Keywords

1. **Start with your services** — List everything you offer, then think about how a client would search for it
2. **Use free tools** — Google's autocomplete, "People also ask" sections, and Google Trends are all free
3. **Check search volume** — Tools like Ubersuggest, Ahrefs (free tier), or Google Keyword Planner show how many people search for a term each month
4. **Assess competition** — Long-tail keywords (longer, more specific phrases) are easier to rank for

### Good Keywords for Freelancers

| Instead of... | Try... |
|---|---|
| "web design" | "web design for small businesses" |
| "copywriting" | "email copywriter for ecommerce" |
| "freelancer" | "hire freelance UX designer remote" |

The more specific the keyword, the more likely the searcher is ready to buy.

## On-Page SEO: Optimizing Your Content

On-page SEO means making sure each page on your site is structured so Google understands what it's about.

### The Essentials

**Title tag:** The most important on-page element. Include your primary keyword naturally. Keep it under 60 characters.

Example: "Freelance Web Designer for Startups | Jane Smith"

**Meta description:** The snippet that appears under your title in search results. Write a compelling 150–160 character summary that includes your keyword and encourages clicks.

**Headings (H1, H2, H3):** Use one H1 per page (your main title). Use H2s for major sections and H3s for subsections. Include keywords where they fit naturally.

**URL structure:** Keep URLs short, descriptive, and keyword-rich.
- Good: \`/freelance-web-design-startups\`
- Bad: \`/services/page-2?id=847\`

**Internal linking:** Link between your own pages. Your blog posts should link to your services page. Your about page should link to your portfolio. This helps Google understand your site structure.

**Image alt text:** Describe every image. It helps with accessibility and gives Google more context about your content.

## Content Strategy: What to Write About

A blog is the most effective SEO tool for freelancers. Each post is a new opportunity to rank for a keyword.

### Content Ideas That Attract Clients

- **"How to" guides** related to your expertise (shows authority)
- **Case studies** of client work (shows results)
- **Comparison posts** ("Notion vs Airtable for project management")
- **Industry-specific content** ("SEO for restaurants" if you serve that niche)
- **Common questions** your clients ask (these often match search queries exactly)

### Writing for SEO Without Sounding Robotic

- Write for humans first, search engines second
- Include your keyword in the title, first paragraph, and a few headings
- Use related terms naturally throughout the content
- Aim for **1,000–2,000 words** for blog posts (longer content tends to rank better)
- Break up text with headings, bullet points, and short paragraphs

## Technical SEO: The Basics

You don't need to be a developer, but make sure these boxes are checked:

### Site Speed
- Compress images before uploading
- Use a fast hosting provider
- Minimize unnecessary plugins or scripts
- Test with Google PageSpeed Insights

### Mobile-Friendly Design
- Over 60% of searches happen on mobile
- Use a responsive theme or template
- Test your site on multiple devices

### SSL Certificate
- Your URL should start with \`https://\`
- Most hosting providers include this for free
- Google considers HTTPS a ranking factor

### XML Sitemap
- Helps Google discover all your pages
- Most CMS platforms (WordPress, Webflow) generate this automatically
- Submit it through Google Search Console

## Google Search Console: Your Free SEO Dashboard

If you do one technical thing, set up **Google Search Console**. It's free and shows you:

- Which keywords your site appears for
- How many clicks and impressions you get
- Any crawl errors or issues
- Which pages perform best

Check it monthly to understand what's working and where to improve.

## Local SEO (If You Serve a Specific Area)

If you work with local clients, local SEO can be incredibly effective:

- **Google Business Profile** — Create and optimize your listing
- **Local keywords** — Include your city or region in your content
- **NAP consistency** — Your Name, Address, and Phone number should be identical everywhere online
- **Reviews** — Encourage satisfied clients to leave Google reviews

## Common SEO Mistakes to Avoid

- **Keyword stuffing** — Don't force keywords where they don't fit
- **Ignoring mobile** — A site that looks great on desktop but breaks on mobile loses rankings
- **No content updates** — Publishing once and never again signals abandonment
- **Copying content** — Duplicate content from other sites hurts your rankings
- **Skipping meta descriptions** — Every page needs a unique, compelling description

## A Simple Monthly SEO Routine

You don't need to spend hours on SEO. Here's a manageable monthly plan:

1. **Publish 2–4 blog posts** targeting specific keywords
2. **Check Google Search Console** for new keyword opportunities
3. **Update one old post** with fresh information or better optimization
4. **Build one backlink** — guest post, collaboration, or directory listing
5. **Fix any technical issues** flagged in Search Console

Consistency beats intensity. A few hours per month, sustained over time, will produce real results.

## Final Thoughts

SEO isn't magic, and it's not instant. It typically takes 3–6 months to see meaningful results from a new content strategy. But unlike paid ads, the traffic doesn't stop when you stop paying.

For freelancers, SEO is one of the best long-term investments you can make. Start with the basics, stay consistent, and let your website work for you while you focus on doing great work.`,
    cover_image: null,
    author: "SoloKit",
    category: "marketing",
    tags: ["SEO", "marketing", "freelance", "organic traffic"],
    is_published: true,
    seo_title: "SEO Basics Every Freelancer Should Know in 2025",
    seo_description:
      "A practical guide to SEO fundamentals for freelancers. Learn keyword research, on-page optimization, content strategy, and a simple monthly routine.",
    published_at: "2026-02-23T10:00:00Z",
  },
  {
    title: "How to Build a Portfolio That Actually Wins Clients",
    slug: "build-portfolio-that-wins-clients",
    excerpt:
      "Your portfolio is your best sales tool. Learn how to structure it with case studies, social proof, and clear messaging that converts visitors into clients.",
    content: `Your portfolio is often the first thing a potential client sees. It's your handshake, your pitch, and your proof of competence — all in one page. Yet most freelancers treat it as an afterthought: a gallery of thumbnails or a list of past projects with no context.

A portfolio that wins clients isn't just a showcase of work. It's a sales tool that tells a story, demonstrates results, and makes it easy for the right people to say "yes."

## What Clients Actually Look For

Before we get into structure, understand what a potential client wants to know when they land on your portfolio:

1. **Can this person solve my problem?** (relevance)
2. **Have they done it before?** (experience)
3. **What was the result?** (proof)
4. **Can I trust them?** (credibility)
5. **How do I hire them?** (action)

Every element of your portfolio should answer one of these questions.

## The Anatomy of a High-Converting Portfolio

### 1. A Clear, Specific Headline

Skip generic headlines like "My Work" or "Portfolio." Instead, lead with who you help and what you do:

- "Web Design for SaaS Startups"
- "Brand Identity for Food & Beverage Brands"
- "Notion Systems for Freelancers and Small Teams"

Specificity builds trust. A client looking for a SaaS designer will click on the first example. A client looking for a generalist will scroll past all three.

### 2. Case Studies Over Screenshots

This is the biggest upgrade most freelancers can make. Instead of showing a grid of images, present **3–5 detailed case studies** that walk through your process.

Each case study should include:

**The Client:** Who they are, their industry, and their size. This helps visitors self-identify.

**The Problem:** What challenge or goal brought them to you. Frame it in business terms, not technical ones.

**Your Approach:** What you did and why. This shows your thinking process, not just the output.

**The Result:** Quantify whenever possible. "Increased conversion rate by 35%," "Reduced onboarding time from 2 hours to 20 minutes," or "Launched on time and under budget."

**Visuals:** Include screenshots, mockups, or before/after comparisons. Make the work tangible.

### 3. Social Proof That Builds Credibility

Testimonials are powerful, but only when they're specific.

**Weak testimonial:** "Great to work with. Highly recommend."

**Strong testimonial:** "Working with [Name] increased our email conversion rate by 40%. They were communicative, met every deadline, and offered insights we hadn't considered. We've already hired them for two more projects."

Where to place social proof:
- **Next to case studies** — a quote from that specific client
- **On your homepage** — 2–3 of your best testimonials
- **Near your contact form** — reduces friction at the decision point

If you're just starting out and don't have testimonials yet:
- Offer a free or discounted project in exchange for a detailed review
- Include results data even without a named client
- Use LinkedIn recommendations as interim testimonials

### 4. An "About" Section That Connects

Clients hire people, not portfolios. A brief about section should cover:

- **Who you are** and your background (keep it relevant)
- **Who you serve** — your ideal client
- **What makes you different** — your approach, values, or unique skill combination
- **A professional photo** — it makes you real and approachable

Keep it to 3–4 paragraphs maximum. This isn't your life story — it's a trust builder.

### 5. A Clear Call to Action

Every page of your portfolio should make it obvious what to do next. Don't bury your contact information. Include:

- A prominent "Work With Me" or "Get in Touch" button
- A simple contact form (name, email, brief project description)
- Your email address for people who prefer direct communication
- Expected response time ("I typically reply within 24 hours")

## Structuring Your Portfolio Page

Here's a proven layout:

1. **Hero section** — Headline + one sentence about who you help + CTA button
2. **Featured case studies** (3–5) — Your best, most relevant work
3. **Testimonials strip** — 2–3 client quotes
4. **About section** — Brief, relevant, personal
5. **Additional work** — A grid of other projects (optional, for breadth)
6. **Contact section** — Form + CTA + response time

## Choosing What to Include

Quality beats quantity. Every time.

**Include projects that:**
- Represent the type of work you want to do more of
- Show measurable results or clear outcomes
- Come from clients similar to your target market
- Demonstrate your best skills and thinking

**Exclude projects that:**
- Don't represent your current skill level
- Were for clients or industries you don't want to serve
- You can't talk about in detail (NDA with no alternatives)
- Were rushed or you're not proud of

It's better to have three excellent case studies than twenty mediocre screenshots.

## Portfolio Mistakes to Avoid

**No context:** Showing work without explaining the problem, process, or result. A screenshot alone doesn't sell.

**Too broad:** Trying to appeal to everyone. "I do web design, graphic design, video editing, copywriting, and social media management" tells a client you're a generalist — and generalists compete on price.

**Outdated work:** Projects from five years ago that don't reflect your current abilities. Remove them.

**No CTA:** Making someone hunt for how to contact you. If they can't figure it out in 5 seconds, they'll leave.

**Slow load times:** Large uncompressed images kill your portfolio's performance. Optimize everything.

## Keeping Your Portfolio Fresh

Your portfolio isn't a "set and forget" page. Schedule time to update it:

- **After every major project** — Add a case study while the details are fresh
- **Quarterly** — Review and remove outdated work
- **When pivoting** — If you're targeting a new niche, update your portfolio to reflect it
- **When you get feedback** — If clients consistently ask about something, add it

## The Portfolio as a Sales Conversation

Think of your portfolio as one side of a conversation with your ideal client:

- *"I see you work with companies like mine"* → relevant case studies
- *"I like your approach"* → detailed process descriptions
- *"Others trust you"* → testimonials and social proof
- *"I know what to expect"* → about section and process overview
- *"I'm ready to reach out"* → clear, accessible contact form

When every element answers a question the client already has, your portfolio does the selling for you.

## Final Thoughts

A great portfolio isn't about showing everything you've ever done. It's about showing the right things to the right people in the right way. Focus on case studies over screenshots, results over aesthetics, and clarity over cleverness.

Build your portfolio like you'd build a product — with your user (the client) in mind. Make it easy for them to understand your value, trust your expertise, and take the next step.

That's a portfolio that wins clients.`,
    cover_image: null,
    author: "SoloKit",
    category: "career",
    tags: ["portfolio", "career", "freelance", "personal branding"],
    is_published: true,
    seo_title: "How to Build a Portfolio That Actually Wins Clients",
    seo_description:
      "Learn how to build a freelance portfolio that converts. Structure case studies, leverage social proof, and create clear calls to action that win clients.",
    published_at: "2026-03-09T10:00:00Z",
  },
];

async function seed() {
  console.log("Seeding blog posts...\n");

  for (const post of posts) {
    const { data, error } = await supabase
      .from("posts")
      .upsert(post, { onConflict: "slug" })
      .select("id, title, slug")
      .single();

    if (error) {
      console.error(`✗ Failed to upsert "${post.title}":`, error.message);
    } else {
      console.log(`✓ ${data.title} (/${data.slug})`);
    }
  }

  console.log("\nDone! Seeded", posts.length, "blog posts.");
}

seed().catch(console.error);
