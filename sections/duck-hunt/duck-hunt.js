window.duckHunt = (() => {
  const storageKey = "patch-demo-day-ducks";
  const button = document.querySelector("#duckHuntButton");
  const buttonCount = document.querySelector("#duckHuntButtonCount");
  const overlay = document.querySelector("#duckHuntOverlay");
  const panel = document.querySelector("#duckHuntPanel");
  const closeButton = document.querySelector("#duckHuntClose");
  const progressText = document.querySelector("#duckProgressText");
  const progressPercent = document.querySelector("#duckProgressPercent");
  const progressFill = document.querySelector("#duckProgressFill");
  const duckGrid = document.querySelector("#duckGrid");
  const toast = document.querySelector("#duckToast");

  let collected = new Set();

  function loadCollected() {
    try {
      collected = new Set(JSON.parse(localStorage.getItem(storageKey)) || []);
    } catch {
      collected = new Set();
    }
  }

  function saveCollected() {
    localStorage.setItem(storageKey, JSON.stringify([...collected]));
  }

  function foundCount() {
    return collected.size;
  }

  function updateProgress() {
    const count = foundCount();
    const total = window.ducks.length;
    const percent = total ? Math.round((count / total) * 100) : 0;

    buttonCount.textContent = `${count}/${total}`;
    progressText.textContent = `${count} / ${total} ducks found`;
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
  }

  function renderCollection(justFoundId) {
    duckGrid.innerHTML = "";

    window.ducks.forEach((duck) => {
      const isFound = collected.has(duck.id);
      const card = document.createElement("article");
      const name = document.createElement("span");

      card.className = `duck-card${isFound ? "" : " locked"}${duck.id === justFoundId ? " just-found" : ""}`;

      if (isFound) {
        const image = document.createElement("img");
        image.src = duck.image;
        image.alt = duck.name;
        name.className = "duck-card-name";
        name.textContent = duck.name;
        card.append(image, name);
      } else {
        const mystery = document.createElement("span");
        mystery.className = "duck-mystery";
        mystery.textContent = "?";
        name.className = "duck-card-name";
        name.textContent = "???";
        card.append(mystery, name);
      }

      duckGrid.appendChild(card);
    });
  }

  function openPanel() {
    panel.classList.add("open");
    overlay.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
  }

  function closePanel() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
  }

  function showToast(duck, newlyFound) {
    const count = foundCount();
    const total = window.ducks.length;
    toast.innerHTML = `
      <strong>${newlyFound ? "Duck found!" : duck.name}</strong>
      <p>You found ${duck.name}<br>${count} / ${total} collected</p>
    `;
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      toast.classList.remove("show");
      toast.setAttribute("aria-hidden", "true");
    }, 3600);
  }

  function celebrateCompletion() {
    const confetti = document.createElement("div");
    confetti.className = "duck-confetti";

    for (let index = 0; index < 28; index++) {
      const piece = document.createElement("span");
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 360}ms`;
      piece.style.background = index % 3 === 0 ? "var(--orange)" : index % 3 === 1 ? "var(--blue)" : "var(--alumni)";
      confetti.appendChild(piece);
    }

    document.body.appendChild(confetti);
    window.setTimeout(() => confetti.remove(), 1500);
    toast.innerHTML = `
      <strong>You found all ${window.ducks.length} ducks!</strong>
      <p>Duck Hunt complete. Nicely done.</p>
    `;
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");
  }

  function collectDuck(duck) {
    const wasCollected = collected.has(duck.id);
    if (!wasCollected) {
      collected.add(duck.id);
      saveCollected();
    }

    updateProgress();
    renderCollection(wasCollected ? null : duck.id);
    showToast(duck, !wasCollected);

    if (!wasCollected && foundCount() === window.ducks.length) {
      celebrateCompletion();
    }
  }

  function handleNfcUrl() {
    const url = new URL(window.location.href);
    const duckId = url.searchParams.get("duck");
    if (!duckId) return;

    const duck = window.ducks.find((item) => item.id === duckId);
    url.searchParams.delete("duck");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

    if (duck) {
      collectDuck(duck);
      openPanel();
    }
  }

  function init() {
    loadCollected();
    updateProgress();
    renderCollection();
    handleNfcUrl();

    button.addEventListener("click", openPanel);
    closeButton.addEventListener("click", closePanel);
    overlay.addEventListener("click", closePanel);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePanel();
    });
  }

  return { init, collectDuck };
})();
