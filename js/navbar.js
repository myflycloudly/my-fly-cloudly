// Shared Navigation Component
// This allows you to update navigation in one place

/**
 * Get regular user navigation HTML
 * Dynamically shows Login/Logout/Dashboard/Admin based on auth status
 */
function getRegularNavbar(activePage = '') {
    // Check if auth functions are available (they should be loaded before navbar.js)
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const isUserAdmin = (typeof isAdmin === 'function') ? isAdmin() : false;

    // Get current language
    const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';

    // Base pages (always shown)
    const basePages = [
        { href: 'index.html', label: typeof t === 'function' ? t('nav.home') : 'Home' },
        { href: 'services.html', label: typeof t === 'function' ? t('nav.services') : 'Services' },
        { href: 'about.html', label: typeof t === 'function' ? t('nav.about') : 'About' }
    ];

    // Auth pages (shown based on login status)
    let authPages = [];
    if (user) {
        // User is logged in
        if (isUserAdmin) {
            // Admin users see full admin navigation menu
            authPages.push({ href: 'admin/index.html', label: typeof t === 'function' ? t('nav.admin') : 'Admin' });
            authPages.push({ href: 'admin/bookings.html', label: typeof t === 'function' ? t('nav.bookings') : 'Bookings' });
            authPages.push({ href: 'admin/services.html', label: typeof t === 'function' ? t('nav.services') : 'Services' });
            authPages.push({ href: 'admin/users.html', label: typeof t === 'function' ? t('nav.users') : 'Users' });
            authPages.push({ href: 'admin/admins.html', label: typeof t === 'function' ? t('nav.admins') : 'Admins' });
        } else {
            // Regular users see Dashboard
            authPages.push({ href: 'dashboard.html', label: typeof t === 'function' ? t('nav.dashboard') : 'Dashboard' });
        }
    } else {
        // User is not logged in
        authPages.push({ href: 'login.html', label: typeof t === 'function' ? t('nav.login') : 'Login' });
    }

    const allPages = [...basePages, ...authPages];

    const navItems = allPages.map(page => {
        // Determine if this page is active
        let isActive = false;
        if (activePage === 'index.html' && page.href === 'index.html') {
            isActive = true;
        } else if (activePage && page.href.includes(activePage)) {
            isActive = true;
        } else if (!activePage && page.href === 'index.html') {
            isActive = true; // Default active for home
        }

        const active = isActive ? ' class="active"' : '';
        return `<li><a href="${page.href}"${active}>${page.label}</a></li>`;
    }).join('\n                    ');

    // Add logout button if user is logged in
    const logoutButton = user ? `\n                    <li><a href="#" id="navLogout">${typeof t === 'function' ? t('nav.logout') : 'Logout'}</a></li>` : '';

    // Language switcher button (using currentLang from above)
    const langButton = `
                    <li class="lang-switcher">
                        <button id="langToggle" class="lang-btn" aria-label="Switch language">
                            <span class="lang-icon">🌐</span>
                            <span class="lang-text">${currentLang === 'ar' ? 'EN' : 'AR'}</span>
                        </button>
                    </li>`;

    return `
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <a href="index.html">
                        <img src="logo.jpeg" alt="MY FLY CLOUDLY TOURS" class="logo-image" style="height: 45px; width: auto;">
                        <span class="logo-text">MY FLY CLOUDLY TOURS</span>
                    </a>
                </div>
                <ul class="nav-menu">
                    ${navItems}${logoutButton}${langButton}
                </ul>
                <button class="burger-button" aria-label="Open the menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>
    <!-- Tuxdi-style Mobile Navigation -->
    <nav class="tuxdi-nav" id="tuxdiNav">
        <div class="tuxdi-nav-inner">
            <!-- Close button inside the menu -->
            <button class="tuxdi-close-btn" aria-label="Close menu">
                <span></span>
                <span></span>
            </button>
            <div class="tuxdi-nav-links-container">
                <div class="tuxdi-nav-links">
                    ${allPages.map(page => {
        const isActive = (activePage === 'index.html' && page.href === 'index.html') ||
            (activePage && page.href.includes(activePage)) ||
            (!activePage && page.href === 'index.html');
        return `<div class="tuxdi-nav-link">
                            <a class="tuxdi-link-label ${isActive ? 'active' : ''}" href="${page.href}">${page.label.toLowerCase()}</a>
                        </div>`;
    }).join('')}
                    ${user ? `<div class="tuxdi-nav-link logout-visible"><a class="tuxdi-link-label" href="javascript:void(0)" id="navLogout">logout</a></div>` : ''}
                    <div class="tuxdi-nav-link">
                        <button id="langToggleMobile" class="tuxdi-link-label lang-btn-mobile" style="background: transparent; border: none; color: white; font-size: inherit; font-family: inherit; cursor: pointer; width: 100%; text-align: left; padding: 0;">
                            <span class="lang-icon">🌐</span>
                            <span class="lang-text">${currentLang === 'ar' ? 'EN' : 'AR'}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="tuxdi-nav-contacts-container">
                <a href="https://wa.me/601160609261" class="tuxdi-contact-btn" target="_blank">CONTACT US</a>
                <div class="tuxdi-nav-contacts">
                    <div class="tuxdi-nav-data-item">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4.71" y="9.21" width="30.48" height="20.99" rx="2" stroke="#AF2EFF" stroke-width="4.06"/>
                            <path d="M19.95 21.4L6.06 10.57L33.23 10.89L19.95 21.4Z" fill="#AF2EFF" stroke="#AF2EFF" stroke-width="2.71"/>
                            <path d="M33.15 28.18L25.71 21.4" stroke="#AF2EFF" stroke-width="2.03"/>
                            <path d="M6.74 28.18L14.19 21.4" stroke="#AF2EFF" stroke-width="2.03"/>
                        </svg>
                        <a href="mailto:info@twodayspilot.com">m.h.jibreel@gmail.com</a>
                    </div>
                    <div class="tuxdi-nav-data-item">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28.9 3C30.06 3 31 3.94 31 5.1V34.9C31 36.06 30.06 37 28.9 37H11.1C9.94 37 9 36.06 9 34.9V5.1C9 3.94 9.94 3 11.1 3H28.9Z" stroke="#AF2EFF" stroke-width="4.06"/>
                            <path d="M19.99 35.19C20.86 35.19 21.57 34.49 21.57 33.62C21.57 32.75 20.86 32.05 19.99 32.05C19.13 32.05 18.42 32.75 18.42 33.62C18.42 34.49 19.13 35.19 19.99 35.19Z" fill="#AF2EFF"/>
                        </svg>
                        <a href="tel:+601160609261">+60 11-6060 9261</a>
                    </div>
                </div>
                <div class="tuxdi-nav-social-container">
                    <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                        <svg width="40" height="40" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.76 39V27.16H30.76L31.35 22.52H26.76V19.57C26.76 18.23 27.13 17.32 29.05 17.32H31.49V13.18C30.3 13.06 29.11 13 27.92 13C24.39 13 21.97 15.16 21.97 19.11V22.51H18V27.15H21.98V39H26.76Z" fill="white"/>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" aria-label="Instagram">
                        <svg width="40" height="40" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.47 16.26C20.82 16.26 19.24 16.91 18.08 18.08C16.91 19.24 16.26 20.82 16.26 22.47C16.26 24.12 16.91 25.7 18.08 26.86C19.24 28.03 20.82 28.68 22.47 28.68C24.12 28.68 25.7 28.03 26.86 26.86C28.03 25.7 28.68 24.12 28.68 22.47C28.68 20.82 28.03 19.24 26.86 18.08C25.7 16.91 24.12 16.26 22.47 16.26ZM22.47 26.5C21.4 26.5 20.37 26.08 19.62 25.32C18.86 24.57 18.44 23.54 18.44 22.47C18.44 21.4 18.86 20.37 19.62 19.62C20.37 18.86 21.4 18.43 22.47 18.43C23.54 18.43 24.57 18.86 25.33 19.62C26.08 20.37 26.51 21.4 26.51 22.47C26.51 23.54 26.08 24.57 25.33 25.32C24.57 26.08 23.54 26.5 22.47 26.5Z" fill="white"/>
                            <path d="M28.93 17.48C29.73 17.48 30.38 16.83 30.38 16.03C30.38 15.23 29.73 14.58 28.93 14.58C28.13 14.58 27.48 15.23 27.48 16.03C27.48 16.83 28.13 17.48 28.93 17.48Z" fill="white"/>
                            <path d="M33.94 14.56C33.63 13.75 33.15 13.03 32.54 12.42C31.93 11.81 31.2 11.33 30.4 11.02C29.46 10.67 28.47 10.48 27.46 10.46C26.17 10.4 25.76 10.38 22.48 10.38C19.2 10.38 18.78 10.38 17.49 10.46C16.49 10.48 15.5 10.67 14.56 11.02C13.76 11.33 13.03 11.81 12.42 12.42C11.81 13.02 11.33 13.75 11.02 14.56C10.67 15.5 10.48 16.49 10.46 17.49C10.4 18.79 10.38 19.2 10.38 22.48C10.38 25.76 10.38 26.18 10.46 27.46C10.48 28.47 10.67 29.46 11.02 30.4C11.33 31.2 11.81 31.93 12.42 32.54C13.03 33.15 13.76 33.63 14.56 33.94C15.5 34.3 16.49 34.51 17.5 34.54C18.79 34.6 19.2 34.62 22.48 34.62C25.76 34.62 26.18 34.62 27.47 34.54C28.47 34.52 29.46 34.33 30.4 33.98C31.21 33.67 31.93 33.19 32.54 32.58C33.15 31.97 33.63 31.24 33.94 30.44C34.29 29.5 34.48 28.51 34.5 27.5C34.56 26.21 34.58 25.8 34.58 22.52C34.58 19.24 34.58 18.82 34.5 17.54C34.49 16.52 34.3 15.51 33.94 14.56ZM32.3 27.36C32.29 28.14 32.15 28.9 31.88 29.63C31.68 30.15 31.37 30.63 30.98 31.02C30.58 31.42 30.11 31.73 29.58 31.93C28.86 32.2 28.11 32.34 27.34 32.35C26.06 32.41 25.7 32.42 22.43 32.42C19.15 32.42 18.82 32.42 17.52 32.35C16.75 32.34 16 32.2 15.28 31.93C14.75 31.73 14.28 31.42 13.88 31.03C13.48 30.63 13.17 30.15 12.97 29.63C12.7 28.91 12.56 28.15 12.55 27.39C12.49 26.11 12.48 25.75 12.48 22.48C12.48 19.21 12.48 18.87 12.55 17.57C12.56 16.8 12.7 16.03 12.97 15.3C13.38 14.24 14.22 13.41 15.28 13C16 12.74 16.75 12.6 17.52 12.59C18.8 12.53 19.16 12.51 22.43 12.51C25.7 12.51 26.04 12.51 27.34 12.59C28.11 12.59 28.86 12.74 29.58 13C30.11 13.21 30.58 13.51 30.98 13.91C31.37 14.31 31.68 14.78 31.88 15.3C32.15 16.02 32.29 16.78 32.3 17.55C32.36 18.82 32.37 19.18 32.37 22.46C32.37 25.73 32.37 26.08 32.32 27.36H32.3Z" fill="white"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </nav>`;
}

/**
 * Get admin navigation HTML
 * Call this function to get the navigation HTML for admin pages
 */
function getAdminNavbar(activePage = '') {
    // Get current language
    const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';

    const pages = [
        { href: '../index.html', label: typeof t === 'function' ? t('nav.home') : 'Home' },
        { href: 'index.html', label: typeof t === 'function' ? t('nav.admin') : 'Admin' },
        { href: 'bookings.html', label: typeof t === 'function' ? t('nav.bookings') : 'Bookings' },
        { href: 'services.html', label: typeof t === 'function' ? t('nav.services') : 'Services' },
        { href: 'slider.html', label: typeof t === 'function' ? t('nav.slider') : 'Slider' },
        { href: 'users.html', label: typeof t === 'function' ? t('nav.users') : 'Users' },
        { href: 'admins.html', label: typeof t === 'function' ? t('nav.admins') : 'Admins' }
    ];

    const navItems = pages.map(page => {
        const active = page.href.includes(activePage) ? ' class="active"' : '';
        return `<li><a href="${page.href}"${active}>${page.label}</a></li>`;
    }).join('\n                    ');

    return `
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <a href="../index.html">
                        <img src="../logo.jpeg" alt="MY FLY CLOUDLY TOURS" class="logo-image" style="height: 45px; width: auto;">
                        <span class="logo-text">MY FLY CLOUDLY TOURS</span>
                    </a>
                </div>
                <ul class="nav-menu">
                    ${navItems}
                    <li><a href="#" id="logoutBtn">${typeof t === 'function' ? t('nav.logout') : 'Logout'}</a></li>
                    <li class="lang-switcher">
                        <button id="langToggle" class="lang-btn" aria-label="Switch language">
                            <span class="lang-icon">🌐</span>
                            <span class="lang-text">${currentLang === 'ar' ? 'EN' : 'AR'}</span>
                        </button>
                    </li>
                </ul>
                <button class="burger-button" aria-label="Open the menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>
    <!-- Tuxdi-style Mobile Navigation -->
    <nav class="tuxdi-nav" id="tuxdiNav">
        <div class="tuxdi-nav-inner">
            <!-- Close button inside the menu -->
            <button class="tuxdi-close-btn" aria-label="Close menu">
                <span></span>
                <span></span>
            </button>
            <div class="tuxdi-nav-links-container">
                <div class="tuxdi-nav-links">
                    ${pages.map(page => {
        const isActive = page.href.includes(activePage);
        return `<div class="tuxdi-nav-link">
                            <a class="tuxdi-link-label ${isActive ? 'active' : ''}" href="${page.href}">${page.label.toLowerCase()}</a>
                        </div>`;
    }).join('')}
                    <div class="tuxdi-nav-link logout-visible"><a class="tuxdi-link-label" href="javascript:void(0)" id="navLogout">logout</a></div>
                    <div class="tuxdi-nav-link">
                        <button id="langToggleMobile" class="tuxdi-link-label lang-btn-mobile" style="background: transparent; border: none; color: white; font-size: inherit; font-family: inherit; cursor: pointer; width: 100%; text-align: left; padding: 0;">
                            <span class="lang-icon">🌐</span>
                            <span class="lang-text">${currentLang === 'ar' ? 'EN' : 'AR'}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="tuxdi-nav-contacts-container">
                <a href="https://wa.me/601160609261" class="tuxdi-contact-btn" target="_blank">CONTACT US</a>
                <div class="tuxdi-nav-contacts">
                    <div class="tuxdi-nav-data-item">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4.71" y="9.21" width="30.48" height="20.99" rx="2" stroke="#AF2EFF" stroke-width="4.06"/>
                            <path d="M19.95 21.4L6.06 10.57L33.23 10.89L19.95 21.4Z" fill="#AF2EFF" stroke="#AF2EFF" stroke-width="2.71"/>
                            <path d="M33.15 28.18L25.71 21.4" stroke="#AF2EFF" stroke-width="2.03"/>
                            <path d="M6.74 28.18L14.19 21.4" stroke="#AF2EFF" stroke-width="2.03"/>
                        </svg>
                        <a href="mailto:info@twodayspilot.com">m.h.jibreel@gmail.com</a>
                    </div>
                    <div class="tuxdi-nav-data-item">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28.9 3C30.06 3 31 3.94 31 5.1V34.9C31 36.06 30.06 37 28.9 37H11.1C9.94 37 9 36.06 9 34.9V5.1C9 3.94 9.94 3 11.1 3H28.9Z" stroke="#AF2EFF" stroke-width="4.06"/>
                            <path d="M19.99 35.19C20.86 35.19 21.57 34.49 21.57 33.62C21.57 32.75 20.86 32.05 19.99 32.05C19.13 32.05 18.42 32.75 18.42 33.62C18.42 34.49 19.13 35.19 19.99 35.19Z" fill="#AF2EFF"/>
                        </svg>
                        <a href="tel:+601160609261">+60 11-6060 9261</a>
                    </div>
                </div>
                <div class="tuxdi-nav-social-container">
                    <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                        <svg width="40" height="40" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.76 39V27.16H30.76L31.35 22.52H26.76V19.57C26.76 18.23 27.13 17.32 29.05 17.32H31.49V13.18C30.3 13.06 29.11 13 27.92 13C24.39 13 21.97 15.16 21.97 19.11V22.51H18V27.15H21.98V39H26.76Z" fill="white"/>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" aria-label="Instagram">
                        <svg width="40" height="40" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.47 16.26C20.82 16.26 19.24 16.91 18.08 18.08C16.91 19.24 16.26 20.82 16.26 22.47C16.26 24.12 16.91 25.7 18.08 26.86C19.24 28.03 20.82 28.68 22.47 28.68C24.12 28.68 25.7 28.03 26.86 26.86C28.03 25.7 28.68 24.12 28.68 22.47C28.68 20.82 28.03 19.24 26.86 18.08C25.7 16.91 24.12 16.26 22.47 16.26ZM22.47 26.5C21.4 26.5 20.37 26.08 19.62 25.32C18.86 24.57 18.44 23.54 18.44 22.47C18.44 21.4 18.86 20.37 19.62 19.62C20.37 18.86 21.4 18.43 22.47 18.43C23.54 18.43 24.57 18.86 25.33 19.62C26.08 20.37 26.51 21.4 26.51 22.47C26.51 23.54 26.08 24.57 25.33 25.32C24.57 26.08 23.54 26.5 22.47 26.5Z" fill="white"/>
                            <path d="M28.93 17.48C29.73 17.48 30.38 16.83 30.38 16.03C30.38 15.23 29.73 14.58 28.93 14.58C28.13 14.58 27.48 15.23 27.48 16.03C27.48 16.83 28.13 17.48 28.93 17.48Z" fill="white"/>
                            <path d="M33.94 14.56C33.63 13.75 33.15 13.03 32.54 12.42C31.93 11.81 31.2 11.33 30.4 11.02C29.46 10.67 28.47 10.48 27.46 10.46C26.17 10.4 25.76 10.38 22.48 10.38C19.2 10.38 18.78 10.38 17.49 10.46C16.49 10.48 15.5 10.67 14.56 11.02C13.76 11.33 13.03 11.81 12.42 12.42C11.81 13.02 11.33 13.75 11.02 14.56C10.67 15.5 10.48 16.49 10.46 17.49C10.4 18.79 10.38 19.2 10.38 22.48C10.38 25.76 10.38 26.18 10.46 27.46C10.48 28.47 10.67 29.46 11.02 30.4C11.33 31.2 11.81 31.93 12.42 32.54C13.03 33.15 13.76 33.63 14.56 33.94C15.5 34.3 16.49 34.51 17.5 34.54C18.79 34.6 19.2 34.62 22.48 34.62C25.76 34.62 26.18 34.62 27.47 34.54C28.47 34.52 29.46 34.33 30.4 33.98C31.21 33.67 31.93 33.19 32.54 32.58C33.15 31.97 33.63 31.24 33.94 30.44C34.29 29.5 34.48 28.51 34.5 27.5C34.56 26.21 34.58 25.8 34.58 22.52C34.58 19.24 34.58 18.82 34.5 17.54C34.49 16.52 34.3 15.51 33.94 14.56ZM32.3 27.36C32.29 28.14 32.15 28.9 31.88 29.63C31.68 30.15 31.37 30.63 30.98 31.02C30.58 31.42 30.11 31.73 29.58 31.93C28.86 32.2 28.11 32.34 27.34 32.35C26.06 32.41 25.7 32.42 22.43 32.42C19.15 32.42 18.82 32.42 17.52 32.35C16.75 32.34 16 32.2 15.28 31.93C14.75 31.73 14.28 31.42 13.88 31.03C13.48 30.63 13.17 30.15 12.97 29.63C12.7 28.91 12.56 28.15 12.55 27.39C12.49 26.11 12.48 25.75 12.48 22.48C12.48 19.21 12.48 18.87 12.55 17.57C12.56 16.8 12.7 16.03 12.97 15.3C13.38 14.24 14.22 13.41 15.28 13C16 12.74 16.75 12.6 17.52 12.59C18.8 12.53 19.16 12.51 22.43 12.51C25.7 12.51 26.04 12.51 27.34 12.59C28.11 12.59 28.86 12.74 29.58 13C30.11 13.21 30.58 13.51 30.98 13.91C31.37 14.31 31.68 14.78 31.88 15.3C32.15 16.02 32.29 16.78 32.3 17.55C32.36 18.82 32.37 19.18 32.37 22.46C32.37 25.73 32.37 26.08 32.32 27.36H32.3Z" fill="white"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </nav>`;
}

/**
 * Initialize regular navbar
 * Call this in regular pages (not admin pages)
 */
function initRegularNavbar(activePage = '') {
    // Find existing navbar and replace it
    const existingNav = document.querySelector('nav.navbar');
    if (existingNav) {
        const navbarHTML = getRegularNavbar(activePage);
        existingNav.outerHTML = navbarHTML;
    } else {
        // If no navbar exists, insert before first section or header
        const firstSection = document.querySelector('section, header');
        if (firstSection && firstSection.parentNode) {
            const navbarHTML = getRegularNavbar(activePage);
            firstSection.insertAdjacentHTML('beforebegin', navbarHTML);
        }
    }

    // Add logout handler
    const logoutBtn = document.getElementById('navLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (signOut) {
                await signOut();
            }
            window.location.href = 'index.html';
        });
    }

    // Initialize mobile menu after navbar is created
    initMobileMenu();

    // Initialize language switcher
    initLanguageSwitcher();
}

/**
 * Initialize admin navbar
 * Call this in admin pages to set up the navigation
 */
function initAdminNavbar(activePage = '') {
    // Find existing navbar and replace it
    const existingNav = document.querySelector('nav.navbar');
    if (existingNav) {
        const navbarHTML = getAdminNavbar(activePage);
        existingNav.outerHTML = navbarHTML;
    } else {
        // If no navbar exists, insert before first section or header
        const firstSection = document.querySelector('section, header');
        if (firstSection && firstSection.parentNode) {
            const navbarHTML = getAdminNavbar(activePage);
            firstSection.insertAdjacentHTML('beforebegin', navbarHTML);
        }
    }

    // Add logout handler for desktop logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (signOut) {
                await signOut();
            }
            window.location.href = '../index.html';
        });
    }

    // Initialize mobile menu after navbar is created
    initMobileMenu();

    // Initialize language switcher
    initLanguageSwitcher();
}

/**
 * Initialize language switcher button
 */
function initLanguageSwitcher() {
    // Handle desktop language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        // Remove any existing listeners to prevent duplicates
        const newLangToggle = langToggle.cloneNode(true);
        langToggle.parentNode.replaceChild(newLangToggle, langToggle);

        newLangToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (typeof getCurrentLanguage === 'function' && typeof setCurrentLanguage === 'function') {
                const currentLang = getCurrentLanguage();
                const newLang = currentLang === 'ar' ? 'en' : 'ar';

                setCurrentLanguage(newLang);

                // Reload page to apply translations
                window.location.reload();
            }
        });
    }

    // Handle mobile language toggle
    const langToggleMobile = document.getElementById('langToggleMobile');
    if (langToggleMobile) {
        // Remove any existing listeners to prevent duplicates
        const newLangToggleMobile = langToggleMobile.cloneNode(true);
        langToggleMobile.parentNode.replaceChild(newLangToggleMobile, langToggleMobile);

        newLangToggleMobile.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (typeof getCurrentLanguage === 'function' && typeof setCurrentLanguage === 'function') {
                const currentLang = getCurrentLanguage();
                const newLang = currentLang === 'ar' ? 'en' : 'ar';

                setCurrentLanguage(newLang);

                // Reload page to apply translations
                window.location.reload();
            }
        });
    }
}

/**
 * Initialize mobile menu toggle functionality
 * This must be called AFTER the navbar HTML is injected
 */
function initMobileMenu() {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
        const burgerButton = document.querySelector('.burger-button');
        const tuxdiNav = document.querySelector('.tuxdi-nav');
        const navbar = document.querySelector('.navbar');

        if (!burgerButton || !tuxdiNav) {
            return;
        }

        // Get the close button inside the menu
        const closeBtn = tuxdiNav.querySelector('.tuxdi-close-btn');

        // Function to close menu
        const closeMenu = () => {
            tuxdiNav.classList.remove('active');
            burgerButton.classList.remove('active');
            document.body.style.overflow = '';
            // Remove inline blur styles
            const body = document.body;
            const main = document.querySelector('main');
            if (body) {
                body.style.filter = '';
                body.style.webkitFilter = '';
                body.style.backdropFilter = '';
                body.style.webkitBackdropFilter = '';
            }
            if (main) {
                main.style.filter = '';
                main.style.webkitFilter = '';
                main.style.backdropFilter = '';
                main.style.webkitBackdropFilter = '';
            }
        };

        // Function to open menu
        const openMenu = () => {
            tuxdiNav.classList.add('active');
            burgerButton.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Remove navbar blur when menu opens
            if (navbar) {
                navbar.style.setProperty('backdrop-filter', 'none', 'important');
                navbar.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
                navbar.style.setProperty('filter', 'none', 'important');
                navbar.style.setProperty('-webkit-filter', 'none', 'important');
                navbar.classList.remove('scrolled');
                navbar.style.background = 'transparent';
                navbar.style.boxShadow = 'none';
                navbar.style.borderBottom = 'none';
            }
            // Remove blur from body and all content
            const body = document.body;
            const html = document.documentElement;
            const main = document.querySelector('main');
            if (body) {
                body.style.setProperty('filter', 'none', 'important');
                body.style.setProperty('-webkit-filter', 'none', 'important');
                body.style.setProperty('backdrop-filter', 'none', 'important');
                body.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
            }
            if (html) {
                html.style.setProperty('filter', 'none', 'important');
                html.style.setProperty('-webkit-filter', 'none', 'important');
                html.style.setProperty('backdrop-filter', 'none', 'important');
                html.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
            }
            if (main) {
                main.style.setProperty('filter', 'none', 'important');
                main.style.setProperty('-webkit-filter', 'none', 'important');
                main.style.setProperty('backdrop-filter', 'none', 'important');
                main.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
            }
        };

        // Burger button click - OPEN menu
        burgerButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!tuxdiNav.classList.contains('active')) {
                openMenu();
            }
        });

        // Close button click - CLOSE menu
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }

        // Add click listener for logout link if present in Tuxdi menu
        // Use longer delay to ensure DOM is fully loaded
        setTimeout(() => {
            const navLogout = document.getElementById('navLogout');

            if (navLogout) {
                navLogout.setAttribute('href', 'javascript:void(0)');

                const newLogout = navLogout.cloneNode(true);
                navLogout.parentNode.replaceChild(newLogout, navLogout);

                newLogout.onclick = function (e) {
                    e.preventDefault();
                };

                const handleLogout = async function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    try {
                        if (typeof signOut === 'function') {
                            await signOut();
                        } else {
                            localStorage.removeItem('user');
                            sessionStorage.clear();
                        }
                        closeMenu();
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 100);
                    } catch (error) {
                        localStorage.removeItem('user');
                        sessionStorage.clear();
                        closeMenu();
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 100);
                    }
                };

                newLogout.addEventListener('click', handleLogout, true);
                newLogout.addEventListener('click', handleLogout, false);

                tuxdiNav.addEventListener('click', async function (e) {
                    const clickedEl = e.target;
                    const isLogout = clickedEl.id === 'navLogout' ||
                        clickedEl.closest('#navLogout') ||
                        clickedEl.textContent.trim().toLowerCase() === 'logout';

                    if (isLogout) {
                        e.preventDefault();
                        e.stopPropagation();
                        closeMenu();

                        const isAdminPage = window.location.pathname.includes('/admin/');
                        const redirectPath = isAdminPage ? '../index.html' : 'index.html';

                        try {
                            if (typeof signOut === 'function') {
                                await signOut();
                            }
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.replace(redirectPath);
                        } catch (err) {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.replace(redirectPath);
                        }
                    }
                }, true);
            }
        }, 300);

        // Close menu when clicking outside (with small delay to avoid conflicts)
        // Store reference for cleanup
        let handleOutsideClick = null;
        setTimeout(() => {
            handleOutsideClick = (e) => {
                if (tuxdiNav.classList.contains('active') &&
                    !tuxdiNav.contains(e.target) &&
                    !burgerButton.contains(e.target)) {
                    closeMenu();
                }
            };
            document.addEventListener('click', handleOutsideClick);

            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                if (handleOutsideClick) {
                    document.removeEventListener('click', handleOutsideClick);
                }
            });
        }, 200);

        // Close menu when clicking a nav link (except logout, contact button, and external links)
        setTimeout(() => {
            const navLinks = tuxdiNav.querySelectorAll('.tuxdi-nav-link a');

            navLinks.forEach(link => {
                if (link.id === 'navLogout') {
                    return;
                }
                link.addEventListener('click', (e) => {
                    if (!link.hasAttribute('target')) {
                        closeMenu();
                    }
                });
            });
        }, 350);
    }, 50);
}
