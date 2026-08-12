window.mobileShowcase = (() => {
  const cohortRoot = document.querySelector("#mobileCohortCards");
  const exhibitorRoot = document.querySelector("#mobileExhibitorCards");
  const tilts = ["-1.2deg", "0.8deg", "1.1deg", "-0.7deg", "1.2deg", "-1deg"];
  const exhibitorIds = [
    "ybw-1",
    "ybw-2",
    "ybw-3",
    "grant-1",
    "grant-2",
    "grant-3",
    "demos",
    "circles",
    "eirspace",
    "robowars",
    "induct",
    "fov"
  ];

  function imageFor(item) {
    if (item.image) return { src: item.image, alt: `${item.title} photo`, position: item.imagePosition, frame: item.imageFrame };
    if (item.images && item.images[0]) return item.images[0];
    return null;
  }

  function createImage(item) {
    const image = imageFor(item);
    const frame = document.createElement("div");
    frame.className = "mobile-card-image";

    if (image) {
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt || `${item.title} photo`;
      if (image.frame === "square") frame.classList.add("square-image");
      if (image.frame === "portrait") frame.classList.add("portrait-image");
      if (image.position) img.style.objectPosition = image.position;
      frame.appendChild(img);
      return frame;
    }

    const words = item.title.split(" ");
    frame.textContent = words.length > 1 ? words.slice(0, 2).join(" ") : item.title;
    return frame;
  }

  function createCard(item, kind, index) {
    const card = document.createElement("button");
    const title = document.createElement("h3");
    const tag = document.createElement("div");
    const summary = document.createElement("p");
    const zone = document.createElement("div");

    card.type = "button";
    card.className = "mobile-card";
    card.style.setProperty("--tilt", tilts[index % tilts.length]);

    tag.className = "mobile-card-kind";
    tag.textContent = kind;

    title.className = "mobile-card-title";
    title.textContent = item.title;

    summary.className = "mobile-card-summary";
    summary.textContent = item.summary || item.details || "";

    zone.className = "mobile-card-zone";
    zone.textContent = item.zone || item.tag;

    card.append(createImage(item), tag, title, summary, zone);

    if (item.website) {
      const website = document.createElement("a");
      website.className = "mobile-card-link";
      website.href = item.website;
      website.target = "_blank";
      website.rel = "noopener";
      website.textContent = "Website";
      website.addEventListener("click", (event) => event.stopPropagation());
      card.appendChild(website);
    }

    card.addEventListener("click", () => window.popupController.open(item));
    return card;
  }

  function renderCards(root, items, kindForItem) {
    if (!root) return;
    root.innerHTML = "";
    items.forEach((item, index) => {
      root.appendChild(createCard(item, kindForItem(item, index), index));
    });
  }

  function init() {
    renderCards(cohortRoot, window.carouselProjects || [], (item) => item.tag || "Cohort team");

    const exhibitors = exhibitorIds.map((id) => window.mapItems[id]).filter(Boolean);
    renderCards(exhibitorRoot, exhibitors, (item) => item.tag || "Exhibitor");
  }

  return { init };
})();
