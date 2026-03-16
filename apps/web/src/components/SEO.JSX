import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "RONNA GROUP",
  description = "RONNA GROUP — Groupe multidisciplinaire en Côte d’Ivoire.",
  canonical,
  image = "/og.jpg",
  type = "website",
}) {
  const fullTitle = title.includes("RONNA") ? title : `${title} | RONNA GROUP`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}