// আবু তালেবের কবিতাবলি — shared behaviour
document.addEventListener('DOMContentLoaded', () => {
  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // scroll reveal with IntersectionObserver
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // contact form handling with inline validation & accessible announcement
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#name');
      const email = document.querySelector('#email');
      const message = document.querySelector('#message');
      const status = document.querySelector('#form-status');

      if (!name.value || !email.value || !message.value) {
        if (status) {
          status.style.color = 'var(--maroon)';
          status.textContent = 'দয়া করে সবকটি প্রয়োজনীয় ক্ষেত্র পূরণ করুন।';
        }
        return;
      }

      if (status) {
        status.style.color = 'var(--green)';
        status.textContent = 'ধন্যবাদ। আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে (সিমুলেশন)।';
      }
      form.reset();
    });
  }
});
