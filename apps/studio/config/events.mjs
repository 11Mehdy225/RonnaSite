export const EVENTS = {
  "rosee-de-l-hermon": {
    slug: "rosee-de-l-hermon",
    brand: "Ronna Studio",
    title: "La Rosée de l’Hermon",
    eyebrow: "Collecte vidéo",
    instruction: "Filmez en portrait, 5 à 10 secondes",
    helper: "Un moment simple, lumineux et naturel. Votre vidéo sera utilisée uniquement pour le montage de l’événement.",
    artwork: "/assets/rosee-affiche-2026.jpg",
    secondaryArtwork: "/assets/rosee-date-2026.jpg",
    eventMark: "/assets/rosee-embleme.jpg",
    quoteUrl: "https://www.ronnagroup.net/devis-express",
    storagePrefix: "ronna-studio/rosee-de-l-hermon",
    maxBytes: 250 * 1024 * 1024,
    acceptedExtensions: ["mp4", "mov"],
    acceptedMimeTypes: ["video/mp4", "video/quicktime"]
  }
};

export function getEvent(slug) {
  return EVENTS[slug] || null;
}

export function publicEvent(event) {
  if (!event) return null;
  return {
    slug: event.slug,
    brand: event.brand,
    title: event.title,
    eyebrow: event.eyebrow,
    instruction: event.instruction,
    helper: event.helper,
    artwork: event.artwork,
    secondaryArtwork: event.secondaryArtwork,
    eventMark: event.eventMark,
    quoteUrl: event.quoteUrl,
    maxBytes: event.maxBytes,
    acceptedExtensions: event.acceptedExtensions
  };
}
