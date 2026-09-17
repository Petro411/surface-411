import Head from "next/head";


export type AuthPageType = "login" | "signup" | "forgot-password";

interface SeoHeadAuthProps {
  page: AuthPageType;
  title?: string;
  description?: string;
  url?: string;
  /**
   * Auth pages are noindexed by default (recommended — they are
   * transactional/duplicate-content pages with no unique SEO value,
   * and indexing them can expose account-related URLs in search results).
   * Set to true only if you have a specific reason to allow indexing.
   */
  allowIndexing?: boolean;
}

const AUTH_PAGE_DEFAULTS: Record<
  AuthPageType,
  { title: string; description: string; url: string }
> = {
  login: {
    title: "Login | Petro411",
    description:
      "Log in to your Petro411 account to search and access verified mineral owner contact data nationwide.",
    url: "https://www.petro411.com/auth/login",
  },
  signup: {
    title: "Sign Up | Petro411",
    description:
      "Create a free Petro411 account to start searching mineral owner contact information by county and state.",
    url: "https://www.petro411.com/auth/sign-up",
  },
  "forgot-password": {
    title: "Reset Your Password | Petro411",
    description:
      "Forgot your password? Reset your Petro411 account password securely and regain access to mineral owner data.",
    url: "https://www.petro411.com/auth/forgot-password",
  },
};

/**
 * SeoHeadAuth — reusable Head component for Petro411 Auth pages
 * (Next.js Pages Router)
 *
 * Covers: /auth/login, /auth/sign-up, /auth/forgot-password
 *
 * Usage (in pages/auth/login.tsx):
 *
 * import SeoHeadAuth from "../../components/SeoHeadAuth";
 *
 * export default function LoginPage() {
 *   return (
 *     <>
 *       <SeoHeadAuth page="login" />
 *       {/* rest of the login page *\/}
 *     </>
 *   );
 * }
 *
 * Usage (in pages/auth/sign-up.tsx):
 *
 * <SeoHeadAuth page="signup" />
 *
 * Usage (in pages/auth/forgot-password.tsx):
 *
 * <SeoHeadAuth page="forgot-password" />
 *
 * To override defaults (rare — only if copy needs to change):
 *
 * <SeoHeadAuth
 *   page="login"
 *   title="Custom Login Title | Petro411"
 *   description="Custom description..."
 * />
 */
export default function SeoHeadAuth({
  page,
  title,
  description,
  url,
  allowIndexing = false,
}: SeoHeadAuthProps) {
  const defaults = AUTH_PAGE_DEFAULTS[page];

  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalUrl = url || defaults.url;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Petro411",
    url: "https://www.petro411.com/",
    logo: "https://www.petro411.com/logo-name.png",
  };

  return (
    <Head>
      {/* Basic Meta */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalUrl} />

      {/* Robots — noindex by default for auth/transactional pages */}
      <meta
        name="robots"
        content={
          allowIndexing
            ? "index, follow"
            : "noindex, nofollow, noarchive, nosnippet"
        }
      />

      {/* Open Graph (kept minimal — social previews rarely matter for auth pages) */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content="Petro411" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />

      {/* Minimal Organization schema — keeps brand identity consistent site-wide */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </Head>
  );
}