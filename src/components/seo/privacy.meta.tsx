import Head from "next/head";


export type LegalPageType = "privacy" | "terms";

interface SeoHeadLegalProps {
  page: LegalPageType;
  title?: string;
  description?: string;
  url?: string;
  /**
   * Raw HTML content coming from the backend (the same string you pass
   * to dangerouslySetInnerHTML on the page body). If `description` is
   * not provided, a clean meta description is auto-generated from this
   * by stripping tags and trimming to ~155 characters.
   */
  content?: string;
  /**
   * ISO date string (e.g. "2026-01-15") — when this legal document was
   * last updated. Powers the dateModified field in schema, which
   * matters for legal/policy pages.
   */
  lastUpdated?: string;
}

const LEGAL_PAGE_DEFAULTS: Record<
  LegalPageType,
  { title: string; description: string; url: string; schemaType: string }
> = {
  privacy: {
    title: "Privacy Policy | Petro411",
    description:
      "Read Petro411's Privacy Policy to understand how we collect, use, and protect your personal information across our mineral owner data platform.",
    url: "https://www.petro411.com/privacy",
    schemaType: "PrivacyPolicy",
  },
  terms: {
    title: "Terms of Use | Petro411",
    description:
      "Review Petro411's Terms of Use governing access to our mineral owner contact database and land acquisition data services.",
    url: "https://www.petro411.com/terms",
    schemaType: "TermsOfService",
  },
};

/**
 * Strips HTML tags and collapses whitespace from a backend HTML string,
 * then trims to a safe meta description length.
 */
function generateDescriptionFromHtml(html: string, maxLength = 155): string {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;

  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
}

/**
 * SeoHeadLegal — reusable Head component for Petro411 legal pages
 * (Next.js Pages Router)
 *
 * Covers: /privacy, /terms
 *
 * Usage (in pages/privacy.tsx) — content comes from backend API:
 *
 * import SeoHeadLegal from "../components/SeoHeadLegal";
 *
 * export default function PrivacyPage({ htmlContent }) {
 *   return (
 *     <>
 *       <SeoHeadLegal page="privacy" content={htmlContent} lastUpdated="2026-01-15" />
 *       <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
 *     </>
 *   );
 * }
 *
 * Usage (in pages/terms.tsx):
 *
 * <SeoHeadLegal page="terms" content={htmlContent} lastUpdated="2026-01-15" />
 *
 * If you'd rather write the description manually instead of auto-generating
 * it from the backend HTML, just pass it directly and `content` is ignored
 * for description purposes:
 *
 * <SeoHeadLegal page="privacy" description="Custom description..." />
 */
export default function SeoHeadLegal({
  page,
  title,
  description,
  url,
  content,
  lastUpdated,
}: SeoHeadLegalProps) {
  const defaults = LEGAL_PAGE_DEFAULTS[page];

  const finalTitle = title || defaults.title;
  const finalUrl = url || defaults.url;

  // Priority: manual description > auto-generated from backend content > fallback default
  const finalDescription =
    description ||
    (content ? generateDescriptionFromHtml(content) : defaults.description);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Petro411",
    url: "https://www.petro411.com/",
    logo: "https://www.petro411.com/logo-name.png",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": finalUrl,
    name: finalTitle,
    description: finalDescription,
    url: finalUrl,
    isPartOf: {
      "@type": "WebSite",
      url: "https://www.petro411.com/",
      name: "Petro411",
    },
    publisher: {
      "@type": "Organization",
      name: "Petro411",
    },
    ...(lastUpdated && { dateModified: lastUpdated }),
  };

  return (
    <Head>
      {/* Basic Meta */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalUrl} />

      {/* Legal pages should be indexed — no noindex here */}
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content="Petro411" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* WebPage Schema — includes dateModified when provided, useful for legal docs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </Head>
  );
}