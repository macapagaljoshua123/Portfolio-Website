(function () {
  // ----- NAVBAR SCROLL -----
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  // ----- SIDEBAR -----
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const hamburger = document.getElementById("hamburger");
  const closeBtn = document.getElementById("sidebarClose");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);
  sidebarLinks.forEach((link) =>
    link.addEventListener("click", closeSidebar),
  );

  // ----- SMOOTH SCROLL -----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ----- PROJECTS SWIPEABLE CAROUSEL -----
  const projectsTrack = document.getElementById("projectsTrack");
  const projectCards = projectsTrack.querySelectorAll(".project-card");
  const totalProjectSlides = projectCards.length;
  let currentProject = 0;
  let projectInterval;

  const projPrevBtn = document.getElementById("projPrev");
  const projNextBtn = document.getElementById("projNext");
  const projDotsContainer = document.getElementById("projDots");

  // Generate dots dynamically
  projectCards.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.classList.add("proj-dot");
    if (idx === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Go to project ${idx + 1}`);
    dot.addEventListener("click", () => {
      goToProjectSlide(idx);
      startProjectAutoPlay();
    });
    projDotsContainer.appendChild(dot);
  });

  const projDots = projDotsContainer.querySelectorAll(".proj-dot");

  function goToProjectSlide(index) {
    if (index < 0) index = totalProjectSlides - 1;
    if (index >= totalProjectSlides) index = 0;
    currentProject = index;
    projectsTrack.style.transform = `translateX(-${currentProject * 100}%)`;
    projDots.forEach((d, i) =>
      d.classList.toggle("active", i === currentProject),
    );
  }

  function nextProjectSlide() {
    goToProjectSlide(currentProject + 1);
  }
  function prevProjectSlide() {
    goToProjectSlide(currentProject - 1);
  }

  projPrevBtn.addEventListener("click", () => {
    prevProjectSlide();
    startProjectAutoPlay();
  });
  projNextBtn.addEventListener("click", () => {
    nextProjectSlide();
    startProjectAutoPlay();
  });

  // Autoplay
  function startProjectAutoPlay() {
    if (projectInterval) clearInterval(projectInterval);
    projectInterval = setInterval(nextProjectSlide, 5000); // 5 seconds per slide
  }
  function stopProjectAutoPlay() {
    if (projectInterval) clearInterval(projectInterval);
  }

  const projectsViewport = document.querySelector(".projects-viewport");
  projectsViewport.addEventListener("mouseenter", stopProjectAutoPlay);
  projectsViewport.addEventListener("mouseleave", startProjectAutoPlay);

  // Touch/Swipe Support
  let pTouchStartX = 0,
    pTouchEndX = 0;
  projectsViewport.addEventListener(
    "touchstart",
    (e) => {
      pTouchStartX = e.changedTouches[0].screenX;
      stopProjectAutoPlay();
    },
    { passive: true },
  );

  projectsViewport.addEventListener(
    "touchend",
    (e) => {
      pTouchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startProjectAutoPlay();
    },
    { passive: true },
  );

  function handleSwipe() {
    if (pTouchEndX < pTouchStartX - 50) nextProjectSlide();
    if (pTouchEndX > pTouchStartX + 50) prevProjectSlide();
  }

  // Start AutoPlay
  startProjectAutoPlay();
})();