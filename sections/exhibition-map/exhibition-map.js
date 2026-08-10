window.exhibitionMap = (() => {
  const zones = [...document.querySelectorAll(".zone")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];

  function openZone(zone) {
    const project = window.mapItems[zone.dataset.id];
    if (project) window.popupController.open(project);
  }

  function filterZones(filter) {
    zones.forEach((zone) => {
      const visible = filter === "all" || zone.dataset.category === filter;
      zone.style.opacity = visible ? "1" : "0.22";
    });
  }

  function init() {
    zones.forEach((zone) => {
      zone.addEventListener("click", () => openZone(zone));
      zone.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openZone(zone);
        }
      });
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => filterZones(button.dataset.filter));
    });
  }

  return { init, filterZones };
})();
