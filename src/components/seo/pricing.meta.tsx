import Head from "next/head";


export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingPlan {
  title: string;
  amount: number;
  currency?: string; // defaults to "USD"
  billingPeriod?: "monthly" | "yearly" | "one-time";
  description?: string;
  features?: string[];
}

interface SeoHeadPricingProps {
  title?: string;
  description?: string;
  url?: string;
  faqs?: FaqItem[];
  plans?: PricingPlan[];
}

/**
 * SeoHeadPricing — reusable Head component for Petro411 Pricing page
 * (Next.js Pages Router)
 *
 * Usage (in pages/pricing.tsx):
 *
 * import SeoHeadPricing, { PricingPlan, FaqItem } from "../components/SeoHeadPricing";
 *
 * const plans: PricingPlan[] = [
 *   {
 *     title: "Starter",
 *     amount: 0,
 *     billingPeriod: "monthly",
 *     description: "Search and view individual Mineral Owner Name, Address, and Legal Description.",
 *     features: ["1 User", "1 County", "1 Download", "Free listing view without phone numbers"],
 *   },
 *   {
 *     title: "Pro",
 *     amount: 29.99,
 *     billingPeriod: "monthly",
 *     description: "Access expanded county data with mineral owner contact info.",
 *     features: ["1 User", "2 Counties", "20 Downloads/month"],
 *   },
 *   // ...rest of the plans
 * ];
 *
 * const faqs: FaqItem[] = [
 *   { question: "What membership plans are available?", answer: "..." },
 * ];
 *
 * export default function PricingPage() {
 *   return (
 *     <>
 *       <SeoHeadPricing plans={plans} faqs={faqs} />
 *       {/* rest of the pricing page *\/}
 *     </>
 *   );
 * }
 */
export default function SeoHeadPricing({
  title = "Pricing Plans | Mineral Owner Data Access | Petro411",
  description = "Flexible pricing plans for mineral owner data access — from free searches to full county downloads with verified contact info. Choose the plan that fits your needs.",
  url = "https://www.petro411.com/pricing",
  faqs = [],
  plans = [],
}: SeoHeadPricingProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Petro411",
    url: "https://www.petro411.com/",
    logo: "https://www.petro411.com/logo-name.png",
    description:
      "Petro411 provides accurate, secure mineral owner contact information nationwide for the oil and gas industry.",
  };

  // Product + Offer schema — built dynamically from the plans array
  const pricingSchema =
    plans.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: plans.map((plan, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: `Petro411 ${plan.title} Plan`,
              description:
                plan.description ||
                (plan.features && plan.features.length > 0
                  ? plan.features.join(", ")
                  : `${plan.title} subscription plan on Petro411.`),
              brand: {
                "@type": "Brand",
                name: "Petro411",
              },
              offers: {
                "@type": "Offer",
                price: plan.amount.toString(),
                priceCurrency: plan.currency || "USD",
                availability: "https://schema.org/InStock",
                url,
                ...(plan.billingPeriod && {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: plan.amount,
                    priceCurrency: plan.currency || "USD",
                    billingDuration:
                      plan.billingPeriod === "monthly"
                        ? "P1M"
                        : plan.billingPeriod === "yearly"
                        ? "P1Y"
                        : undefined,
                  },
                }),
              },
            },
          })),
        }
      : null;

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <Head>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta
        property="og:image"
        content="https://www.petro411.com/assets/images/cover-bg.png"
      />
      <meta property="og:site_name" content="Petro411" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Pricing / Product Schema — only rendered if plans array is passed */}
      {pricingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
        />
      )}

      {/* FAQ Schema — only rendered if faqs array is passed */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </Head>
  );
}