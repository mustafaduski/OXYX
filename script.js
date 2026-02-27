// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupScrollReveal();
    setupPriceSimulation();
    setupNavHighlight();
    setupSmoothScrolling();
    setupMobileFixes();
}

// ===== SCROLL REVEAL =====
function setupScrollReveal() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    
    sections.forEach(s => observer.observe(s));
}

// ===== LIVE PRICE SIMULATION =====
let price = 0.08431;

function setupPriceSimulation() {
    updatePrice();
    setInterval(updatePrice, 3200);
}

function updatePrice() {
    const change = (Math.random() - 0.48) * 0.0004;
    price = Math.max(0.07, Math.min(0.12, price + change));
    
    const priceElement = document.getElementById('price');
    if (priceElement) {
        priceElement.textContent = '$' + price.toFixed(5);
    }
}

// ===== NAVIGATION HIGHLIGHT =====
function setupNavHighlight() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Handle click navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(n => n.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get target section and scroll
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                const navMap = {
                    'home': 0,
                    'stats': 1,
                    'roadmap': 2,
                    'join': 3
                };
                
                const idx = navMap[id];
                if (idx !== undefined) {
                    navItems.forEach(n => n.classList.remove('active'));
                    navItems[idx].classList.add('active');
                }
            }
        });
    }, { threshold: 0.4 });
    
    sections.forEach(s => sectionObserver.observe(s));
}

// ===== WAITLIST FORM HANDLING =====
let waitlistCount = 4219;

function handleSubmit() {
    const walletInput = document.getElementById('wallet');
    const emailInput = document.getElementById('email');
    const wallet = walletInput.value.trim();
    
    if (!wallet) {
        // Show error state
        walletInput.style.borderColor = 'rgba(239,68,68,0.5)';
        setTimeout(() => {
            walletInput.style.borderColor = '';
        }, 1200);
        return;
    }
    
    // Hide form, show success
    document.getElementById('form-wrap').style.display = 'none';
    document.getElementById('success').classList.add('show');
    
    // Update counter
    waitlistCount++;
    const countElement = document.getElementById('waitlist-count');
    if (countElement) {
        countElement.textContent = waitlistCount.toLocaleString() + ' wallets registered';
    }
    
    // Optional: Store in localStorage
    const registration = {
        wallet: wallet,
        email: emailInput ? emailInput.value.trim() : '',
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('oxyx_registration_' + Date.now(), JSON.stringify(registration));
    } catch (e) {
        console.log('Storage not available');
    }
}

// Make function globally available
window.handleSubmit = handleSubmit;

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== MOBILE FIXES =====
function setupMobileFixes() {
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            document.body.style.transform = 'scale(1)';
        });
    });
    
    // Prevent pull-to-refresh and overscroll
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Fix 100vh on mobile browsers
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    setVH();
    
    // Handle back button navigation
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#home';
        const target = document.querySelector(hash);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load non-critical resources
if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('.lazy-load');
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                }
                element.classList.add('loaded');
                lazyObserver.unobserve(element);
            }
        });
    });
    
    lazyElements.forEach(el => lazyObserver.observe(el));
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.log('Non-critical error caught:', e.message);
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    // Clear any intervals if needed
});

// ===== ANALYTICS STUB (Optional) =====
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track page section views
const sectionViewTracker = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            trackEvent('Section', 'View', entry.target.id);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(s => sectionViewTracker.observe(s));
