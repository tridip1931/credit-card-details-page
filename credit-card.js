// ===================================
// GLOBAL VARIABLES
// ===================================

// Flag to prevent scroll detection from overriding manual navigation
let isManualNavigation = false;

// ===================================
// DOM READY EVENT LISTENER
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initFAQ();
    initStickyCTA();
    initAnchorLink();
    initScrollAnimation();
    
    console.log('Credit card page initialized');
});

// ===================================
// MOBILE NAVIGATION
// ===================================

/**
 * Initialize mobile navigation toggle
 * Toggles the mobile menu when hamburger button is clicked
 */
function initMobileNavigation() {
    const navbarToggle = document.getElementById('navbarToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!navbarToggle || !mobileMenu) {
        console.warn('Navigation elements not found');
        return;
    }
    
    navbarToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navbarToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// ===================================
// FAQ ACCORDION
// ===================================

/**
 * Initialize FAQ accordion functionality
 * Toggles FAQ items to show/hide answers
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Smooth scroll to element
 * @param {string} target - Selector of target element
 */
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'SGD')
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'SGD') {
    return new Intl.NumberFormat('en-SG', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// STICKY CTA
// ===================================

/**
 * Initialize sticky CTA scroll behavior
 * Shows sticky CTA when user scrolls past the "Apply now" button
 */
function initStickyCTA() {
    const applyButton = document.querySelector('.btn-apply');
    const productCTA = document.getElementById('productStickyCTA');
    const anchorLink = document.getElementById('anchorLinkMobile');
    
    if (!applyButton || !productCTA || !anchorLink) {
        console.warn('Sticky CTA elements not found');
        return;
    }
    
    // Calculate trigger point (bottom of apply button)
    function getTriggerPoint() {
        const rect = applyButton.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return rect.top + scrollTop + rect.height;
    }
    
    // Handle scroll event with debounce for performance
    const handleScroll = debounce(function() {
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        const triggerPoint = getTriggerPoint();
        
        if (scrollPos > triggerPoint) {
            // Show sticky CTA and make anchor link sticky
            productCTA.classList.add('visible');
            anchorLink.classList.add('sticky-active');
            
            // Calculate and set top position for anchor link (height of sticky CTA)
            const ctaHeight = productCTA.offsetHeight;
            anchorLink.style.top = ctaHeight + 'px';
        } else {
            // Hide sticky CTA and remove sticky from anchor link
            productCTA.classList.remove('visible');
            anchorLink.classList.remove('sticky-active');
            anchorLink.style.top = '';
        }
    }, 10);
    
    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position
    handleScroll();
}

// ===================================
// ANCHOR LINK
// ===================================

/**
 * Initialize anchor link expand/collapse functionality
 */
function initAnchorLink() {
    const anchorLink = document.getElementById('anchorLinkMobile');
    const toggleButton = document.getElementById('anchorLinkToggle');
    const anchorOptions = document.querySelectorAll('.anchor-link-option');
    const currentText = document.getElementById('anchorLinkCurrent');
    const anchorWrapper = document.querySelector('.anchor-link-wrapper');
    
    if (!anchorLink || !toggleButton) {
        console.warn('Anchor link elements not found');
        return;
    }
    
    // Function to toggle expand/collapse
    const toggleExpanded = () => {
        anchorLink.classList.toggle('expanded');
        
        // Update aria-label
        const isExpanded = anchorLink.classList.contains('expanded');
        toggleButton.setAttribute('aria-label', isExpanded ? 'Collapse' : 'Expand');
        
        // Clean up any running animations when toggling
        if (currentText) {
            const wrappers = currentText.querySelectorAll('.anchor-text-wrapper');
            wrappers.forEach(wrapper => {
                wrapper.classList.remove('sliding-out-up', 'sliding-out-down', 'sliding-in-from-bottom', 'sliding-in-from-top');
            });
        }
    };
    
    // Add click listener to entire wrapper
    if (anchorWrapper) {
        anchorWrapper.addEventListener('click', (e) => {
            // Don't toggle if clicking on an anchor link option
            if (!e.target.closest('.anchor-link-option')) {
                e.preventDefault();
                toggleExpanded();
            }
        });
    }
    
    // Keep toggle button listener for accessibility (keyboard navigation)
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent double toggle from wrapper click
        toggleExpanded();
    });
    
    // Handle anchor link clicks
    anchorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent triggering wrapper click
            
            const sectionId = option.getAttribute('href').substring(1);
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                // Set flag to prevent scroll detection from changing active state
                isManualNavigation = true;
                
                // Calculate scroll position
                const targetOffset = targetSection.offsetTop;
                const stickyCTA = document.getElementById('productStickyCTA');
                const anchorLinkElement = document.getElementById('anchorLinkMobile');

                // Always calculate for both sticky elements being active at destination
                let offset = 0;

                // Product Sticky CTA - will be visible at destination
                if (stickyCTA) {
                    offset += stickyCTA.offsetHeight || 70; // Fallback height
                }

                // Anchor link - will be sticky at destination (use collapsed height)
                if (anchorLinkElement) {
                    // Use collapsed height, not current offsetHeight (which might be expanded)
                    // Collapsed: padding 33px + content ~23px = ~56px
                    const collapsedHeight = 56;
                    offset += collapsedHeight;
                }

                // Add small visual buffer for comfortable spacing (reduced from 24)
                offset += 8;
                
                window.scrollTo({
                    top: targetOffset - offset,
                    behavior: 'smooth'
                });
                
                // Update active state immediately
                anchorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update collapsed state text immediately
                if (currentText) {
                    const newText = option.querySelector('.anchor-link-text').textContent;
                    let wrapper = currentText.querySelector('.anchor-text-wrapper');
                    if (!wrapper) {
                        currentText.innerHTML = `<span class="anchor-text-wrapper">${newText}</span>`;
                    } else {
                        wrapper.classList.remove('sliding-out-up', 'sliding-out-down', 'sliding-in-from-bottom', 'sliding-in-from-top');
                        wrapper.textContent = newText;
                        const allWrappers = currentText.querySelectorAll('.anchor-text-wrapper');
                        allWrappers.forEach((w, index) => {
                            if (index > 0) w.remove();
                        });
                    }
                }
                
                // Collapse anchor link after delay
                setTimeout(() => {
                    anchorLink.classList.remove('expanded');
                    toggleButton.setAttribute('aria-label', 'Expand');

                    // Clean up animations
                    if (currentText) {
                        const wrappers = currentText.querySelectorAll('.anchor-text-wrapper');
                        wrappers.forEach(wrapper => {
                            wrapper.classList.remove('sliding-out-up', 'sliding-out-down', 'sliding-in-from-bottom', 'sliding-in-from-top');
                        });
                    }
                }, 300);

                // Clear flag after scroll animation completes (smooth scroll takes ~800ms)
                setTimeout(() => {
                    isManualNavigation = false;
                }, 1000);
            }
        });
    });
}

// ===================================
// SCROLL ANIMATION
// ===================================

/**
 * Initialize scroll-based animation for anchor links
 * Animates opacity from 0% to 100% as user scrolls through sections
 */
function initScrollAnimation() {
    const anchorLink = document.getElementById('anchorLinkMobile');
    const anchorOptions = document.querySelectorAll('.anchor-link-option');
    const currentText = document.getElementById('anchorLinkCurrent');
    
    const sections = [
        { id: 'about', element: document.getElementById('about') },
        { id: 'redeem', element: document.getElementById('redeem') },
        { id: 'fees', element: document.getElementById('fees') },
        { id: 'earn', element: document.getElementById('earn') },
        { id: 'deals', element: document.getElementById('deals') },
        { id: 'manage', element: document.getElementById('manage') },
        { id: 'faq', element: document.getElementById('faq') },
        { id: 'terms', element: document.getElementById('terms') }
    ];
    
    // Track previous scroll position and section
    let lastScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    let lastSectionId = null;
    
    const handleScroll = debounce(() => {
        // Don't animate opacity when expanded
        const isExpanded = anchorLink && anchorLink.classList.contains('expanded');

        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        // Calculate dynamic trigger offset based on sticky elements (collapsed state)
        const stickyCTA = document.getElementById('productStickyCTA');
        const anchorLinkElement = document.getElementById('anchorLinkMobile');
        let triggerOffset = 0;

        if (stickyCTA) {
            triggerOffset += stickyCTA.offsetHeight || 70;
        }
        if (anchorLinkElement) {
            triggerOffset += anchorLinkElement.offsetHeight || 60;
        }
        triggerOffset += 8; // Visual buffer (same as navigation scroll)
        
        // Determine scroll direction
        const scrollDirection = scrollPos > lastScrollPos ? 'down' : 'up';
        lastScrollPos = scrollPos;
        
        // Find current section
        let currentSection = sections[0];
        let currentSectionIndex = 0;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.element && scrollPos + triggerOffset >= section.element.offsetTop) {
                currentSection = section;
                currentSectionIndex = i;
                break;
            }
        }
        
        // Calculate progress through sections and animate opacity
        sections.forEach((section, index) => {
            const option = document.querySelector(`[data-section="${section.id}"]`);
            if (!option || !section.element) return;
            
            // When expanded, keep all options fully visible
            if (isExpanded) {
                option.style.opacity = 1;
            } else {
                // When collapsed, animate based on scroll
                const sectionTop = section.element.offsetTop;
                const sectionHeight = section.element.offsetHeight;
                
                // Calculate opacity based on scroll position
                // Fade in as user approaches section, fully visible when in section
                let opacity = 0;
                
                if (index <= currentSectionIndex) {
                    // Sections before and including current: fully visible
                    if (scrollPos + triggerOffset >= sectionTop) {
                        opacity = 1;
                    } else {
                        // Fade in as approaching
                        const distance = sectionTop - (scrollPos + triggerOffset);
                        const fadeDistance = viewportHeight * 0.5;
                        opacity = Math.max(0, 1 - (distance / fadeDistance));
                    }
                } else {
                    // Future sections: fade in as approaching
                    if (scrollPos + triggerOffset < sectionTop) {
                        const distance = sectionTop - (scrollPos + triggerOffset);
                        const fadeDistance = viewportHeight * 0.3;
                        opacity = Math.max(0, Math.min(1, 1 - (distance / fadeDistance)));
                    } else {
                        opacity = 1;
                    }
                }
                
                option.style.opacity = opacity;
            }
            
            // Update active state (skip if manual navigation is in progress)
            if (section.id === currentSection.id && !isManualNavigation) {
                option.classList.add('active');

                // Update collapsed state text with sequential animation
                if (currentText && !isExpanded) {
                    const newText = option.querySelector('.anchor-link-text').textContent;
                    
                    // Only animate if section actually changed
                    if (lastSectionId !== currentSection.id) {
                        lastSectionId = currentSection.id;
                        
                        // Get or create current text wrapper
                        let wrapper = currentText.querySelector('.anchor-text-wrapper');
                        
                        if (!wrapper) {
                            // First time - just set the text without animation
                            currentText.innerHTML = `<span class="anchor-text-wrapper">${newText}</span>`;
                        } else {
                            // Get the current text content
                            const oldText = wrapper.textContent;
                            
                            // Only animate if text actually changed
                            if (oldText !== newText) {
                                // Determine animation classes based on scroll direction
                                const outClass = scrollDirection === 'down' ? 'sliding-out-up' : 'sliding-out-down';
                                const inClass = scrollDirection === 'down' ? 'sliding-in-from-bottom' : 'sliding-in-from-top';
                                
                                // Remove any existing animation classes
                                wrapper.classList.remove('sliding-out-up', 'sliding-out-down', 'sliding-in-from-bottom', 'sliding-in-from-top');
                                
                                // Step 1: Slide out the old text
                                wrapper.classList.add(outClass);
                                
                                // Step 2: After slide-out completes, update text and slide in
                                setTimeout(() => {
                                    // Update text content
                                    wrapper.textContent = newText;
                                    
                                    // Remove old animation class
                                    wrapper.classList.remove(outClass);
                                    
                                    // Trigger reflow
                                    void wrapper.offsetWidth;
                                    
                                    // Slide in new text
                                    wrapper.classList.add(inClass);
                                    
                                    // Clean up after slide-in completes
                                    setTimeout(() => {
                                        wrapper.classList.remove(inClass);
                                    }, 250); // Match slide-in duration
                                }, 200); // Match slide-out duration
                            }
                        }
                    }
                }
            } else if (!isManualNavigation) {
                // Only remove active class if not during manual navigation
                option.classList.remove('active');
            }
        });
    }, 10);
    
    // Initialize wrapper on page load if it doesn't exist
    if (currentText && !currentText.querySelector('.anchor-text-wrapper')) {
        // Get initial text from HTML content or default to first section
        const initialText = currentText.textContent.trim() || (sections[0] && document.querySelector(`[data-section="${sections[0].id}"]`)?.querySelector('.anchor-link-text')?.textContent) || 'About POSB Everyday Card';
        currentText.innerHTML = `<span class="anchor-text-wrapper">${initialText}</span>`;
        if (sections[0]) {
            lastSectionId = sections[0].id;
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
}

// ===================================
// FUTURE ENHANCEMENTS
// ===================================

/*
 * TODO: Add form validation for credit card application
 * TODO: Implement smooth animations for page sections
 * TODO: Add lazy loading for images
 * TODO: Implement search functionality
 * TODO: Add cookie consent banner
 * TODO: Integrate with analytics tracking
 * TODO: Add error boundary for JavaScript errors
 * TODO: Implement progressive web app features
 */

