const CONTACT_EMAIL = 'chrehan101@gmail.com';

const createParticleBackground = () => {
  const canvas = document.querySelector('.particle-container');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const context = canvas.getContext('2d');
  const particles = [];
  const particleCount = window.innerWidth < 700 ? 40 : 82;
  const connectionDistance = window.innerWidth < 700 ? 145 : 195;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  const makeParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - .5) * .28,
    vy: (Math.random() - .5) * .28,
    radius: Math.random() * 1.5 + .8,
  });

  const resize = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (!particles.length) for (let index = 0; index < particleCount; index += 1) particles.push(makeParticle());
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));
    }
    for (let first = 0; first < particles.length; first += 1) {
      const particle = particles[first];
      for (let second = first + 1; second < particles.length; second += 1) {
        const neighbor = particles[second];
        const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y);
        if (distance > connectionDistance) continue;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(neighbor.x, neighbor.y);
        context.strokeStyle = `rgba(0, 212, 255, ${.24 * (1 - distance / connectionDistance)})`;
        context.lineWidth = .7;
        context.stroke();
      }
    }
    for (const particle of particles) {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(118, 195, 255, .72)';
      context.fill();
    }
    window.requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
};

createParticleBackground();

const sections = ['hero', 'about', 'projects', 'skills', 'contact'];
const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const navButtons = [...document.querySelectorAll('header nav button')];
navButtons.forEach((button, index) => {
  button.type = 'button';
  button.addEventListener('click', () => scrollToSection(sections[index]));
});

document.querySelectorAll('.nav-dot').forEach((button, index) => {
  button.type = 'button';
  button.setAttribute('aria-label', `Go to ${sections[index]}`);
  button.addEventListener('click', () => scrollToSection(sections[index]));
});

const navDots = [...document.querySelectorAll('.nav-dot')];
const setActiveSection = (index) => {
  navDots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
  navButtons.forEach((button, buttonIndex) => button.classList.toggle('text-electric', buttonIndex === index));
};

const sectionElements = sections.map((id) => document.getElementById(id)).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActiveSection(sections.indexOf(visible.target.id));
}, { rootMargin: '-35% 0px -45% 0px', threshold: [0, .1, .35] });
sectionElements.forEach((section) => sectionObserver.observe(section));
setActiveSection(0);

const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll ? (window.scrollY / maxScroll) * 100 : 0;
  document.querySelector('.scroll-progress')?.style.setProperty('height', `${progress}%`);
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const heroButtons = [...document.querySelectorAll('#hero button')];
heroButtons[0]?.addEventListener('click', () => scrollToSection('projects'));
heroButtons[1]?.addEventListener('click', () => scrollToSection('contact'));
document.querySelector('header .text-gradient')?.addEventListener('click', () => scrollToSection('hero'));
document.querySelector('.lucide-chevron-down')?.closest('div')?.addEventListener('click', () => scrollToSection('about'));

const hero = document.querySelector('#hero');
const heroContent = hero?.querySelector('.container');
heroContent?.querySelectorAll('h1, .font-mono, p, .flex.flex-col').forEach((element, index) => {
  element.classList.add('hero-reveal');
  element.style.setProperty('--hero-delay', `${150 + index * 130}ms`);
});
hero?.querySelectorAll('.pointer-events-none > div').forEach((element) => element.classList.add('hero-float'));

const toast = (message) => {
  let notice = document.querySelector('#base-notice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'base-notice';
    notice.setAttribute('role', 'status');
    Object.assign(notice.style, { position: 'fixed', right: '24px', bottom: '24px', zIndex: '200', maxWidth: '320px', padding: '14px 18px', borderRadius: '10px', color: '#fff', background: '#1a1a1a', border: '1px solid rgba(0,212,255,.6)', boxShadow: '0 8px 30px rgba(0,0,0,.35)', fontSize: '14px' });
    document.body.append(notice);
  }
  notice.textContent = message;
  notice.hidden = false;
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => { notice.hidden = true; }, 3500);
};

document.querySelectorAll('a[href="#"]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  toast('Add this project or social URL in index.html before publishing.');
}));

document.querySelectorAll('.project-card').forEach((card) => card.addEventListener('click', (event) => {
  if (event.target.closest('a')) return;
  toast('Replace this project placeholder with its project page or live URL.');
}));

const form = document.querySelector('form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const subject = data.get('subject') || 'Portfolio website enquiry';
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalLabel = submitButton?.textContent;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Opening email client...';
  }
  toast('Your email app is opening with your message ready to send.');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.setTimeout(() => {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  }, 1200);
});

const mobileButton = document.querySelector('header button.md\\:hidden');
const desktopNav = document.querySelector('header nav');
mobileButton?.addEventListener('click', () => {
  const isOpen = desktopNav.dataset.mobileOpen !== 'true';
  desktopNav.dataset.mobileOpen = String(isOpen);
  mobileButton.setAttribute('aria-expanded', String(isOpen));
  Object.assign(desktopNav.style, isOpen ? { display: 'block', position: 'absolute', top: '100%', left: '0', right: '0', padding: '1rem 1.5rem', background: '#0a0a0a' } : { display: '' });
});
