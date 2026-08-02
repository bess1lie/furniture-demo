document.addEventListener('DOMContentLoaded', () => {
  // === 1. HEADER SCROLL ===
  const header = document.getElementById('header');
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // === 2. БУРГЕР-МЕНЮ ===
  const burgerToggle = document.getElementById('burger-toggle');
  const burgerClose = document.getElementById('burger-close');
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    menuOverlay.classList.add('is-active');
    burgerToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    menuOverlay.classList.remove('is-active');
    burgerToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (burgerToggle) burgerToggle.addEventListener('click', openMenu);
  if (burgerClose) burgerClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // === 3. INTERSECTION OBSERVER ===
  const fadeElements = document.querySelectorAll('.fade-element');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // === 4. ФИЛЬТР КАТАЛОГА ===
  const filterTabs = document.querySelectorAll('.filter-tab');
  const catalogCards = document.querySelectorAll('.catalog-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active states on tabs
      filterTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      catalogCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const matches = (filterValue === 'all' || category === filterValue);

        if (matches) {
          // Show matching card
          card.classList.remove('is-hidden');
          // Trigger a minor browser reflow to apply opacity transitons correctly
          void card.offsetWidth;
          card.classList.remove('is-fading');
        } else {
          // Hide non-matching card
          card.classList.add('is-fading');
          // Wait 300ms for transition before display:none
          setTimeout(() => {
            if (card.classList.contains('is-fading')) {
              card.classList.add('is-hidden');
            }
          }, 300);
        }
      });
    });
  });

  // === 5. КАЛЬКУЛЯТОР ===
  const calcForm = document.getElementById('furniture-calc-form');
  const calcResultBox = document.getElementById('calc-result');
  const calcPriceOutput = document.getElementById('calc-price-output');

  // Helper to format currency values cleanly with spaces (e.g. 2600000 -> "2 600 000")
  function formatCurrency(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const baseVal = parseFloat(document.getElementById('calc-category').value);
      const multVal = parseFloat(document.getElementById('calc-material').value);
      const sizeVal = parseFloat(document.getElementById('calc-size').value);

      if (isNaN(sizeVal) || sizeVal < 1) {
        alert('Укажите корректный размер');
        return;
      }

      // Calculations
      const minPrice = Math.round((baseVal * multVal * sizeVal) / 1000) * 1000;
      const maxPrice = Math.round((minPrice * 1.3) / 1000) * 1000;

      // Outputs
      calcPriceOutput.textContent = `от ${formatCurrency(minPrice)} ₸ до ${formatCurrency(maxPrice)} ₸`;
      calcResultBox.style.display = 'block';
    });
  }

  // === 6. ФОРМА ЗАЯВКИ ===
  const orderForm = document.getElementById('furniture-order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Спасибо! Ваша заявка принята. Мы перезвоним в течение 30 минут.');
      orderForm.reset();
    });
  }

  // === 7. SMOOTH SCROLL ===
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const targetEl = document.getElementById(href.substring(1));
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // === 8. КНОПКА "ПОДРОБНЕЕ" В КАТАЛОГЕ ===
  const detailButtons = document.querySelectorAll('.catalog-detail-btn');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop anchor/card clicks
      alert('Оставьте заявку — рассчитаем точную стоимость под ваш проект.');
    });
  });
});
