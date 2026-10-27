/* GlassLauncher — official site
   Small, dependency-free interactions. */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     Navigation
     ------------------------------------------------------------------------ */

  const nav = $("#nav");
  const navLinks = $("#navLinks");
  const navBurger = $("#navBurger");

  const setNavState = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    navBurger.setAttribute("aria-expanded", "false");
    navBurger.setAttribute("aria-label", "Открыть меню");
  };

  navBurger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navBurger.setAttribute("aria-expanded", String(open));
    navBurger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });

  $$("a", navLinks).forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("is-open")) return;
    if (!nav.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  /* ------------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------------ */

  const revealItems = $$("[data-reveal]");

  revealItems.forEach((item) => {
    const siblings = Array.from(item.parentElement.children).filter((child) =>
      child.hasAttribute("data-reveal")
    );
    const index = siblings.indexOf(item);
    if (index > 0) item.style.transitionDelay = `${Math.min(index * 65, 280)}ms`;
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ------------------------------------------------------------------------
     Scroll spy
     ------------------------------------------------------------------------ */

  const sectionLinks = $$(".nav__links a");
  const sections = sectionLinks
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const section = $(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sections.find((item) => item.section === entry.target);
          if (!match) return;
          sectionLinks.forEach((link) => link.classList.remove("is-active"));
          match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((item) => spy.observe(item.section));
  }

  /* ------------------------------------------------------------------------
     Lightbox gallery
     ------------------------------------------------------------------------ */

  const shots = $$(".shot");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxNote = $("#lightboxNote");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  let activeShot = 0;
  let lastTrigger = null;
  let closeTimer = null;

  const renderShot = (index) => {
    if (!shots.length) return;
    activeShot = (index + shots.length) % shots.length;
    const shot = shots[activeShot];
    const image = $("img", shot);
    const title = shot.dataset.title || image.alt || "Скриншот";
    const note = shot.dataset.note || "";

    lightboxImage.src = shot.dataset.full || image.src;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxNote.textContent = note;
  };

  const openLightbox = (index, trigger) => {
    lastTrigger = trigger || null;
    renderShot(index);
    window.clearTimeout(closeTimer);
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.classList.add("lightbox-open");
    lightboxClose.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    closeTimer = window.setTimeout(() => {
      lightbox.hidden = true;
    }, 300);
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  };

  shots.forEach((shot, index) => {
    shot.addEventListener("click", () => openLightbox(index, shot));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => renderShot(activeShot - 1));
  lightboxNext.addEventListener("click", () => renderShot(activeShot + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      renderShot(activeShot - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      renderShot(activeShot + 1);
    }
  });

  /* ------------------------------------------------------------------------
     FAQ — one answer at a time
     ------------------------------------------------------------------------ */

  const faqItems = $$(".faq details");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ------------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------------ */

  const toast = $("#toast");
  const toastText = $("#toastText");
  let toastTimer = null;

  const showToast = (message) => {
    toastText.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  };

  /* ------------------------------------------------------------------------
     Downloads
     ------------------------------------------------------------------------ */

  $$("[data-download]").forEach((link) => {
    link.addEventListener("click", () => {
      showToast("Загрузка GlassLauncher началась…");
    });
  });

  /* ------------------------------------------------------------------------
     Copy SHA-256
     ------------------------------------------------------------------------ */

  const copyHash = $("#copyHash");
  const shaValue = $("#shaValue");

  const fallbackCopy = (text) => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  };

  copyHash.addEventListener("click", async () => {
    const hash = shaValue.textContent.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(hash);
      } else if (!fallbackCopy(hash)) {
        throw new Error("copy failed");
      }
      showToast("SHA-256 скопирован");
    } catch {
      showToast("Не удалось скопировать — выдели вручную");
    }
  });

  /* ------------------------------------------------------------------------
     Copy server IP
     ------------------------------------------------------------------------ */

  $$("[data-copy-ip]").forEach((button) => {
    button.addEventListener("click", async () => {
      const ip = button.dataset.copyIp;
      if (!ip) return;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(ip);
        } else if (!fallbackCopy(ip)) {
          throw new Error("copy failed");
        }
        showToast(`IP скопирован · ${ip}`);
        button.classList.add("is-copied");
        const strong = button.querySelector(".btn__text strong");
        const previous = strong ? strong.textContent : "";
        if (strong) strong.textContent = "IP СКОПИРОВАН";
        window.setTimeout(() => {
          button.classList.remove("is-copied");
          if (strong) strong.textContent = previous;
        }, 1800);
      } catch {
        showToast("Не удалось скопировать — выдели IP вручную");
      }
    });
  });

  /* ------------------------------------------------------------------------
     Subtle pointer tilt for the hero preview
     ------------------------------------------------------------------------ */

  const heroVisual = $(".hero__visual");
  const appWindow = $(".app-window");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (heroVisual && appWindow && finePointer && !reducedMotion) {
    let frame = 0;

    heroVisual.addEventListener("pointermove", (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = heroVisual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        appWindow.style.transform = `rotateY(${(-5 + x * 4).toFixed(2)}deg) rotateX(${(2.5 - y * 3).toFixed(2)}deg) translateZ(0)`;
      });
    });

    heroVisual.addEventListener("pointerleave", () => {
      appWindow.style.transform = "";
    });
  }

  /* ------------------------------------------------------------------------
     Small console signature
     ------------------------------------------------------------------------ */

  console.log(
    "%cGLASSLAUNCHER%c  v1.0.0",
    "background:#f5f6f7;color:#08090b;font-weight:700;padding:6px 10px;border-radius:6px 0 0 6px;",
    "background:#111214;color:#f5f6f7;padding:6px 10px;border-radius:0 6px 6px 0;"
  );
  console.log("Лаунчер создан игроком KilluaDEV! · Ваша игра — наша забота!");
})();
