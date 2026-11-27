const tokenInput = document.querySelector("#admin-token");
const eventSelect = document.querySelector("#admin-event");
const loadButton = document.querySelector("#load-uploads");
const list = document.querySelector("#uploads-list");
const message = document.querySelector("#admin-message");
const dateFilter = document.querySelector("#admin-date-filter");
const sortSelect = document.querySelector("#admin-sort");
const clearDateButton = document.querySelector("#clear-date");
let currentItems = [];
let currentToken = "";

tokenInput.value = sessionStorage.getItem("ronnaStudioAdminToken") || "";

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function formatBytes(bytes) {
  return `${(Number(bytes || 0) / 1024 / 1024).toFixed(1)} Mo`;
}

function showMessage(text, error = false) {
  message.hidden = false;
  message.className = `status-message status-message--${error ? "error" : "success"}`;
  message.textContent = text;
}

function dateKey(value) {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Africa/Abidjan",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function dateHeading(value) {
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Abidjan",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

async function authorizedDownload(item, token) {
  if (!item.downloadUrl.includes("/api/admin/download/")) {
    window.open(item.downloadUrl, "_blank", "noopener,noreferrer");
    return;
  }
  const response = await fetch(item.downloadUrl, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error("Le téléchargement a échoué.");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = item.originalFilename || `${item.uploadId}.mp4`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function renderUploads() {
  list.innerHTML = "";
  const selectedDate = dateFilter.value;
  const direction = sortSelect.value === "oldest" ? 1 : -1;
  const items = currentItems
    .filter((item) => !selectedDate || dateKey(item.uploadedAt) === selectedDate)
    .sort((a, b) => String(a.uploadedAt).localeCompare(String(b.uploadedAt)) * direction);

  if (!items.length) {
    list.innerHTML = `<div class="admin-empty"><strong>${selectedDate ? "Aucune vidéo à cette date" : "Aucune vidéo reçue"}</strong><p>${selectedDate ? "Choisissez une autre date ou affichez toutes les dates." : "Les contributions confirmées apparaîtront ici."}</p></div>`;
    return;
  }

  const totalsByDate = items.reduce((totals, item) => {
    const key = dateKey(item.uploadedAt);
    totals.set(key, (totals.get(key) || 0) + 1);
    return totals;
  }, new Map());
  let activeDate = "";

  for (const item of items) {
    const itemDate = dateKey(item.uploadedAt);
    if (itemDate !== activeDate) {
      activeDate = itemDate;
      const heading = document.createElement("header");
      heading.className = "uploads-date-heading";
      heading.innerHTML = `<h2>${escapeHtml(dateHeading(item.uploadedAt))}</h2><span>${totalsByDate.get(itemDate)} vidéo${totalsByDate.get(itemDate) > 1 ? "s" : ""}</span>`;
      list.append(heading);
    }

    const article = document.createElement("article");
    article.className = "upload-item";
    article.innerHTML = `
      <div class="upload-item__icon">▶</div>
      <div class="upload-item__copy">
        <strong>${escapeHtml(item.firstName || "Prénom non renseigné")}</strong>
        <span>${escapeHtml(item.subgroup || "Sans sous-groupe")} · ${formatBytes(item.size)}</span>
        <small>${escapeHtml(item.originalFilename)} · ${new Date(item.uploadedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Abidjan" })}</small>
      </div>
      <button type="button">Télécharger</button>`;
    article.querySelector("button").addEventListener("click", async () => {
      try { await authorizedDownload(item, currentToken); }
      catch (error) { showMessage(error.message, true); }
    });
    list.append(article);
  }
}

dateFilter.addEventListener("change", renderUploads);
sortSelect.addEventListener("change", renderUploads);
clearDateButton.addEventListener("click", () => {
  dateFilter.value = "";
  renderUploads();
});

loadButton.addEventListener("click", async () => {
  const token = tokenInput.value.trim();
  if (!token) return showMessage("Saisissez la clé d’accès administrateur.", true);
  sessionStorage.setItem("ronnaStudioAdminToken", token);
  currentToken = token;
  loadButton.disabled = true;
  loadButton.textContent = "Chargement…";
  message.hidden = true;
  list.innerHTML = "";

  try {
    const response = await fetch(`/api/admin/uploads?event=${encodeURIComponent(eventSelect.value)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) throw new Error(data.message || "Impossible de charger les vidéos.");

    currentItems = data.items;
    renderUploads();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    loadButton.disabled = false;
    loadButton.textContent = "Actualiser la liste";
  }
});
