window.popupController = (() => {
  const popup = document.querySelector("#popup");
  const popupTitle = document.querySelector("#popupTitle");
  const popupSelected = document.querySelector("#popupSelected");
  const popupTag = document.querySelector("#popupTag");
  const popupImage = document.querySelector("#popupImage");
  const popupCopy = document.querySelector("#popupCopy");
  const popupZone = document.querySelector("#popupZone");
  const closeButton = document.querySelector(".close");
  const meta = document.querySelector(".meta");
  let websitePill;
  let tabList;

  function setPopupCopy(project) {
    popupCopy.innerHTML = "";

    if (project.summaryPoints) {
      const list = document.createElement("ul");
      list.className = "popup-summary-list";

      project.summaryPoints.forEach((point) => {
        const item = document.createElement("li");
        item.textContent = point;
        list.appendChild(item);
      });

      popupCopy.appendChild(list);
      return;
    }

    if (project.sections) {
      project.sections.forEach((section) => {
        const wrapper = document.createElement("section");
        const heading = document.createElement("h3");
        const paragraph = document.createElement("p");

        wrapper.className = "popup-section";
        heading.textContent = section.heading;
        paragraph.textContent = section.text;

        wrapper.append(heading, paragraph);
        popupCopy.appendChild(wrapper);
      });
      return;
    }

    const paragraph = document.createElement("p");
    paragraph.textContent = project.details;
    popupCopy.appendChild(paragraph);
  }

  function renderImage(project) {
    popupImage.innerHTML = "";
    popupImage.classList.remove("has-image", "gallery", "portrait-image");

    if (project.images) {
      popupImage.classList.add("has-image", "gallery");
      project.images.forEach((image) => {
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.alt || `${project.title} project photo`;
        popupImage.appendChild(img);
      });
      return;
    }

    if (project.image) {
      const img = document.createElement("img");
      img.src = project.image;
      img.alt = `${project.title} project photo`;
      if (project.imagePosition) img.style.objectPosition = project.imagePosition;
      if (project.imageFrame === "portrait") popupImage.classList.add("portrait-image");
      popupImage.classList.add("has-image");
      popupImage.appendChild(img);
      return;
    }

    const placeholder = document.createElement("span");
    placeholder.textContent = project.title;
    popupImage.appendChild(placeholder);
  }

  function renderProject(project, group) {
    popupTitle.textContent = group ? group.title : project.title;
    popupSelected.textContent = project.title;
    popupSelected.hidden = !group;
    popupTag.textContent = project.tag;
    setPopupCopy(project);
    popupZone.textContent = group ? group.title : project.zone;
    renderImage(project);
    renderWebsite(project);
  }

  function renderWebsite(project) {
    if (websitePill) {
      websitePill.remove();
      websitePill = null;
    }

    if (!project.website) return;

    websitePill = document.createElement("a");
    websitePill.className = "pill website-pill";
    websitePill.href = project.website;
    websitePill.target = "_blank";
    websitePill.rel = "noopener";
    websitePill.textContent = "Website";
    meta.appendChild(websitePill);
  }

  function clearTabs() {
    if (tabList) {
      tabList.remove();
      tabList = null;
    }
  }

  function renderTabs(group) {
    clearTabs();

    if (!group.tabs) return false;

    const tabProjects = group.tabs.map((id) => window.mapItems[id]).filter(Boolean);
    if (!tabProjects.length) return false;

    tabList = document.createElement("div");
    tabList.className = "popup-tabs";
    tabList.setAttribute("role", "tablist");
    tabList.setAttribute("aria-label", `${group.title} options`);

    tabProjects.forEach((tabProject, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "popup-tab";
      button.textContent = tabProject.title;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", index === 0 ? "true" : "false");

      button.addEventListener("click", () => {
        [...tabList.querySelectorAll(".popup-tab")].forEach((tab) => {
          tab.setAttribute("aria-selected", tab === button ? "true" : "false");
        });
        renderProject(tabProject, group);
      });

      tabList.appendChild(button);
    });

    popupImage.before(tabList);
    renderProject(tabProjects[0], group);
    return true;
  }

  function open(project) {
    const hasTabs = renderTabs(project);
    if (!hasTabs) {
      clearTabs();
      renderProject(project);
    }

    popup.classList.add("open");
    popup.setAttribute("aria-hidden", "false");
    closeButton.focus();
  }

  function close() {
    popup.classList.remove("open");
    popup.setAttribute("aria-hidden", "true");
  }

  function init() {
    closeButton.addEventListener("click", close);
    popup.addEventListener("click", (event) => {
      if (event.target === popup) close();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  return { init, open, close };
})();
