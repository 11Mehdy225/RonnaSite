const form = document.querySelector("#upload-form");
const fileInput = document.querySelector("#video-file");
const dropZone = document.querySelector("#drop-zone");
const fileSummary = document.querySelector("#file-summary");
const selectedName = document.querySelector("#selected-name");
const selectedSize = document.querySelector("#selected-size");
const changeFile = document.querySelector("#change-file");
const submitButton = document.querySelector("#submit-button");
const progressRegion = document.querySelector("#progress-region");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");
const progressValue = document.querySelector("#progress-value");
const progressLabel = document.querySelector("#progress-label");
const statusMessage = document.querySelector("#status-message");
const firstName = document.querySelector("#first-name");
const subgroup = document.querySelector("#subgroup");

const eventSlug = location.pathname.split("/").filter(Boolean)[0] || "rosee-de-l-hermon";
let eventConfig = null;
let selectedFile = null;
let uploading = false;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(bytes > 10 * 1024 * 1024 ? 0 : 1)} Mo`;
}

function showStatus(type, message) {
  statusMessage.hidden = false;
  statusMessage.className = `status-message status-message--${type}`;
  statusMessage.innerHTML = type === "success"
    ? `<span aria-hidden="true">✓</span><div><strong>${message}</strong><small>Merci pour votre contribution.</small></div>`
    : `<span aria-hidden="true">!</span><div><strong>Envoi interrompu</strong><small>${message}</small></div>`;
}

function clearStatus() {
  statusMessage.hidden = true;
  statusMessage.textContent = "";
}

function setProgress(value, label = "Envoi en cours…") {
  const percentage = Math.max(0, Math.min(100, Math.round(value)));
  progressRegion.hidden = false;
  progressBar.style.width = `${percentage}%`;
  progressValue.textContent = `${percentage} %`;
  progressLabel.textContent = label;
  progressTrack.setAttribute("aria-valuenow", String(percentage));
}

function validateFile(file) {
  if (!eventConfig) return "La collecte n’est pas encore prête.";
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!eventConfig.acceptedExtensions.includes(extension)) return "Choisissez une vidéo au format MP4 ou MOV.";
  if (file.size > eventConfig.maxBytes) return `La vidéo dépasse la limite de ${Math.round(eventConfig.maxBytes / 1024 / 1024)} Mo.`;
  if (!file.size) return "Cette vidéo semble vide. Choisissez un autre fichier.";
  return "";
}

function selectFile(file) {
  clearStatus();
  progressRegion.hidden = true;
  const error = validateFile(file);
  if (error) {
    selectedFile = null;
    submitButton.disabled = true;
    showStatus("error", error);
    return;
  }
  selectedFile = file;
  selectedName.textContent = file.name;
  selectedSize.textContent = formatBytes(file.size);
  fileSummary.hidden = false;
  dropZone.classList.add("drop-zone--selected");
  submitButton.disabled = false;
}

function uploadWithProgress(url, file, contentType) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) setProgress((event.loaded / event.total) * 100);
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("Le transfert a été refusé par le stockage."));
    });
    xhr.addEventListener("error", () => reject(new Error("La connexion a été interrompue pendant l’envoi.")));
    xhr.addEventListener("abort", () => reject(new Error("L’envoi a été annulé.")));
    xhr.send(file);
  });
}

async function jsonRequest(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.message || "Le service est momentanément indisponible.");
  return data;
}

fileInput.addEventListener("change", () => {
  if (fileInput.files?.[0]) selectFile(fileInput.files[0]);
});

changeFile.addEventListener("click", () => {
  if (!uploading) fileInput.click();
});

for (const eventName of ["dragenter", "dragover"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (!uploading) dropZone.classList.add("drop-zone--dragging");
  });
}
for (const eventName of ["dragleave", "drop"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("drop-zone--dragging");
  });
}
dropZone.addEventListener("drop", (event) => {
  if (!uploading && event.dataTransfer.files?.[0]) selectFile(event.dataTransfer.files[0]);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedFile || uploading) return;
  const validationError = validateFile(selectedFile);
  if (validationError) return showStatus("error", validationError);

  uploading = true;
  clearStatus();
  submitButton.disabled = true;
  submitButton.textContent = "Envoi en cours…";
  fileInput.disabled = true;
  firstName.disabled = true;
  subgroup.disabled = true;
  setProgress(0);

  try {
    const prepared = await jsonRequest("/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventSlug,
        filename: selectedFile.name,
        contentType: selectedFile.type,
        size: selectedFile.size,
        firstName: firstName.value,
        subgroup: subgroup.value
      })
    });

    await uploadWithProgress(prepared.uploadUrl, selectedFile, prepared.contentType);
    setProgress(100, "Vérification du stockage…");

    const confirmed = await jsonRequest("/api/uploads/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receipt: prepared.receipt })
    });
    if (!confirmed.stored) throw new Error("Le stockage n’a pas confirmé la vidéo.");

    progressRegion.hidden = true;
    showStatus("success", confirmed.message);
    submitButton.textContent = "Vidéo envoyée";
  } catch (error) {
    progressRegion.hidden = true;
    showStatus("error", error.message || "Vérifiez votre connexion puis réessayez.");
    submitButton.disabled = false;
    submitButton.textContent = "Réessayer l’envoi";
    fileInput.disabled = false;
    firstName.disabled = false;
    subgroup.disabled = false;
    uploading = false;
  }
});

async function loadEvent() {
  try {
    const data = await jsonRequest(`/api/events/${encodeURIComponent(eventSlug)}`);
    eventConfig = data.event;
    document.title = `${eventConfig.title} — Collecte vidéo ${eventConfig.brand}`;
    document.querySelector("#event-eyebrow").textContent = eventConfig.eyebrow;
    document.querySelector("#event-instruction").textContent = eventConfig.instruction;
    document.querySelector("#event-helper").textContent = eventConfig.helper;
    document.querySelector("#event-artwork").src = eventConfig.artwork;
    document.querySelector("#event-artwork").alt = `Affiche de ${eventConfig.title}`;
    document.querySelector("#event-secondary-artwork").src = eventConfig.secondaryArtwork;
    document.querySelector("#event-mark").src = eventConfig.eventMark;
    document.querySelector("#quote-link").href = eventConfig.quoteUrl;
    document.querySelector("#file-help").textContent = `MP4 ou MOV · ${Math.round(eventConfig.maxBytes / 1024 / 1024)} Mo maximum`;
  } catch (error) {
    showStatus("error", error.message);
    fileInput.disabled = true;
  }
}

loadEvent();
