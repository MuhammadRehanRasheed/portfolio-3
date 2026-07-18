const CONTACT_EMAIL = 'chrehan101@gmail.com';

/* =========================================================
   PARTICLE BACKGROUND
========================================================= */

const createParticleBackground = () => {
  const canvas = document.querySelector('.particle-container');

  if (
    !canvas ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const context = canvas.getContext('2d');
  const particles = [];

  let particleCount = window.innerWidth < 700 ? 40 : 82;
  let connectionDistance = window.innerWidth < 700 ? 145 : 195;

  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  const makeParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    radius: Math.random() * 1.5 + 0.8,
  });

  const resize = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    particleCount = width < 700 ? 40 : 82;
    connectionDistance = width < 700 ? 145 : 195;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    if (!particles.length) {
      for (
        let index = 0;
        index < particleCount;
        index += 1
      ) {
        particles.push(makeParticle());
      }
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    /* Move particles */
    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (
        particle.x < 0 ||
        particle.x > width
      ) {
        particle.vx *= -1;
      }

      if (
        particle.y < 0 ||
        particle.y > height
      ) {
        particle.vy *= -1;
      }

      particle.x = Math.max(
        0,
        Math.min(width, particle.x)
      );

      particle.y = Math.max(
        0,
        Math.min(height, particle.y)
      );
    }

    /* Draw connections */
    for (
      let first = 0;
      first < particles.length;
      first += 1
    ) {
      const particle = particles[first];

      for (
        let second = first + 1;
        second < particles.length;
        second += 1
      ) {
        const neighbor = particles[second];

        const distance = Math.hypot(
          particle.x - neighbor.x,
          particle.y - neighbor.y
        );

        if (distance > connectionDistance) {
          continue;
        }

        context.beginPath();

        context.moveTo(
          particle.x,
          particle.y
        );

        context.lineTo(
          neighbor.x,
          neighbor.y
        );

        context.strokeStyle =
          `rgba(0, 212, 255, ${
            0.24 *
            (1 - distance / connectionDistance)
          })`;

        context.lineWidth = 0.7;
        context.stroke();
      }
    }

    /* Draw particles */
    for (const particle of particles) {
      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        'rgba(118, 195, 255, .72)';

      context.fill();
    }

    window.requestAnimationFrame(draw);
  };

  window.addEventListener(
    'resize',
    resize,
    { passive: true }
  );

  resize();
  draw();
};

createParticleBackground();


/* =========================================================
   SECTIONS
========================================================= */

const sections = [
  'hero',
  'about',
  'projects',
  'skills',
  'contact'
];

const scrollToSection = (id) => {
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
};


/* =========================================================
   NAVIGATION
========================================================= */

const header = document.querySelector('header');

const mobileButton = document.querySelector(
  'header button.md\\:hidden'
);

const desktopNav = document.querySelector(
  'header nav'
);

const navList = desktopNav?.querySelector('ul');

const navButtons = [
  ...document.querySelectorAll(
    'header nav button'
  )
];

const navDots = [
  ...document.querySelectorAll('.nav-dot')
];

let mobileMenuOpen = false;


/* =========================================================
   MOBILE MENU STYLES
========================================================= */

const resetMobileMenuStyles = () => {
  if (!desktopNav || !navList) {
    return;
  }

  /* Reset NAV */
  desktopNav.style.display = '';
  desktopNav.style.position = '';
  desktopNav.style.top = '';
  desktopNav.style.left = '';
  desktopNav.style.right = '';
  desktopNav.style.width = '';
  desktopNav.style.padding = '';
  desktopNav.style.margin = '';
  desktopNav.style.background = '';
  desktopNav.style.backdropFilter = '';
  desktopNav.style.webkitBackdropFilter = '';
  desktopNav.style.border = '';
  desktopNav.style.borderRadius = '';
  desktopNav.style.overflow = '';
  desktopNav.style.zIndex = '';

  /* Reset UL */
  navList.style.display = '';
  navList.style.flexDirection = '';
  navList.style.alignItems = '';
  navList.style.justifyContent = '';
  navList.style.flexWrap = '';
  navList.style.gap = '';
  navList.style.width = '';
  navList.style.minWidth = '';
  navList.style.margin = '';
  navList.style.padding = '';

  /* Reset LI */
  navList
    .querySelectorAll('li')
    .forEach((item) => {
      item.style.width = '';
      item.style.display = '';
    });

  /* Reset buttons */
  navButtons.forEach((button) => {
    button.style.display = '';
    button.style.width = '';
    button.style.padding = '';
    button.style.textAlign = '';
    button.style.whiteSpace = '';
    button.style.flexShrink = '';
  });
};


/* =========================================================
   OPEN MOBILE MENU
========================================================= */

const openMobileMenu = () => {
  if (
    !desktopNav ||
    !navList ||
    !mobileButton
  ) {
    return;
  }

  mobileMenuOpen = true;

  desktopNav.dataset.mobileOpen = 'true';

  mobileButton.setAttribute(
    'aria-expanded',
    'true'
  );

  /*
    Full-width dropdown below header
  */
  Object.assign(
    desktopNav.style,
    {
      display: 'block',
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      width: '100%',
      padding: '0.75rem',
      margin: '0',
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '0 0 20px 20px',
      overflow: 'hidden',
      zIndex: '50'
    }
  );

  /*
    MOBILE MENU
    Single column
    Full width
  */
  Object.assign(
    navList.style,
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      gap: '0',
      width: '100%',
      minWidth: '0',
      margin: '0',
      padding: '0'
    }
  );

  /*
    Every LI gets full width
  */
  navList
    .querySelectorAll('li')
    .forEach((item) => {
      Object.assign(
        item.style,
        {
          width: '100%',
          display: 'block'
        }
      );
    });

  /*
    Every button gets full width
  */
  navButtons.forEach((button) => {
    Object.assign(
      button.style,
      {
        display: 'block',
        width: '100%',
        padding: '0.85rem 1rem',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        flexShrink: '0'
      }
    );
  });
};


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

const closeMobileMenu = () => {
  if (
    !desktopNav ||
    !mobileButton
  ) {
    return;
  }

  mobileMenuOpen = false;

  desktopNav.dataset.mobileOpen = 'false';

  mobileButton.setAttribute(
    'aria-expanded',
    'false'
  );

  resetMobileMenuStyles();
};


/* =========================================================
   TOGGLE MOBILE MENU
========================================================= */

mobileButton?.addEventListener(
  'click',
  (event) => {
    event.stopPropagation();

    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
);


/* =========================================================
   NAVIGATION BUTTONS
========================================================= */

navButtons.forEach(
  (button, index) => {

    button.type = 'button';

    button.addEventListener(
      'click',
      () => {

        scrollToSection(
          sections[index]
        );

        /*
          Close menu after clicking
          a navigation item on mobile.
        */
        if (
          window.innerWidth < 768
        ) {
          closeMobileMenu();
        }
      }
    );

  }
);


/* =========================================================
   CLOSE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
  'click',
  (event) => {

    if (!mobileMenuOpen) {
      return;
    }

    if (
      !header?.contains(
        event.target
      )
    ) {
      closeMobileMenu();
    }

  }
);


/* =========================================================
   CLOSE MENU WITH ESCAPE
========================================================= */

document.addEventListener(
  'keydown',
  (event) => {

    if (
      event.key === 'Escape' &&
      mobileMenuOpen
    ) {
      closeMobileMenu();

      mobileButton?.focus();
    }

  }
);


/* =========================================================
   RESPONSIVE RESIZE
========================================================= */

window.addEventListener(
  'resize',
  () => {

    /*
      If the screen becomes desktop size,
      close the mobile menu and restore
      the original desktop Tailwind layout.
    */
    if (
      window.innerWidth >= 768 &&
      mobileMenuOpen
    ) {
      closeMobileMenu();
    }

  },
  { passive: true }
);


/* =========================================================
   NAV DOTS
========================================================= */

navDots.forEach(
  (button, index) => {

    button.type = 'button';

    button.setAttribute(
      'aria-label',
      `Go to ${sections[index]}`
    );

    button.addEventListener(
      'click',
      () => {
        scrollToSection(
          sections[index]
        );
      }
    );

  }
);


/* =========================================================
   ACTIVE SECTION
========================================================= */

const setActiveSection = (index) => {

  navDots.forEach(
    (dot, dotIndex) => {

      dot.classList.toggle(
        'is-active',
        dotIndex === index
      );

    }
  );

  navButtons.forEach(
    (button, buttonIndex) => {

      button.classList.toggle(
        'text-electric',
        buttonIndex === index
      );

    }
  );

};


const sectionElements = sections
  .map(
    (id) =>
      document.getElementById(id)
  )
  .filter(Boolean);


const sectionObserver =
  new IntersectionObserver(
    (entries) => {

      const visible = entries
        .filter(
          (entry) =>
            entry.isIntersecting
        )
        .sort(
          (a, b) =>
            b.intersectionRatio -
            a.intersectionRatio
        )[0];

      if (visible) {

        setActiveSection(
          sections.indexOf(
            visible.target.id
          )
        );

      }

    },
    {
      rootMargin:
        '-35% 0px -45% 0px',

      threshold: [
        0,
        0.1,
        0.35
      ]
    }
  );


sectionElements.forEach(
  (section) => {

    sectionObserver.observe(
      section
    );

  }
);


setActiveSection(0);


/* =========================================================
   SCROLL PROGRESS
========================================================= */

const updateScrollProgress = () => {

  const maxScroll =
    document.documentElement
      .scrollHeight -
    window.innerHeight;

  const progress =
    maxScroll
      ? (window.scrollY / maxScroll) * 100
      : 0;

  document
    .querySelector(
      '.scroll-progress'
    )
    ?.style.setProperty(
      'height',
      `${progress}%`
    );

};


window.addEventListener(
  'scroll',
  updateScrollProgress,
  { passive: true }
);

updateScrollProgress();


/* =========================================================
   HERO BUTTONS
========================================================= */

const heroButtons = [
  ...document.querySelectorAll(
    '#hero button'
  )
];

heroButtons[0]?.addEventListener(
  'click',
  () => {
    scrollToSection(
      'projects'
    );
  }
);

heroButtons[1]?.addEventListener(
  'click',
  () => {
    scrollToSection(
      'contact'
    );
  }
);


/* =========================================================
   LOGO
========================================================= */

document
  .querySelector(
    'header .text-gradient'
  )
  ?.addEventListener(
    'click',
    () => {
      scrollToSection(
        'hero'
      );
    }
  );


/* =========================================================
   HERO DOWN ARROW
========================================================= */

document
  .querySelector(
    '.lucide-chevron-down'
  )
  ?.closest('div')
  ?.addEventListener(
    'click',
    () => {
      scrollToSection(
        'about'
      );
    }
  );


/* =========================================================
   HERO ANIMATIONS
========================================================= */

const hero =
  document.querySelector(
    '#hero'
  );

const heroContent =
  hero?.querySelector(
    '.container'
  );


heroContent
  ?.querySelectorAll(
    'h1, .font-mono, p, .flex.flex-col'
  )
  .forEach(
    (element, index) => {

      element.classList.add(
        'hero-reveal'
      );

      element.style.setProperty(
        '--hero-delay',
        `${150 + index * 130}ms`
      );

    }
  );


hero
  ?.querySelectorAll(
    '.pointer-events-none > div'
  )
  .forEach(
    (element) => {

      element.classList.add(
        'hero-float'
      );

    }
  );


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

const toast = (message) => {

  let notice =
    document.querySelector(
      '#base-notice'
    );

  if (!notice) {

    notice =
      document.createElement(
        'div'
      );

    notice.id =
      'base-notice';

    notice.setAttribute(
      'role',
      'status'
    );

    Object.assign(
      notice.style,
      {
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: '200',
        maxWidth: '320px',
        padding: '14px 18px',
        borderRadius: '10px',
        color: '#fff',
        background: '#1a1a1a',
        border:
          '1px solid rgba(0,212,255,.6)',
        boxShadow:
          '0 8px 30px rgba(0,0,0,.35)',
        fontSize: '14px'
      }
    );

    document.body.append(
      notice
    );

  }

  notice.textContent =
    message;

  notice.hidden = false;

  window.clearTimeout(
    toast.timer
  );

  toast.timer =
    window.setTimeout(
      () => {
        notice.hidden = true;
      },
      3500
    );

};


/* =========================================================
   PLACEHOLDER LINKS
========================================================= */

document
  .querySelectorAll(
    'a[href="#"]'
  )
  .forEach(
    (link) => {

      link.addEventListener(
        'click',
        (event) => {

          event.preventDefault();

          toast(
            'Add this project or social URL in index.html before publishing.'
          );

        }
      );

    }
  );


/* =========================================================
   PROJECT CARDS
========================================================= */

document
  .querySelectorAll(
    '.project-card'
  )
  .forEach(
    (card) => {

      card.addEventListener(
        'click',
        (event) => {

          if (
            event.target.closest(
              'a'
            )
          ) {
            return;
          }

          toast(
            'Replace this project placeholder with its project page or live URL.'
          );

        }
      );

    }
  );


/* =========================================================
   CONTACT FORM
========================================================= */

const form =
  document.querySelector(
    'form'
  );


form?.addEventListener(
  'submit',
  (event) => {

    event.preventDefault();

    if (
      !form.reportValidity()
    ) {
      return;
    }

    const data =
      new FormData(form);

    const subject =
      data.get('subject') ||
      'Portfolio website enquiry';

    const body =
      `Name: ${data.get('name')}\n` +
      `Email: ${data.get('email')}\n\n` +
      `${data.get('message')}`;

    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );

    const originalLabel =
      submitButton?.textContent;

    if (submitButton) {

      submitButton.disabled =
        true;

      submitButton.textContent =
        'Opening email client...';

    }

    toast(
      'Your email app is opening with your message ready to send.'
    );

    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(
        subject
      )}` +
      `&body=${encodeURIComponent(
        body
      )}`;

    window.setTimeout(
      () => {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            originalLabel;

        }

      },
      1200
    );

  }
);