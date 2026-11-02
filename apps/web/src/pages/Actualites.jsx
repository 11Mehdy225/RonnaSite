import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { apiUrl } from "../lib/api.js";

const CATEGORIES = [
  { value: "COMMUNIQUE", label: "Communiqués" },
  { value: "PROJET", label: "Projets" },
  { value: "MEDIA", label: "Média" },
  { value: "EVENEMENT", label: "Événements" },
  { value: "FONDATION", label: "Fondation" }
];

function categoryLabel(category) {
  return CATEGORIES.find((item) => item.value === category)?.label.replace(/s$/, "") || "Actualité";
}

function formatDate(value) {
  if (!value) return "Date à venir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date à venir";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function readingTime(item) {
  const words = `${item.title || ""} ${item.excerpt || ""}`.trim().split(/\s+/).length;
  return `${Math.max(2, Math.ceil(words / 180))} min de lecture`;
}

function NewsImage({ item, featured = false }) {
  return (
    <div className={`rg-news__media${featured ? " rg-news__media--featured" : ""}`}>
      <span className="rg-news__image-mark" aria-hidden="true">RG</span>
      {item.coverImage && (
        <img
          src={item.coverImage}
          alt={item.title || "Actualité RONNA GROUP"}
          loading={featured ? "eager" : "lazy"}
          onError={(event) => { event.currentTarget.style.display = "none"; }}
        />
      )}
      <span className="rg-news__badge">{categoryLabel(item.category)}</span>
    </div>
  );
}

export default function Actualites() {
  const [activeCategory, setActiveCategory] = useState("TOUT");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const limit = 9;

  useEffect(() => { document.title = "Ronna Group | Actualités"; }, []);

  const query = useMemo(() => {
    const params = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (activeCategory !== "TOUT") params.set("category", activeCategory);
    return params.toString();
  }, [activeCategory, page]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(apiUrl(`/api/news?${query}`));
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data?.ok === false) throw new Error(data?.message || "Le contenu est momentanément indisponible.");
        if (cancelled) return;

        const nextItems = data.items || [];
        setItems((previous) => page === 1 ? nextItems : [...previous, ...nextItems]);
        setTotalPages(data.totalPages || 1);

        if (activeCategory === "TOUT") {
          setAvailableCategories((previous) => [
            ...new Set([...previous, ...nextItems.map((item) => item.category).filter(Boolean)])
          ]);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError?.message || "Une erreur réseau est survenue.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [query, page, activeCategory, reloadKey]);

  function changeCategory(category) {
    setActiveCategory(category);
    setPage(1);
    setItems([]);
  }

  const visibleCategories = CATEGORIES.filter((category) => availableCategories.includes(category.value));
  const featured = items[0];
  const remaining = items.slice(1);
  const canLoadMore = page < totalPages && !loading;

  return (
    <>
      <SEO
        title="Actualités | Ronna Group"
        description="Découvrez les projets, partenariats, annonces et initiatives de RONNA GROUP."
        canonical="https://www.ronnagroup.net/actualites"
      />
      <main className="rg-news">
        <header className="rg-news__hero">
          <div className="rg-news__hero-inner">
            <span className="rg-news__kicker">Le journal du groupe</span>
            <h1>Nos actualités</h1>
            <p>
              Suivez les projets, partenariats et initiatives qui façonnent
              le développement de RONNA GROUP et de ses partenaires.
            </p>
            {visibleCategories.length > 0 && (
              <div className="rg-news__filters" aria-label="Filtrer les actualités">
                <button className={activeCategory === "TOUT" ? "is-active" : ""} onClick={() => changeCategory("TOUT")}>Toutes</button>
                {visibleCategories.map((category) => (
                  <button
                    key={category.value}
                    className={activeCategory === category.value ? "is-active" : ""}
                    onClick={() => changeCategory(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <section className="rg-news__content">
          {error && (
            <div className="rg-news__state">
              <span>Contenu indisponible</span>
              <h2>Nous ne pouvons pas afficher les actualités pour le moment.</h2>
              <p>{error}</p>
              <button onClick={() => setReloadKey((key) => key + 1)}>Réessayer</button>
            </div>
          )}

          {!error && loading && items.length === 0 && (
            <div className="rg-news__skeletons" aria-label="Chargement des actualités">
              <div /><div /><div />
            </div>
          )}

          {!error && !loading && items.length === 0 && (
            <div className="rg-news__state">
              <span>À très bientôt</span>
              <h2>Nos prochaines actualités seront publiées prochainement.</h2>
              <p>En attendant, découvrez nos expertises ou échangez avec notre équipe.</p>
              <Link to="/services">Découvrir nos services</Link>
            </div>
          )}

          {!error && featured && (
            <>
              <Link to={featured.slug ? `/actualites/${featured.slug}` : "/actualites"} className="rg-news__featured">
                <NewsImage item={featured} featured />
                <div className="rg-news__featured-copy">
                  <div className="rg-news__meta">
                    <span>{formatDate(featured.publishedAt || featured.createdAt)}</span>
                    <i />
                    <span>{readingTime(featured)}</span>
                  </div>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <strong>Lire l’article <span>→</span></strong>
                </div>
              </Link>

              {remaining.length > 0 && (
                <div className="rg-news__grid">
                  {remaining.map((item) => (
                    <Link key={item._id} to={item.slug ? `/actualites/${item.slug}` : "/actualites"} className="rg-news__card">
                      <NewsImage item={item} />
                      <div className="rg-news__card-copy">
                        <div className="rg-news__meta">
                          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                          <i />
                          <span>{readingTime(item)}</span>
                        </div>
                        <h2>{item.title}</h2>
                        <p>{item.excerpt}</p>
                        <strong>Lire la suite <span>→</span></strong>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {canLoadMore && (
                <div className="rg-news__more">
                  <button onClick={() => setPage((current) => current + 1)}>
                    {loading ? "Chargement…" : "Afficher plus d’actualités"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <aside className="rg-news__follow">
          <div>
            <span>Restez connecté</span>
            <h2>Suivez les projets et initiatives de RONNA GROUP.</h2>
          </div>
          <div className="rg-news__follow-actions">
            <a href="https://www.instagram.com/ronna_group" target="_blank" rel="noreferrer">Nous suivre sur Instagram ↗</a>
            <Link to="/contact">Contacter notre équipe</Link>
          </div>
        </aside>
      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
.rg-news { min-height: 100vh; padding-top: 110px; color: #fff; background: linear-gradient(180deg, rgba(3,10,26,.98), rgba(5,18,45,.98) 52%, rgba(3,10,26,.98)); }
.rg-news a { text-decoration: none; }
.rg-news__hero { border-bottom: 1px solid rgba(255,255,255,.08); }
.rg-news__hero-inner { max-width: 1164px; margin: 0 auto; padding: 48px 28px 34px; }
.rg-news__kicker, .rg-news__state > span, .rg-news__follow > div > span { color: #88aaff; font-size: 11px; font-weight: 900; letter-spacing: 1.8px; text-transform: uppercase; }
.rg-news__hero h1 { margin: 9px 0 12px; font-size: clamp(40px, 7vw, 72px); line-height: .98; letter-spacing: -2.5px; }
.rg-news__hero p { max-width: 680px; margin: 0; color: rgba(255,255,255,.7); font-size: 17px; line-height: 1.7; }
.rg-news__filters { display: flex; gap: 8px; margin-top: 24px; overflow-x: auto; scrollbar-width: none; }
.rg-news__filters::-webkit-scrollbar { display: none; }
.rg-news__filters button { flex: 0 0 auto; padding: 9px 13px; border: 1px solid rgba(255,255,255,.12); border-radius: 999px; background: rgba(255,255,255,.035); color: rgba(255,255,255,.72); cursor: pointer; font: inherit; font-size: 12px; }
.rg-news__filters button.is-active { background: #1f4fd8; border-color: #416ee8; color: #fff; }
.rg-news__content { max-width: 1164px; min-height: 340px; margin: 0 auto; padding: 34px 28px 70px; }
.rg-news__featured { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(310px, .85fr); overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 26px; background: rgba(255,255,255,.035); color: #fff; transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
.rg-news__featured:hover { transform: translateY(-4px); border-color: rgba(122,159,255,.38); box-shadow: 0 26px 70px rgba(0,0,0,.25); }
.rg-news__media { position: relative; min-height: 220px; overflow: hidden; background: radial-gradient(circle at 20% 20%, rgba(61,105,223,.7), transparent 38%), linear-gradient(135deg, #0a1d47, #071127); }
.rg-news__media--featured { min-height: 410px; }
.rg-news__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.rg-news__featured:hover img, .rg-news__card:hover img { transform: scale(1.025); }
.rg-news__image-mark { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.12); font-size: 68px; font-weight: 950; letter-spacing: 8px; }
.rg-news__badge { position: absolute; z-index: 1; top: 14px; left: 14px; padding: 7px 10px; border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: rgba(3,10,26,.78); color: #fff; font-size: 11px; font-weight: 800; backdrop-filter: blur(9px); }
.rg-news__featured-copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(28px, 5vw, 52px); }
.rg-news__meta { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,.54); font-size: 11px; }
.rg-news__meta i { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,.4); }
.rg-news__featured h2 { margin: 18px 0 13px; font-size: clamp(27px, 3.5vw, 42px); line-height: 1.08; letter-spacing: -1px; }
.rg-news__featured p, .rg-news__card p { display: -webkit-box; overflow: hidden; margin: 0; color: rgba(255,255,255,.68); line-height: 1.7; -webkit-box-orient: vertical; }
.rg-news__featured p { -webkit-line-clamp: 4; }
.rg-news__featured strong, .rg-news__card strong { margin-top: 24px; color: #92b0ff; font-size: 13px; }
.rg-news__featured strong span, .rg-news__card strong span { display: inline-block; margin-left: 4px; transition: transform .18s ease; }
.rg-news__featured:hover strong span, .rg-news__card:hover strong span { transform: translateX(4px); }
.rg-news__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 18px; }
.rg-news__card { display: grid; grid-template-columns: minmax(180px, .8fr) minmax(0, 1fr); overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 22px; background: rgba(255,255,255,.03); color: #fff; transition: transform .2s ease, border-color .2s ease; }
.rg-news__card:hover { transform: translateY(-3px); border-color: rgba(122,159,255,.34); }
.rg-news__card-copy { display: flex; flex-direction: column; align-items: flex-start; padding: 22px; }
.rg-news__card h2 { margin: 13px 0 9px; font-size: 20px; line-height: 1.2; }
.rg-news__card p { font-size: 13.5px; -webkit-line-clamp: 3; }
.rg-news__card strong { margin-top: auto; padding-top: 15px; }
.rg-news__more { display: flex; justify-content: center; margin-top: 28px; }
.rg-news__more button, .rg-news__state button, .rg-news__state a { padding: 12px 17px; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; background: rgba(255,255,255,.06); color: #fff; cursor: pointer; font: inherit; font-weight: 800; }
.rg-news__state { padding: 68px 24px; border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: rgba(255,255,255,.03); text-align: center; }
.rg-news__state h2 { max-width: 620px; margin: 12px auto; font-size: clamp(24px, 4vw, 36px); }
.rg-news__state p { margin: 0 auto 24px; color: rgba(255,255,255,.65); }
.rg-news__skeletons { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; }
.rg-news__skeletons div { min-height: 340px; border-radius: 24px; background: linear-gradient(100deg, rgba(255,255,255,.03) 20%, rgba(255,255,255,.08) 40%, rgba(255,255,255,.03) 60%); background-size: 200% 100%; animation: rg-news-loading 1.3s infinite; }
.rg-news__follow { max-width: 1108px; margin: 0 auto 70px; padding: 32px; display: flex; align-items: center; justify-content: space-between; gap: 28px; border: 1px solid rgba(107,145,242,.25); border-radius: 24px; background: linear-gradient(120deg, rgba(31,79,216,.2), rgba(255,255,255,.035)); }
.rg-news__follow h2 { max-width: 650px; margin: 8px 0 0; font-size: clamp(22px, 3vw, 32px); }
.rg-news__follow-actions { display: flex; gap: 9px; flex-shrink: 0; }
.rg-news__follow-actions a { padding: 12px 14px; border: 1px solid rgba(255,255,255,.13); border-radius: 999px; color: #fff; font-size: 12px; font-weight: 800; }
.rg-news__follow-actions a:first-child { background: #1f4fd8; }
@keyframes rg-news-loading { to { background-position-x: -200%; } }
@media (max-width: 950px) {
  .rg-news__featured { grid-template-columns: 1fr; }
  .rg-news__media--featured { min-height: 380px; }
  .rg-news__grid { grid-template-columns: 1fr; }
  .rg-news__follow { margin-inline: 28px; align-items: flex-start; flex-direction: column; }
}
@media (max-width: 650px) {
  .rg-news { padding-top: 88px; }
  .rg-news__hero-inner { padding: 38px 18px 28px; }
  .rg-news__hero h1 { letter-spacing: -1.5px; }
  .rg-news__hero p { font-size: 15px; }
  .rg-news__content { padding: 22px 18px 52px; }
  .rg-news__media--featured { min-height: 260px; }
  .rg-news__featured-copy { padding: 24px 20px 28px; }
  .rg-news__card { grid-template-columns: 1fr; }
  .rg-news__card .rg-news__media { min-height: 220px; }
  .rg-news__follow { margin: 0 18px 52px; padding: 25px 20px; }
  .rg-news__follow-actions { width: 100%; flex-direction: column; }
  .rg-news__follow-actions a { text-align: center; }
  .rg-news__skeletons { grid-template-columns: 1fr; }
  .rg-news__skeletons div:not(:first-child) { display: none; }
}
`;
