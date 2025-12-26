// Shared Footer Component
// This allows you to update footer in one place

/**
 * Get footer HTML
 * Returns a modern footer with contact information and links
 */
function getFooter() {
    return `
    <!-- Footer -->
    <footer class="footer-modern">
        <div class="container">
            <div class="footer-main">
                <div class="footer-left">
                    <div class="footer-brand-block">
                        <div class="footer-logo-large">✈️</div>
                        <h1 class="footer-title">Two Days<br>Pilot</h1>
                    </div>
                    <p class="footer-description">Experience the sky like never before. Your journey to aviation excellence starts here.</p>
                </div>
                
                <div class="footer-right">
                    <div class="footer-grid">
                        <div class="footer-nav-block">
                            <span class="footer-label">Navigate</span>
                            <nav class="footer-nav">
                                <a href="index.html" class="footer-nav-link">Home</a>
                                <a href="services.html" class="footer-nav-link">Services</a>
                                <a href="about.html" class="footer-nav-link">About</a>
                                <a href="booking.html" class="footer-nav-link">Book Now</a>
                            </nav>
                        </div>
                        
                        <div class="footer-contact-block">
                            <span class="footer-label">Get in Touch</span>
                            <div class="footer-contact-info">
                                <a href="tel:+601121082839" class="footer-contact-link">
                                    <span class="contact-label">Phone</span>
                                    <span class="contact-value">+60 11 2108 2839</span>
                                </a>
                                <a href="mailto:m.h.jibreel@gmail.com" class="footer-contact-link">
                                    <span class="contact-label">Email</span>
                                    <span class="contact-value">m.h.jibreel@gmail.com</span>
                                </a>
                                <div class="footer-contact-link">
                                    <span class="contact-label">Location</span>
                                    <span class="contact-value">Cyberjaya, Selangor</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>`;
}

/**
 * Initialize footer
 * Call this function to replace or insert the footer
 */
function initFooter() {
    // Check if we're in an admin directory
    const isAdminPage = window.location.pathname.includes('/admin/');
    
    // Find existing footer and replace it
    const existingFooter = document.querySelector('footer.footer, footer.footer-modern');
    if (existingFooter) {
        let footerHTML = getFooter();
        
        // Adjust links for admin pages
        if (isAdminPage) {
            footerHTML = footerHTML.replace(/href="([^"]+)"/g, (match, path) => {
                // Skip external links and anchors
                if (path.startsWith('http') || path.startsWith('#')) {
                    return match;
                }
                // Add ../ prefix for relative paths
                if (!path.startsWith('../') && !path.startsWith('/')) {
                    return `href="../${path}"`;
                }
                return match;
            });
        }
        
        existingFooter.outerHTML = footerHTML;
    } else {
        // If no footer exists, insert before closing body tag
        let footerHTML = getFooter();
        
        // Adjust links for admin pages
        if (isAdminPage) {
            footerHTML = footerHTML.replace(/href="([^"]+)"/g, (match, path) => {
                if (path.startsWith('http') || path.startsWith('#')) {
                    return match;
                }
                if (!path.startsWith('../') && !path.startsWith('/')) {
                    return `href="../${path}"`;
                }
                return match;
            });
        }
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

