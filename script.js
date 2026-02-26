// ===== DOM Elements =====
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeSidebar = document.getElementById('closeSidebar');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const dockItems = document.querySelectorAll('.dock-item');
const sections = document.querySelectorAll('.section');
const preregForm = document.getElementById('preregForm');
const emailInput = document.getElementById('emailInput');

// ===== State =====
let currentSection = 'home';
let marketCap = 4.2;
let holders = 1234;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Create hamburger button dynamically
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'hamburger-btn';
    hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
    hamburgerBtn.setAttribute('aria-label', 'Menu');
    hamburgerBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 48px;
        height: 48px;
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFD700;
        font-size: 24px;
        cursor: pointer;
        z-index: 99;
        backdrop-filter: blur(10px);
    `;
    document.body.appendChild(hamburgerBtn);

    // Hamburger click handler
    hamburgerBtn.addEventListener('click', () => {
        sidebarOverlay.classList.add('active');
    });

    // Close sidebar when clicking outside
    sidebarOverlay.addEventListener('click', (e) => {
        if (e.target === sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
    });

    // Close sidebar with close button
    closeSidebar.addEventListener('click', () => {
        sidebarOverlay.classList.remove('active');
    });

    // Initialize Intersection Observer
    initIntersectionObserver();

    // Start counter animations
    startCounters();

    // Add animation on scroll
    initScrollAnimations();
});

// ===== Navigation Functions =====
function switchSection(sectionId) {
    // Update sections
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    // Update dock items
    dockItems.forEach(item => {
        const itemSection = item.getAttribute('data-section');
        if (itemSection === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update sidebar links
    sidebarLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        if (linkSection === sectionId) {
            link.style.background = 'rgba(255, 215, 0, 0.1)';
            link.style.borderColor = '#FFD700';
        } else {
            link.style.background = '';
            link.style.borderColor = '';
        }
    });

    currentSection = sectionId;
    sidebarOverlay.classList.remove('active');

    // Trigger counter update for stats section
    if (sectionId === 'tokenomics') {
        updateStats();
    }
}

// ===== Dock Navigation =====
dockItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        switchSection(sectionId);
    });
});

// ===== Sidebar Navigation =====
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        switchSection(sectionId);
    });
});

// ===== Intersection Observer for Scroll Animation =====
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Update active section based on scroll
                const sectionId = entry.target.id;
                updateActiveSection(sectionId);
            }
        });
    }, { threshold: 0.5 });

    // Observe all cards and items
    document.querySelectorAll('.token-card, .timeline-item, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function updateActiveSection(sectionId) {
    // Update dock items
    dockItems.forEach(item => {
        const itemSection = item.getAttribute('data-section');
        if (itemSection === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ===== Counter Animation =====
function startCounters() {
    setInterval(() => {
        // Update market cap
        const change = (Math.random() * 0.1) - 0.05;
        marketCap += change;
        if (marketCap < 3.5) marketCap = 3.5;
        if (marketCap > 5.0) marketCap = 5.0;
        
        // Update holders
        const holderIncrease = Math.floor(Math.random() * 5) + 1;
        holders += holderIncrease;

        // Update DOM
        updateStats();
    }, 5000);
}

function updateStats() {
    const marketCapEl = document.getElementById('marketCap');
    const holdersEl = document.getElementById('holders');

    if (marketCapEl) {
        marketCapEl.textContent = '$' + marketCap.toFixed(1) + 'M';
        animateValue(marketCapEl);
    }

    if (holdersEl) {
        holdersEl.textContent = holders.toLocaleString();
        animateValue(holdersEl);
    }
}

function animateValue(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.animation = `slideInLeft 0.6s ease ${index * 0.2}s forwards`;
    });
}

// Add keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ===== Pre-registration Form Handler =====
preregForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Success
    showMessage('✓ Pre-registration successful! Check your email for confirmation.', 'success');
    emailInput.value = '';
    
    // Add to holders count
    holders += 1;
    updateStats();
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(text, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        margin-top: 15px;
        padding: 12px;
        border-radius: 40px;
        font-size: 13px;
        text-align: center;
        animation: slideUp 0.3s ease;
    `;
    
    if (type === 'success') {
        message.style.background = 'rgba(16, 185, 129, 0.1)';
        message.style.border = '1px solid #10b981';
        message.style.color = '#10b981';
    } else {
        message.style.background = 'rgba(239, 68, 68, 0.1)';
        message.style.border = '1px solid #ef4444';
        message.style.color = '#ef4444';
    }
    
    // Insert after form
    preregForm.parentNode.insertBefore(message, preregForm.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// ===== Whitepaper Button Handler =====
document.querySelector('.whitepaper-btn').addEventListener('click', () => {
    // Simulate PDF download
    const btn = document.querySelector('.whitepaper-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        showMessage('Whitepaper will be available at launch!', 'success');
    }, 2000);
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarOverlay.classList.contains('active')) {
        sidebarOverlay.classList.remove('active');
    }
});

// ===== Touch Gestures for Sidebar =====
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const swipeDistance = touchEndX - touchStartX;
    
    // Swipe right to open sidebar
    if (swipeDistance > swipeThreshold && !sidebarOverlay.classList.contains('active')) {
        sidebarOverlay.classList.add('active');
    }
    
    // Swipe left to close sidebar
    if (swipeDistance < -swipeThreshold && sidebarOverlay.classList.contains('active')) {
        sidebarOverlay.classList.remove('active');
    }
}

// ===== Preloader Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Animate first section
    const homeSection = document.getElementById('home');
    homeSection.style.animation = 'fadeInUp 1s ease';
});

// Add fadeInUp animation
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeStyle);

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        switchSection(targetId);
    });
});

// ===== Initialize first section =====
switchSection('home');
