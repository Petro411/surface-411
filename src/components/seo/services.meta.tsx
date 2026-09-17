import Head from "next/head";


export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceCard {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
}

interface SeoHeadServicesProps {
  title?: string;
  description?: string;
  url?: string;
  faqs?: FaqItem[];
  services?: ServiceCard[];
}

/**
 * SeoHeadServices — reusable Head component for Petro411 Services page
 * (Next.js Pages Router)
 *
 * Usage (in pages/services.tsx):
 *
 * import SeoHeadServices, { ServiceCard, FaqItem } from "../components/SeoHeadServices";
 *
 * const ServiceCards: ServiceCard[] = [
 *   {
 *     title: "Verified Mineral Ownership Data",
 *     subtitle: "Accurate & Up-to-Date",
 *     description: "We provide reliable and regularly updated information on mineral owners, ensuring your research is always backed by trustworthy data.",
 *     image: "/assets/images/list.png",
 *   },
 *   // ...rest of the service cards
 * ];
 *
 * const faqs: FaqItem[] = [
 *   { question: "...", answer: "..." },
 * ];
 *
 * export default function ServicesPage() {
 *   return (
 *     <>
 *       <SeoHeadServices services={ServiceCards} faqs={faqs} />
 *       {/* rest of the page *\/}
 *     </>
 *   );
 * }
 */
export default function SeoHeadServices({
  title = "Our Services | Mineral Owner Data Solutions | Petro411",
  description = "Verified mineral ownership data, downloadable spreadsheets, advanced search filters and secure access — explore Petro411's full suite of services for land professionals.",
  url = "https://www.petro411.com/services",
  faqs = [],
  services = [],
}: SeoHeadServicesProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Petro411",
    url: "https://www.petro411.com/",
    logo: "https://www.petro411.com/logo-name.png",
    description:
      "Petro411 provides accurate, secure mineral owner contact information nationwide for the oil and gas industry.",
  };

  // ItemList + Service schema — built dynamically from the services array
  const serviceListSchema =
    services.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              provider: {
                "@type": "Organization",
                name: "Petro411",
              },
              areaServed: "US",
              ...(service.image && {
                image: service.image.startsWith("http")
                  ? service.image
                  : `https://www.petro411.com${service.image}`,
              }),
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
        name="robots"
        content={"index, follow"}
      />
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

      {/* Service List Schema — only rendered if services array is passed */}
      {serviceListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }}
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