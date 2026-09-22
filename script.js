"use strict";

const WHATSAPP_NUMBER = "2348051839547";

document.addEventListener("DOMContentLoaded", () => {
  setupHeader();
  setupMobileMenu();
  setupRevealAnimations();
  setupPageTransitions();
  setupCursor();
  setupTilt();
  setupMagneticButtons();
  setupContactForm();
  setupRipple();
  setupActiveNavigation();
  setupYear();

  document.body.classList.remove("entering");
});


/* =================================
   HEADER
   ================================= */

function setupHeader() {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();
}


/* =================================
   MOBILE MENU
   ================================= */

function setupMobileMenu() {
  const toggle =
    document.querySelector(".menu-toggle") ||
    document.querySelector(".nav-toggle");

  const nav =
    document.querySelector(".nav-links") ||
    document.querySelector(".nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    document.body.classList.toggle(
      "menu-open",
      isOpen
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );

      document.body.classList.remove("menu-open");
    });
  });
}


/* =================================
   REVEAL ANIMATIONS
   ================================= */

function setupRevealAnimations() {
  const elements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, [data-reveal]"
  );

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("visible", "active");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add(
          "visible",
          "active"
        );

        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}


/* =================================
   PAGE TRANSITIONS
   ================================= */

function setupPageTransitions() {
  const links = document.querySelectorAll(
    'a[href$=".html"]'
  );

  links.forEach((link) => {
    link.addEventListener("click", (event) => {

      if (
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey ||
        event.button !== 0 ||
        link.target === "_blank"
      ) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href) return;

      event.preventDefault();

      document.body.classList.add("leaving");

      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
}


/* =================================
   CUSTOM CURSOR
   ================================= */

function setupCursor() {
  const cursor =
    document.querySelector(".cursor");

  const ring =
    document.querySelector(".cursor-ring");

  if (!cursor || !ring) return;

  if (
    window.matchMedia &&
    !window.matchMedia("(pointer: fine)").matches
  ) {
    cursor.style.display = "none";
    ring.style.display = "none";
    return;
  }

  let mouseX = 0;
  let mouseY = 0;

  let ringX = 0;
  let ringY = 0;

  let animationRunning = false;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.transform =
      `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    if (!animationRunning) {
      animationRunning = true;
      requestAnimationFrame(updateRing);
    }
  }, { passive: true });


  function updateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform =
      `translate3d(${ringX}px, ${ringY}px, 0)`;

    if (
      Math.abs(mouseX - ringX) > 0.5 ||
      Math.abs(mouseY - ringY) > 0.5
    ) {
      requestAnimationFrame(updateRing);
    } else {
      animationRunning = false;
    }
  }


  document.addEventListener(
    "mouseover",
    (event) => {
      const interactive =
        event.target.closest(
          "a, button, input, textarea, .tilt, .magnetic"
        );

      if (interactive) {
        ring.classList.add("hover");
      }
    }
  );


  document.addEventListener(
    "mouseout",
    (event) => {
      const interactive =
        event.target.closest(
          "a, button, input, textarea, .tilt, .magnetic"
        );

      if (
        interactive &&
        !interactive.contains(event.relatedTarget)
      ) {
        ring.classList.remove("hover");
      }
    }
  );
}


/* =================================
   CARD TILT
   ================================= */

function setupTilt() {
  const elements =
    document.querySelectorAll(".tilt");

  if (!elements.length) return;

  if (
    window.matchMedia &&
    !window.matchMedia("(pointer: fine)").matches
  ) {
    return;
  }

  elements.forEach((element) => {

    let ticking = false;

    element.addEventListener(
      "mousemove",
      (event) => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {

          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const y =
            event.clientY - rect.top;

          const centerX =
            rect.width / 2;

          const centerY =
            rect.height / 2;

          const rotateX =
            ((y - centerY) / centerY) * -3;

          const rotateY =
            ((x - centerX) / centerX) * 3;

          element.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-3px)`;

          ticking = false;
        });
      },
      { passive: true }
    );


    element.addEventListener(
      "mouseleave",
      () => {
        element.style.transform = "";
      }
    );

  });
}


/* =================================
   MAGNETIC BUTTONS
   ================================= */

function setupMagneticButtons() {
  const elements =
    document.querySelectorAll(".magnetic");

  if (!elements.length) return;

  if (
    window.matchMedia &&
    !window.matchMedia("(pointer: fine)").matches
  ) {
    return;
  }

  elements.forEach((element) => {

    element.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        element.style.transform =
          `translate(${x * 0.08}px, ${y * 0.08}px)`;
      },
      { passive: true }
    );


    element.addEventListener(
      "mouseleave",
      () => {
        element.style.transform = "";
      }
    );

  });
}


/* =================================
   CONTACT FORM → WHATSAPP
   ================================= */

function setupContactForm() {
  const form =
    document.querySelector("#contact-form");

  if (!form) return;

  const status =
    document.querySelector("#form-status");

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
      document.querySelector("#name")?.value.trim() || "";

    const email =
      document.querySelector("#email")?.value.trim() || "";

    const message =
      document.querySelector("#message")?.value.trim() || "";


    if (!name || !email || !message) {

      if (status) {
        status.textContent =
          "Please fill in all the fields.";
      }

      return;
    }


    const text =
      `Hi Awesome!

Name: ${name}
Email: ${email}

Message:
${message}`;


    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;


    if (status) {
      status.textContent =
        "Opening WhatsApp...";
    }


    window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

  });
}


/* =================================
   BUTTON RIPPLE
   ================================= */

function setupRipple() {

  document.addEventListener("click", (event) => {

    const button =
      event.target.closest(".btn, button");

    if (!button) return;

    const rect =
      button.getBoundingClientRect();

    const ripple =
      document.createElement("span");

    const size =
      Math.max(rect.width, rect.height);

    ripple.className = "click-ripple";

    ripple.style.width =
      `${size}px`;

    ripple.style.height =
      `${size}px`;

    ripple.style.left =
      `${event.clientX - rect.left - size / 2}px`;

    ripple.style.top =
      `${event.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 500);

  });
}


/* =================================
   ACTIVE NAVIGATION
   ================================= */

function setupActiveNavigation() {

  const links =
    document.querySelectorAll(
      ".nav-links a, .nav a"
    );

  if (!links.length) return;

  const currentPage =
    window.location.pathname
      .split("/")
      .pop() || "index.html";


  links.forEach((link) => {

    const href =
      link.getAttribute("href");

    if (!href) return;

    const cleanHref =
      href.split("#")[0]
        .split("?")[0];

    if (
      cleanHref === currentPage ||
      (
        currentPage === "index.html" &&
        cleanHref === ""
      )
    ) {
      link.classList.add("active");
    }

  });
}


/* =================================
   FOOTER YEAR
   ================================= */

function setupYear() {

  document
    .querySelectorAll(".year")
    .forEach((element) => {

      element.textContent =
        new Date().getFullYear();

    });
}
