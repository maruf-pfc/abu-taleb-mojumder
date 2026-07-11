// আবু তালেবের কবিতাবলি — shared behaviour
document.addEventListener('DOMContentLoaded', () => {
  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const wrapper = document.querySelector('.nav-links-wrapper');
  if (toggle && wrapper) {
    toggle.addEventListener('click', () => {
      const open = wrapper.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // close if clicking backdrop overlay itself
    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper) {
        wrapper.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    // close when a navigation link is clicked
    wrapper.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
      wrapper.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
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
  const status = document.querySelector('#form-status');
  
  if (status) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      status.style.color = 'var(--green)';
      status.textContent = 'ধন্যবাদ। আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!';
    } else if (urlParams.get('error')) {
      status.style.color = 'var(--maroon)';
      status.textContent = decodeURIComponent(urlParams.get('error'));
    }
  }

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
        status.style.color = 'var(--ink-soft)';
        status.textContent = 'বার্তা পাঠানো হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...';
      }

      // Fetch the access key from serverless endpoint to keep it out of source code
      fetch('/api/key')
        .then(res => {
          if (!res.ok) throw new Error('Could not fetch access key');
          return res.json();
        })
        .then(keyData => {
          const payload = {
            access_key: keyData.key,
            name: name.value,
            email: email.value,
            subject: document.querySelector('#subject') ? document.querySelector('#subject').value : '',
            message: message.value
          };

          return fetch(form.action, {
            method: form.method,
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
        })
        .then(response => {
          if (response.ok) {
            if (status) {
              status.style.color = 'var(--green)';
              status.textContent = 'ধন্যবাদ। আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!';
            }
            form.reset();
          } else {
            response.json()
              .then(data => {
                if (status) {
                  status.style.color = 'var(--maroon)';
                  status.textContent = data.message || 'দুঃখিত, কোনো ত্রুটি ঘটেছে। আবার চেষ্টা করুন।';
                }
              })
              .catch(() => {
                if (status) {
                  status.style.color = 'var(--maroon)';
                  status.textContent = 'সার্ভার সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।';
                }
              });
          }
        })
        .catch(error => {
          if (status) {
            status.style.color = 'var(--maroon)';
            status.textContent = 'সার্ভার সংযোগ বা নেটওয়ার্কের সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';
          }
        });
    });
  }

  // Writings Modal Reader
  const modal = document.querySelector('#reader-modal');
  const modalClose = document.querySelector('#modal-close');
  const modalTitle = document.querySelector('#modal-title');
  const modalText = document.querySelector('#modal-text');
  const modalEyebrow = document.querySelector('#modal-eyebrow');
  let lastActiveElement = null;

  if (modal && modalClose) {
    const openModal = (id, title, tag) => {
      const template = document.querySelector(`#template-${id}`);
      if (!template) return;
      
      lastActiveElement = document.activeElement;
      
      // Load content
      modalTitle.textContent = title;
      modalEyebrow.textContent = tag;
      modalText.innerHTML = '';
      modalText.appendChild(template.content.cloneNode(true));
      
      // Open modal
      modal.removeAttribute('hidden');
      setTimeout(() => {
        modal.classList.add('open');
      }, 10);
      document.body.style.overflow = 'hidden';
      
      // Focus close button for accessibility
      modalClose.focus();
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      
      setTimeout(() => {
        if (!modal.classList.contains('open')) {
          modal.setAttribute('hidden', 'true');
          modalTitle.textContent = '';
          modalEyebrow.textContent = '';
          modalText.innerHTML = '';
          if (lastActiveElement) {
            lastActiveElement.focus();
          }
        }
      }, 350);
    };

    // Attach click events to "সম্পূর্ণ পড়ুন" buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-read');
      if (btn) {
        const id = btn.getAttribute('data-id');
        const card = btn.closest('.writing-card');
        const title = card.querySelector('h3').textContent;
        const tag = card.querySelector('.card-tag').textContent;
        openModal(id, title, tag);
      }
    });

    // Close buttons
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Keyboard Accessibility (Esc to close, tab trapping)
    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeModal();
        }

        if (e.key === 'Tab') {
          const focusables = modal.querySelectorAll('button, [tabindex="0"]');
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      }
    });
  }
});

