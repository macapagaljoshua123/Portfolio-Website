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


(function () {
  const AVATAR_IMAGES = [
    "assets/img/avatar.png",
    "assets/img/Avatar Pic 1.jpg",
    "assets/img/Avatar Pic 2.jpg",
    "assets/img/Avatar Pic 3.jpg",
  ];

  const SLIDE_INTERVAL = 5000; // every 5 seconds
  const TRANSITION_MS = 950; // must match the CSS clip-path transition duration

  document.addEventListener("DOMContentLoaded", function () {
    const stage = document.getElementById("avatarStage");
    const front = document.getElementById("avatarFront");
    const back = document.getElementById("avatarBack");
    const dotsWrap = document.getElementById("avatarDots");
    if (!stage || !front || !back) return; // markup not present, skip safely

    let current = 0;
    let timer = null;
    let isAnimating = false;

    function setActiveDot(index) {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll(".avatar-dot").forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      AVATAR_IMAGES.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.className = "avatar-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Show photo " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
        });
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(targetIndex) {
      if (isAnimating || targetIndex === current) return;
      runSlide(targetIndex);
    }

    function nextSlide() {
      if (isAnimating) return;
      const next = (current + 1) % AVATAR_IMAGES.length;
      runSlide(next);
    }

    function runSlide(targetIndex) {
      isAnimating = true;

      // Back layer always holds the photo we're sliding toward.
      back.src = AVATAR_IMAGES[targetIndex];

      // Kick off the wipe on the next frame so the browser has
      // committed the back image first.
      requestAnimationFrame(function () {
        front.classList.add("sliding");
      });

      window.setTimeout(function () {
        // Front is fully wiped away (invisible) at this point —
        // safe to swap its content and snap it back instantly.
        front.style.transition = "none";
        front.src = AVATAR_IMAGES[targetIndex];
        front.classList.remove("sliding");
        front.style.clipPath = "inset(0 0 0 0)";
        void front.offsetWidth; // force reflow so the snap applies with no transition
        front.style.clipPath = ""; // hand control back to the stylesheet
        front.style.transition = ""; // re-enable the CSS transition for next time

        current = targetIndex;
        setActiveDot(current);

        // Preload the photo after this one into the back layer.
        back.src = AVATAR_IMAGES[(current + 1) % AVATAR_IMAGES.length];
        isAnimating = false;
      }, TRANSITION_MS);
    }

    function start() {
      stop();
      timer = window.setInterval(nextSlide, SLIDE_INTERVAL);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    // ---- init ----
    front.src = AVATAR_IMAGES[0];
    back.src = AVATAR_IMAGES[1 % AVATAR_IMAGES.length];
    buildDots();
    start();

    // Pause on hover so visitors can actually look at one photo.
    stage.addEventListener("mouseenter", stop);
    stage.addEventListener("mouseleave", start);
  });
})();
// ===== SCROLL REVEAL ANIMATIONS =====
(function() {
  // Select all elements that should animate on scroll
  const revealElements = document.querySelectorAll(
    '.hero-text-panel, .about-intro, .about-card, .project-card, .contact-form-wrap, .contact-info'
  );
  
  // Add initial state
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  // Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
  
  // Also handle project cards inside the track - they're different
  const projectCards = document.querySelectorAll('.project-card');
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cardInner = entry.target.querySelector('.project-card-inner');
        if (cardInner) {
          cardInner.style.opacity = '1';
          cardInner.style.transform = 'translateY(0)';
        }
        projectObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  projectCards.forEach(card => {
    const inner = card.querySelector('.project-card-inner');
    if (inner) {
      inner.style.opacity = '0';
      inner.style.transform = 'translateY(40px)';
      inner.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    projectObserver.observe(card);
  });
  
  // Hero section - make it visible immediately with a slight delay
  setTimeout(() => {
    const heroText = document.querySelector('.hero-text-panel');
    if (heroText) {
      heroText.style.opacity = '1';
      heroText.style.transform = 'translateY(0)';
    }
  }, 100);
})();