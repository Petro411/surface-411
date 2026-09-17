import Head from "next/head";


export interface FaqItem {
  title: string;
  description: string;
}

interface SeoHeadProps {
  title?: string;
  description?: string;
  url?: string;
  faqs?: FaqItem[];
  allowIndexing?: boolean; // default: false
}

/**
 * SeoHead — reusable Head component for Petro411 (Next.js Pages Router)
 *
 * Usage (in pages/index.tsx):
 *
 * import SeoHead, { FaqItem } from "../components/SeoHead";
 *
 * const faqs: FaqItem[] = [
 *   {
 *     question: "What membership plans are available?",
 *     answer: "Petro411 offers free and paid membership plans. Free users can search mineral owner records without contact details, while paid members get full access to phone numbers, emails, and addresses.",
 *   },
 *   {
 *     question: "What is this website about?",
 *     answer: "Petro411 is a mineral owner contact database built for the oil and gas industry, providing accurate contact information sourced from county property records.",
 *   },
 *   // ...add remaining FAQs
 * ];
 *
 * export default function HomePage() {
 *   return (
 *     <>
 *       <SeoHead faqs={faqs} />
 *       {/* rest of the page *\/}
 *     </>
 *   );
 * }
 */
export default function SeoHead({
  title = "Mineral Owner Contact Database | Petro411",
  description = "Find accurate, verified mineral owner contact info — phone, email & address — by county and state. Trusted by landmen and oil & gas pros. Search free.",
  url = "https://www.petro411.com/",
  faqs = [],
  allowIndexing = true,
}: SeoHeadProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Petro411",
    url: "https://www.petro411.com/",
    logo: "https://www.petro411.com/logo-name.png",
    description:
      "Petro411 provides accurate, secure mineral owner contact information nationwide for the oil and gas industry.",
      sameAs:[
        'https://www.linkedin.com/company/petro411/'
      ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.petro411.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.petro411.com/owners?state={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs?.map((faq) => ({
            "@type": "Question",
            name: faq?.title || "",
            acceptedAnswer: {
              "@type": "Answer",
              text: faq?.description || "",
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
      <meta
        name="robots"
        content={
          allowIndexing
            ? "index, follow"
            : "noindex, nofollow, noarchive, nosnippet"
        }
      />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta
        property="og:image"
        content="https://www.petro411.com/assets/cover-bg.png"
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

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

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
