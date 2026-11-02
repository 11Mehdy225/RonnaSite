import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "RONNA GROUP",
  description = "RONNA GROUP — Groupe multidisciplinaire en Côte d’Ivoire.",
  canonical,
  image = "/favicon.PNG",
  type = "website",
  structuredData,
}) {
  const siteUrl = "https://ronnagroup.net";
  const fullTitle = title.includes("RONNA") ? title : `${title} | RONNA GROUP`;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;
  const schema = structuredData || {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RONNA GROUP",
    url: siteUrl,
    logo: `${siteUrl}/favicon.PNG`,
    description,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fr_CI" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
