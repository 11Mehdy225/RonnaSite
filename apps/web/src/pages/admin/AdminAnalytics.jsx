import { useEffect, useMemo, useState } from "react";

const eventLabel = {
  page_view: "Pages vues", tool_click: "Clics vers un outil", tool_started: "Outils commencés", tool_completed: "Résultats obtenus",
  quote_submitted: "Demandes envoyées", whatsapp_click: "Clics WhatsApp", phone_click: "Clics téléphone", email_click: "Clics email"
};

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [builder, setBuilder] = useState({ path: "/outils", source: "facebook", medium: "paid_social", campaign: "", content: "" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/analytics?days=${days}`, { credentials: "include" })
      .then(async (response) => {
        const json = await response.json().catch(() => ({}));
        if (!response.ok || json?.ok === false) throw new Error(json?.message || "Impossible de charger les statistiques.");
        if (!cancelled) setData(json);
      })
      .catch((loadError) => { if (!cancelled) setError(loadError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [days]);

  const events = useMemo(() => Object.fromEntries((data?.byEvent || []).map((item) => [item._id, item.count])), [data]);
  const campaignUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (builder.source.trim()) params.set("utm_source", builder.source.trim());
    if (builder.medium.trim()) params.set("utm_medium", builder.medium.trim());
    if (builder.campaign.trim()) params.set("utm_campaign", builder.campaign.trim());
    if (builder.content.trim()) params.set("utm_content", builder.content.trim());
    const path = builder.path.startsWith("/") ? builder.path : `/${builder.path}`;
    return `https://www.ronnagroup.net${path}?${params.toString()}`;
  }, [builder]);

  async function copyUrl() {
    await navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <div className="rg-campaigns">
    <header><div><span>Mesure des campagnes</span><h1>Acquisition et conversions</h1><p>Suivez les visites, l’utilisation des outils et les demandes attribuées à chaque lien publicitaire.</p></div><select value={days} onChange={(e) => { setLoading(true); setError(""); setDays(Number(e.target.value)); }}><option value="7">7 derniers jours</option><option value="30">30 derniers jours</option><option value="90">90 derniers jours</option></select></header>

    {error && <div className="rg-campaigns__error">{error}</div>}
    {loading ? <div className="rg-campaigns__empty">Chargement…</div> : <>
      <section className="rg-campaigns__kpis">
        {["page_view", "tool_started", "tool_completed", "quote_submitted", "whatsapp_click"].map((event) => <article key={event}><span>{eventLabel[event]}</span><strong>{events[event] || 0}</strong></article>)}
      </section>

      <section className="rg-campaigns__panel">
        <div className="rg-campaigns__title"><div><span>Performance par campagne</span><h2>D’où viennent les résultats ?</h2></div><small>Une visite peut générer plusieurs événements.</small></div>
        {(data?.byCampaign || []).length ? <div className="rg-campaigns__table-wrap"><table><thead><tr><th>Campagne</th><th>Source</th><th>Support</th><th>Pages vues</th><th>Outils lancés</th><th>Résultats</th><th>Demandes</th><th>Conversion</th></tr></thead><tbody>
          {data.byCampaign.map((row, index) => { const conversion = row.pageViews ? ((row.leads / row.pageViews) * 100).toFixed(1) : "0.0"; return <tr key={`${row._id?.source}-${row._id?.name}-${index}`}><td><strong>{row._id?.name === "not_set" ? "Sans campagne" : row._id?.name}</strong></td><td>{row._id?.source || "direct"}</td><td>{row._id?.medium || "none"}</td><td>{row.pageViews || 0}</td><td>{row.toolStarts || 0}</td><td>{row.toolCompletions || 0}</td><td>{row.leads || 0}</td><td><b>{conversion}%</b></td></tr>; })}
        </tbody></table></div> : <div className="rg-campaigns__empty">Les premières données apparaîtront après les visites sur vos liens de campagne.</div>}
      </section>

      <div className="rg-campaigns__two">
        <section className="rg-campaigns__panel"><div className="rg-campaigns__title"><div><span>Contenus</span><h2>Pages les plus consultées</h2></div></div>{(data?.topPages || []).length ? <ol className="rg-campaigns__list">{data.topPages.map((item) => <li key={item._id}><span>{item._id}</span><strong>{item.count}</strong></li>)}</ol> : <div className="rg-campaigns__empty">Aucune donnée.</div>}</section>
        <section className="rg-campaigns__panel"><div className="rg-campaigns__title"><div><span>Canaux</span><h2>Supports détectés</h2></div></div>{(data?.byMedium || []).length ? <ol className="rg-campaigns__list">{data.byMedium.map((item) => <li key={item._id}><span>{item._id === "none" ? "Accès direct" : item._id}</span><strong>{item.count} événements • {item.leads || 0} demande(s)</strong></li>)}</ol> : <div className="rg-campaigns__empty">Aucune donnée.</div>}</section>
      </div>
    </>}

    <section className="rg-campaigns__builder">
      <div><span>Créateur de lien UTM</span><h2>Préparez un lien mesurable pour une publicité.</h2><p>Utilisez un nom de campagne simple sans accents, par exemple <code>audit_novembre</code>.</p></div>
      <div className="rg-campaigns__fields">
        <label><span>Page de destination</span><select value={builder.path} onChange={(e) => setBuilder({ ...builder, path: e.target.value })}><option value="/outils">Tous les outils</option><option value="/audit-express">Audit Express</option><option value="/devis-express">Devis Express</option><option value="/cahier-des-charges">Cahier des charges</option><option value="/diagnostic-visibilite">Diagnostic visibilité</option><option value="/calculateur-roi">Calculateur ROI</option><option value="/plan-transformation">Plan de transformation</option><option value="/contact">Contact</option></select></label>
        <label><span>Source</span><select value={builder.source} onChange={(e) => setBuilder({ ...builder, source: e.target.value })}><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="google">Google</option><option value="linkedin">LinkedIn</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select></label>
        <label><span>Support</span><select value={builder.medium} onChange={(e) => setBuilder({ ...builder, medium: e.target.value })}><option value="paid_social">Publicité sociale</option><option value="cpc">Recherche payante</option><option value="social">Publication gratuite</option><option value="email">Email</option><option value="referral">Partenaire</option></select></label>
        <label><span>Nom de campagne</span><input value={builder.campaign} onChange={(e) => setBuilder({ ...builder, campaign: e.target.value })} placeholder="audit_novembre" /></label>
        <label className="wide"><span>Variante de publicité <small>(facultatif)</small></span><input value={builder.content} onChange={(e) => setBuilder({ ...builder, content: e.target.value })} placeholder="video_1, image_bleue…" /></label>
      </div>
      <div className="rg-campaigns__url"><code>{campaignUrl}</code><button type="button" onClick={copyUrl} disabled={!builder.campaign.trim()}>{copied ? "Lien copié ✓" : "Copier le lien"}</button></div>
    </section>
    <style>{css}</style>
  </div>;
}

const css = `
.rg-campaigns{max-width:1180px;margin:0 auto;color:#fff}.rg-campaigns *{box-sizing:border-box;min-width:0}.rg-campaigns>header{display:flex;align-items:end;justify-content:space-between;gap:20px}.rg-campaigns>header>div>span,.rg-campaigns__title>div>span,.rg-campaigns__builder>div>span{color:#87a9ff;font-size:10px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase}.rg-campaigns h1{margin:5px 0 7px;font-size:30px}.rg-campaigns header p,.rg-campaigns__builder>div>p{margin:0;color:rgba(255,255,255,.58);font-size:12px;line-height:1.6}.rg-campaigns select,.rg-campaigns input{padding:11px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:#07152f;color:#fff;font:inherit}.rg-campaigns__kpis{margin-top:18px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}.rg-campaigns__kpis article{padding:16px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(255,255,255,.03)}.rg-campaigns__kpis span{display:block;color:rgba(255,255,255,.58);font-size:10px}.rg-campaigns__kpis strong{display:block;margin-top:7px;font-size:29px}.rg-campaigns__panel,.rg-campaigns__builder{margin-top:13px;padding:20px;border:1px solid rgba(255,255,255,.1);border-radius:19px;background:rgba(255,255,255,.025)}.rg-campaigns__title{display:flex;align-items:end;justify-content:space-between;gap:15px}.rg-campaigns__title h2,.rg-campaigns__builder h2{margin:5px 0 0;font-size:20px}.rg-campaigns__title>small{color:rgba(255,255,255,.4);font-size:9px}.rg-campaigns__table-wrap{margin-top:15px;overflow-x:auto}.rg-campaigns table{width:100%;border-collapse:collapse;font-size:11px}.rg-campaigns th,.rg-campaigns td{padding:11px 9px;border-bottom:1px solid rgba(255,255,255,.08);text-align:left;white-space:nowrap}.rg-campaigns th{color:rgba(255,255,255,.45);font-size:9px;text-transform:uppercase}.rg-campaigns td{color:rgba(255,255,255,.7)}.rg-campaigns td b{color:#92afff}.rg-campaigns__two{display:grid;grid-template-columns:1fr 1fr;gap:13px}.rg-campaigns__list{padding:0;margin:12px 0 0;list-style:none}.rg-campaigns__list li{padding:9px 0;display:flex;justify-content:space-between;gap:15px;border-bottom:1px solid rgba(255,255,255,.07);font-size:11px}.rg-campaigns__list li span{color:rgba(255,255,255,.66);overflow:hidden;text-overflow:ellipsis}.rg-campaigns__list li strong{color:#a3bcff;font-size:10px;text-align:right}.rg-campaigns__empty,.rg-campaigns__error{margin-top:13px;padding:14px;border-radius:13px;background:rgba(255,255,255,.03);color:rgba(255,255,255,.55);font-size:11px}.rg-campaigns__error{border:1px solid rgba(248,113,113,.25);color:#ffabab}.rg-campaigns__builder{background:linear-gradient(120deg,rgba(31,79,216,.12),rgba(255,255,255,.025))}.rg-campaigns__builder code{color:#9eb9ff}.rg-campaigns__fields{margin-top:17px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.rg-campaigns__fields label>span{display:block;margin-bottom:6px;color:rgba(255,255,255,.6);font-size:10px}.rg-campaigns__fields label>*:last-child{width:100%}.rg-campaigns__fields .wide{grid-column:1/-1}.rg-campaigns__url{margin-top:10px;padding:10px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(3,10,26,.45)}.rg-campaigns__url code{flex:1;overflow-wrap:anywhere;font-size:9px}.rg-campaigns__url button{flex:0 0 auto;padding:10px 13px;border:0;border-radius:999px;background:#1f4fd8;color:#fff;font-weight:800;cursor:pointer}.rg-campaigns__url button:disabled{opacity:.4}
@media(max-width:800px){.rg-campaigns>header{align-items:stretch;flex-direction:column}.rg-campaigns__kpis{grid-template-columns:1fr 1fr}.rg-campaigns__two,.rg-campaigns__fields{grid-template-columns:1fr}.rg-campaigns__fields>*{grid-column:1!important}.rg-campaigns__url{align-items:stretch;flex-direction:column}.rg-campaigns__url button{width:100%}}
`;
