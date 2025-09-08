document.addEventListener('DOMContentLoaded', () => {

    // --- AUTO YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    
    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', function() {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', !isVisible);
            mobileNavToggle.setAttribute('aria-expanded', !isVisible);
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('#primary-navigation a').forEach(link => {
        link.addEventListener('click', function() {
            if (primaryNav) {
                primaryNav.setAttribute('data-visible', 'false');
            }
            if (mobileNavToggle) {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- SCROLL ANIMATIONS ---
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Initialize and add scroll event listener
    handleScrollAnimation();
    window.addEventListener('scroll', throttle(handleScrollAnimation, 100));
    
    // --- DARK MODE TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const copyrightTrigger = document.getElementById('copyright-trigger');

    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        localStorage.setItem('theme', theme);

        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    };
    
    // Helper function to toggle theme
    const toggleTheme = () => {
        const currentTheme = body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };

    // Apply the saved theme from localStorage on page load
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || 'light');

    // Add the click listener for the main theme button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // --- MINI-GAME LOGIC ---
    const launchGameBtn = document.getElementById('launch-game');
    const gameModal = document.getElementById('game-modal');
    const closeBtn = document.querySelector('.close-button');
    const coinBalanceDisplay = document.getElementById('coin-balance');

    let coinBalance = localStorage.getItem('coins') || 0;
    coinBalanceDisplay.textContent = `Koinmu: ${coinBalance}`;

    const updateCoinBalance = (amount) => {
        coinBalance = parseInt(coinBalance) + amount;
        localStorage.setItem('coins', coinBalance);
        coinBalanceDisplay.textContent = `Koinmu: ${coinBalance}`;
        alert(`Selamat! Anda mendapatkan ${amount} koin. Total koinmu: ${coinBalance}`);
        
        // This is your simple reward system
        if (coinBalance >= 50) {
            // Change the portfolio hero image to something "useless" or funny
            const heroImage = document.querySelector('.about-image img');
            if (heroImage) {
                heroImage.src = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2JzM3JlbGZqMjN6cmZlOHBqY3pwaG9mb3l4YWQwdmE4eGNtOWl2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0Iyl5QyJj6dYd9h6/giphy.gif';
                heroImage.alt = 'Gajah menari';
                alert('Selamat! Anda telah membuka fitur rahasia!');
            }
        }
    };

    if (launchGameBtn) {
        launchGameBtn.addEventListener('click', () => {
            gameModal.style.display = 'block';
            // Start the game when the modal opens
            // (You'll define a startGame function in game.js)
            if (typeof startGame === 'function') {
                startGame(updateCoinBalance);
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            gameModal.style.display = 'none';
        });
    }

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === gameModal) {
            gameModal.style.display = 'none';
        }
    });
    
    // Add the click listener for the secret copyright trigger
    if (copyrightTrigger) {
        let clickCount = 0;
        let clickTimer = null;

        copyrightTrigger.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => clickCount = 0, 600);

            if (clickCount === 1) {
                toggleTheme();
                if (body.dataset.theme === 'dark') {
                    alert('Mode Gelap diaktifkan!');
                } else {
                    alert('Mode Terang kembali!');
                }
            } else if (clickCount === 3) {
                clickCount = 0;
                clearTimeout(clickTimer);
                window.location.href = 'secret.html';
            }
        });
    }

    // --- MUSIC TOGGLE ---
    const musicToggle = document.getElementById('music-toggle');
    const musik = document.getElementById('background-music');

    if (musik) {
        musik.volume = 0.7;
    }

    if (musicToggle && musik) {
        musicToggle.addEventListener('click', () => {
            if (musik.paused) {
                musik.play().catch(error => console.error("Audio play failed:", error));
                musicToggle.classList.add('playing');
            } else {
                musik.pause();
                musicToggle.classList.remove('playing');
            }
        });
    }
});

