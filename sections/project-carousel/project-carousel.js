window.projectCarousel = (() => {
  const featuredPhoto = document.querySelector("#featuredPhoto");
  const featuredImage = document.querySelector("#featuredImage");
  const featuredTitle = document.querySelector("#featuredTitle");
  const featuredSummary = document.querySelector("#featuredSummary");
  const projectCounter = document.querySelector("#projectCounter");
  const prevProject = document.querySelector("#prevProject");
  const nextProject = document.querySelector("#nextProject");
  let currentProjectIndex = 0;

  function setFeaturedProject(project, index = currentProjectIndex) {
    featuredTitle.textContent = project.title;
    featuredSummary.textContent = project.summary;
    projectCounter.textContent = `${index + 1} / ${window.carouselProjects.length}`;

    if (project.image) {
      featuredImage.src = project.image;
      featuredImage.alt = `${project.title} project photo`;
      featuredImage.style.objectPosition = project.imagePosition || "";
      featuredPhoto.classList.toggle("square-image", project.imageFrame === "square");
      featuredPhoto.classList.toggle("portrait-image", project.imageFrame === "portrait");
      featuredPhoto.classList.add("has-image");
    } else {
      featuredImage.removeAttribute("src");
      featuredImage.alt = "";
      featuredImage.style.objectPosition = "";
      featuredPhoto.classList.remove("square-image");
      featuredPhoto.classList.remove("portrait-image");
      featuredPhoto.classList.remove("has-image");
    }
  }

  function currentProject() {
    return window.carouselProjects[currentProjectIndex];
  }

  function move(direction) {
    currentProjectIndex = (currentProjectIndex + direction + window.carouselProjects.length) % window.carouselProjects.length;
    setFeaturedProject(currentProject(), currentProjectIndex);
  }

  function init() {
    prevProject.addEventListener("click", () => move(-1));
    nextProject.addEventListener("click", () => move(1));
    featuredPhoto.addEventListener("click", () => window.popupController.open(currentProject()));
    featuredTitle.addEventListener("click", () => window.popupController.open(currentProject()));
    setFeaturedProject(currentProject(), currentProjectIndex);
  }

  return { init, move, currentProject };
})();
