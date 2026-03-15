/* =============================================
   WEDDING WEBSITE - FANG & FANG
   JavaScript Functions
   ============================================= */

// ==================== Countdown Timer ====================
function initCountdown() {
    const weddingDate = new Date('2027-02-14T00:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(minutes).padStart(2, '0');
        secsEl.textContent = String(seconds).padStart(2, '0');

        // Update circle progress
        updateCircleProgress('days-circle', days, 365);
        updateCircleProgress('hours-circle', hours, 24);
        updateCircleProgress('mins-circle', minutes, 60);
        updateCircleProgress('secs-circle', seconds, 60);
    }

    function updateCircleProgress(id, value, max) {
        const circle = document.getElementById(id);
        if (circle) {
            const circumference = 2 * Math.PI * 45;
            const progress = (value / max) * circumference;
            circle.style.strokeDashoffset = circumference - progress;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==================== Scroll Reveal Animation ====================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('section, .couple-card, .gallery-item, .wish-card, .event-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal', 'active');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ==================== Smooth Scroll for Navigation ====================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetEl.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const countdownSection = document.querySelector('.countdown');
            if (countdownSection) {
                countdownSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ==================== Navigation Scroll Effect ====================
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ==================== Back to Top Button ====================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== Wish Form ====================
function initWishForm() {
    const form = document.getElementById('wishForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('wishName');
        const messageInput = document.getElementById('wishMessage');

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            showToast('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        addWish(name, message);
        showToast('ส่งคำอวยพรเรียบร้อยแล้ว ขอบคุณค่ะ!');

        form.reset();
    });
}

function addWish(name, message) {
    const wishesList = document.getElementById('wishesList');
    if (!wishesList) return;

    const initial = name.charAt(0).toUpperCase();

    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('th-TH', { month: 'short' });
    const year = (now.getFullYear() + 543).toString().slice(-2);
    const timeStr = `${day} ${month} ${year}`;

    const wishCard = document.createElement('div');
    wishCard.className = 'wish-card';
    wishCard.innerHTML = `
        <div class="wish-header">
            <span class="wish-avatar">${escapeHtml(initial)}</span>
            <span class="wish-name">${escapeHtml(name)}</span>
        </div>
        <p class="wish-text">${escapeHtml(message)}</p>
        <span class="wish-time">${timeStr}</span>
    `;

    const firstWish = wishesList.querySelector('.wish-card');
    if (firstWish) {
        wishesList.insertBefore(wishCard, firstWish);
    } else {
        wishesList.appendChild(wishCard);
    }
}

// ==================== Toast Notification ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== Utility Functions ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initScrollReveal();
    initSmoothScroll();
    initNavScroll();
    initBackToTop();
    initWishForm();

    document.body.classList.add('loaded');
});

// Console message
console.log('%c💕 Fang & Fang Wedding 💕', 'color: #C9A962; font-size: 18px; font-weight: bold;');
console.log('%c14 กุมภาพันธ์ 2027', 'color: #A68B4B; font-size: 14px;');
