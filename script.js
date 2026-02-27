// ===== STATE MANAGEMENT =====
let currentSection = 'home';
let priceUpdateInterval;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupEventListeners();
    startPriceSimulation();
    initializeIcons();
}

// ===== NAVIGATION =====
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;
            if (sectionId) {
                switchSection(sectionId);
            }
        });
    });
}

function switchSection(sectionId) {
    // Update active states
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Activate new section
    const targetSection = document.getElementById(sectionId);
    const targetNav = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (targetSection && targetNav) {
        targetSection.classList.add('active');
        targetNav.classList.add('active');
        currentSection = sectionId;
        
        // Scroll to top on section change
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== PRICE SIMULATION =====
function startPriceSimulation() {
    // Initial values
    updatePriceDisplay();
    
    // Update every 30 seconds
    priceUpdateInterval = setInterval(() => {
        updatePriceDisplay();
    }, 30000);
}

function updatePriceDisplay() {
    // Simulate price changes
    const basePrice = 0.01234;
    const change = (Math.random() * 2 - 1) * 0.05; // -5% to +5%
    const newPrice = basePrice * (1 + change);
    const priceChangePercent = (change * 100).toFixed(2);
    
    // Update DOM elements
    const priceElements = {
        'oxyx-price': `$${newPrice.toFixed(4)}`,
        'price-change': `${priceChangePercent}%`,
        'volume': `$${(Math.random() * 100000 + 50000).toFixed(0)}`
    };
    
    for (const [id, value] of Object.entries(priceElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Update price change class
    const priceChangeElement = document.getElementById('price-change');
    if (priceChangeElement) {
        priceChangeElement.className = parseFloat(priceChangePercent) >= 0 ? 'stat-change positive' : 'stat-change negative';
    }
    
    // Update home section stats
    updateHomeStats(newPrice, priceChangePercent);
}

function updateHomeStats(price, change) {
    const marketCapElement = document.querySelector('.stat-card .stat-value');
    const changeElement = document.querySelector('.stat-change.positive');
    
    if (marketCapElement) {
        const marketCap = price * 1000000; // Assuming 1M supply
        marketCapElement.textContent = `$${marketCap.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
    }
    
    if (changeElement && changeElement.textContent.includes('Loading')) {
        changeElement.textContent = `${parseFloat(change) >= 0 ? '+' : ''}${change}%`;
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Connect wallet button
    const connectBtn = document.querySelector('.connect-wallet-btn');
    if (connectBtn) {
        connectBtn.addEventListener('click', handleConnectWallet);
    }
    
    // Buy button
    const buyBtn = document.querySelector('.btn-primary');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            window.open('https://app.uniswap.org/#/swap?outputCurrency=0xyx', '_blank');
        });
    }
    
    // Chart button
    const chartBtn = document.querySelector('.btn-secondary');
    if (chartBtn) {
        chartBtn.addEventListener('click', () => {
            window.open('https://dexscreener.com/ethereum/0xyx', '_blank');
        });
    }
    
    // Social links
    document.querySelectorAll('.social-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = card.querySelector('.social-name')?.textContent;
            handleSocialClick(platform);
        });
    });
    
    // Handle touch events for mobile
    document.addEventListener('touchstart', () => {}, {passive: true});
}

// ===== HANDLERS =====
function handleConnectWallet() {
    const btn = document.querySelector('.connect-wallet-btn');
    btn.innerHTML = '<i data-lucide="loader" class="icon-sm"></i><span>Connecting...</span>';
    btn.disabled = true;
    
    // Simulate wallet connection
    setTimeout(() => {
        btn.innerHTML = '<i data-lucide="check" class="icon-sm"></i><span>Connected</span>';
        btn.style.background = 'rgba(16, 185, 129, 0.1)';
        btn.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        
        // Re-initialize icons
        lucide.createIcons();
    }, 1500);
}

function handleSocialClick(platform) {
    const urls = {
        'Telegram': 'https://t.me/oxyxfinance',
        'Twitter / X': 'https://twitter.com/OXYXFinance',
        'Documentation': 'https://docs.oxyx.finance',
        'GitHub': 'https://github.com/oxyxfinance',
        'Discord': 'https://discord.gg/oxyx',
        'Medium': 'https://medium.com/@oxyxfinance'
    };
    
    if (platform && urls[platform]) {
        window.open(urls[platform], '_blank');
    }
}

// ===== UTILITIES =====
function initializeIcons() {
    // Ensure Lucide icons are initialized
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
    }
});

// ===== MOBILE FIXES =====
// Prevent pull-to-refresh on mobile
document.body.addEventListener('touchmove', (e) => {
    if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        e.preventDefault();
    }
}, { passive: false });

// Fix for 100vh on mobile
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVH);
setVH();

// Handle back button
window.addEventListener('popstate', () => {
    // Maintain section state
    const hash = window.location.hash.slice(1) || 'home';
    if (document.getElementById(hash)) {
        switchSection(hash);
    }
});

// Set initial hash
if (!window.location.hash) {
    window.location.hash = 'home';
}
